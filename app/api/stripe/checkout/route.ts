import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!STRIPE_SECRET_KEY) console.warn("STRIPE_SECRET_KEY is not configured");
if (!STRIPE_PRICE_ID) console.warn("STRIPE_PRICE_ID is not configured");

// `stripe` typings expect a specific literal API version. Cast to `any`
// to avoid TypeScript literal mismatch while keeping runtime behavior.
const stripe = new Stripe(
  STRIPE_SECRET_KEY as any,
  { apiVersion: "2022-11-15" } as any,
);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

function hasSetAuth(
  client: unknown,
): client is { auth: { setAuth: (token: string | null) => void } } {
  if (!client || typeof client !== "object" || !("auth" in client))
    return false;
  const auth = (client as { [k: string]: unknown })["auth"] as unknown;
  return typeof (auth as { setAuth?: unknown }).setAuth === "function";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username =
      body && typeof body === "object" ? (body as any).username : undefined;

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1]
      : null;
    if (!token)
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 },
      );

    const authClient = supabaseAdmin ?? supabase;
    const { data: userData, error: userErr } = await authClient.auth.getUser(
      token as string,
    );
    if (userErr)
      return NextResponse.json({ error: userErr.message }, { status: 401 });
    const userId = (userData as any)?.user?.id ?? null;
    const email = (userData as any)?.user?.email ?? undefined;

    if (!userId)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    // find profile by username if provided, otherwise by owner_id
    const db = supabaseAdmin ?? supabase;
    let profileRes;
    if (username) {
      profileRes = await db
        .from("profiles")
        .select("id, owner_id, stripe_customer_id")
        .eq("username", username)
        .maybeSingle();
    } else {
      profileRes = await db
        .from("profiles")
        .select("id, owner_id, stripe_customer_id")
        .eq("owner_id", userId)
        .maybeSingle();
    }

    if (profileRes.error)
      return NextResponse.json(
        { error: profileRes.error.message },
        { status: 500 },
      );
    const profile = profileRes.data ?? null;
    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    if (profile.owner_id !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // create or reuse Stripe customer
    let customerId: string | undefined =
      profile.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { userId, username: username ?? undefined },
      });
      customerId = customer.id;
      // persist customer id
      if (supabaseAdmin) {
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", profile.id);
      } else {
        try {
          if (hasSetAuth(supabase)) supabase.auth.setAuth(token);
        } catch {}
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", profile.id);
      }
    }

    if (!STRIPE_PRICE_ID)
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID" },
        { status: 500 },
      );

    const origin = req.headers.get("origin") || `${new URL(req.url).origin}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${origin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?checkout=cancel`,
      metadata: { userId, username: username ?? undefined },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
