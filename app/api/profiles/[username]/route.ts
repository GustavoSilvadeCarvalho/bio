import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Will throw at runtime when trying to create client if env missing
  console.warn("Supabase URL or Key not provided in environment variables.");
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_KEY || "");

export async function GET(
  req: Request,
  { params }: { params: { username: string } },
) {
  try {
    const username = (await params).username;
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, username, full_name, avatar_url, background_color, theme, links, music_url, views, settings, updated_at, owner_id",
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { username: string } },
) {
  try {
    const username = (await params).username;
    const body = await req.json();

    // Basic validation: ensure body is object
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // Authorization: expect Authorization: Bearer <access_token>
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split("Bearer ")[1]
      : null;

    // If no token provided, deny update
    if (!token) {
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 },
      );
    }

    // Determine caller user id
    const { data: userData, error: userErr } =
      await supabase.auth.getUser(token);
    const callerId = userData?.user?.id ?? null;
    if (userErr) {
      return NextResponse.json({ error: userErr.message }, { status: 401 });
    }

    // Fetch existing profile owner (if any)
    const { data: existing } = await supabase
      .from("profiles")
      .select("owner_id")
      .eq("username", username)
      .maybeSingle();

    const existingOwner = existing?.owner_id ?? null;

    // If profile already owned by someone else, forbid
    if (existingOwner && existingOwner !== callerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Upsert by username and set owner_id when creating
    const payload = {
      username,
      full_name: body.full_name ?? null,
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

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "username" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
