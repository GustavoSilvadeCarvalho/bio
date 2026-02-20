import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!STRIPE_WEBHOOK_SECRET)
  console.warn(
    "STRIPE_WEBHOOK_SECRET not configured; webhook will fail signature validation",
  );
if (!SUPABASE_SERVICE_ROLE_KEY)
  console.warn(
    "SUPABASE_SERVICE_ROLE_KEY not configured; webhook cannot update profiles",
  );

// `stripe` typings expect a specific literal API version. Cast to `any`
// to avoid TypeScript literal mismatch while keeping runtime behavior.
const stripe = new Stripe(
  STRIPE_SECRET_KEY as any,
  { apiVersion: "2022-11-15" } as any,
);
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature") || "";
    const payload = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        STRIPE_WEBHOOK_SECRET,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${msg}` },
        { status: 400 },
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session & {
        metadata?: Record<string, string>;
      };
      const customerId = (session.customer as string) || undefined;
      const userId = session.metadata?.userId ?? undefined;
      const username = session.metadata?.username ?? undefined;

      if (!supabaseAdmin) {
        return NextResponse.json(
          { error: "Supabase service role key not configured on server" },
          { status: 500 },
        );
      }

      if (!userId && !username) {
        // nothing to link
        return NextResponse.json({ ok: true });
      }

      // try update by owner_id first
      if (userId) {
        const res = await supabaseAdmin
          .from("profiles")
          .update({ is_premium: true, stripe_customer_id: customerId ?? null })
          .eq("owner_id", userId);
        if (res.error) {
          return NextResponse.json(
            { error: res.error.message },
            { status: 500 },
          );
        }
        // if no rows updated and username present, try username
        // narrow `res.data` to `any` to avoid `never` inference from the
        // PostgREST response typings in this code path.
        const updatedData = (res as any).data;
        if (
          (!updatedData ||
            (Array.isArray(updatedData) && updatedData.length === 0)) &&
          username
        ) {
          const res2 = await supabaseAdmin
            .from("profiles")
            .update({
              is_premium: true,
              stripe_customer_id: customerId ?? null,
            })
            .eq("username", username);
          if (res2.error) {
            return NextResponse.json(
              { error: res2.error.message },
              { status: 500 },
            );
          }
        }
      } else if (username) {
        const res = await supabaseAdmin
          .from("profiles")
          .update({ is_premium: true, stripe_customer_id: customerId ?? null })
          .eq("username", username);
        if (res.error) {
          return NextResponse.json(
            { error: res.error.message },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
