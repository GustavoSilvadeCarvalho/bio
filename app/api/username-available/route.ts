import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username =
      url.searchParams.get("username")?.trim().toLowerCase() ?? "";
    if (!username)
      return NextResponse.json(
        { available: false, error: "missing username" },
        { status: 400 },
      );

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .limit(1);

    if (error)
      return NextResponse.json(
        { available: false, error: error.message },
        { status: 500 },
      );

    return NextResponse.json({ available: (data?.length ?? 0) === 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { available: false, error: message },
      { status: 500 },
    );
  }
}
