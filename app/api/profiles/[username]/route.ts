import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.warn(
    "Supabase URL not provided in environment variables (SUPABASE_URL).",
  );
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL || "", SUPABASE_SERVICE_ROLE_KEY)
  : null;

function hasSetAuth(
  client: unknown,
): client is { auth: { setAuth: (token: string | null) => void } } {
  if (!client || typeof client !== "object" || !("auth" in client))
    return false;
  const auth = (client as { [k: string]: unknown })["auth"] as unknown;
  return typeof (auth as { setAuth?: unknown }).setAuth === "function";
}

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> },
) {
  try {
    const username = (await context.params).username;
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, username, full_name, description, avatar_url, background_color, theme, links, music_url, views, settings, updated_at, owner_id",
      )
      .eq("username", username)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ username: string }> },
) {
  try {
    const username = (await context.params).username;
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1]
      : null;

    if (!token)
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 },
      );

    const authClient: SupabaseClient = supabaseAdmin ?? supabase;
    const { data: userData, error: userErr } =
      await authClient.auth.getUser(token);
    type UserGetData = { user?: { id?: string } } | undefined;
    const userPayload = userData as unknown as UserGetData;
    const callerId = userPayload?.user?.id ?? null;
    if (userErr)
      return NextResponse.json({ error: userErr.message }, { status: 401 });

    const { data: existing } = await (supabaseAdmin ?? supabase)
      .from("profiles")
      .select("owner_id")
      .eq("username", username)
      .maybeSingle();

    const existingOwner =
      (existing as { owner_id?: string } | null)?.owner_id ?? null;

    if (existingOwner && existingOwner !== callerId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
      if (hasSetAuth(supabaseAdmin)) supabaseAdmin.auth.setAuth(token);
    } catch (e: unknown) {}

    const payload = {
      username,
      full_name: body.full_name ?? null,
      description: body.description ?? null,
      avatar_url: body.avatar_url ?? null,
      background_color: body.background_color ?? null,
      theme: body.theme ?? null,
      links: body.links ?? null,
      music_url: body.music_url ?? null,
      settings: body.settings ?? null,
      views: body.views ?? undefined,
      owner_id: existingOwner ?? callerId,
      updated_at: new Date().toISOString(),
    };

    if (supabaseAdmin) {
      const result = await supabaseAdmin
        .from("profiles")
        .upsert(payload, { onConflict: "username" })
        .select()
        .single();

      if (result.error) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 },
        );
      }

      return NextResponse.json(result.data);
    }

    try {
      if (hasSetAuth(supabase)) supabase.auth.setAuth(token);
      const result = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "username" })
        .select()
        .single();

      if (result.error) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 },
        );
      }

      return NextResponse.json(result.data);
    } catch (e: unknown) {
      console.error("profiles.upsert exception:", e);
      const message = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
