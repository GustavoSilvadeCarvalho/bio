import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, username } = body ?? {};
    if (!userId || !username)
      return NextResponse.json(
        { error: "missing userId or username" },
        { status: 400 },
      );

    const clean = String(username).trim().toLowerCase();
    if (!/^[a-z0-9_.-]{3,30}$/.test(clean)) {
      return NextResponse.json({ error: "invalid username" }, { status: 400 });
    }

    const payload = {
      id: userId,
      username: clean,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, profile: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
