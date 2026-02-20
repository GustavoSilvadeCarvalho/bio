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
        "id, username, full_name, description, avatar_url, background_color, theme, links, music_url, views, settings, updated_at, owner_id, is_premium",
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
      .select("owner_id, is_premium")
      .eq("username", username)
      .maybeSingle();

    const existingOwner =
      (existing as { owner_id?: string; is_premium?: boolean } | null)
        ?.owner_id ?? null;
    const existingIsPremium = !!(existing as { is_premium?: boolean } | null)
      ?.is_premium;

    if (existingOwner && existingOwner !== callerId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
      if (hasSetAuth(supabaseAdmin)) supabaseAdmin.auth.setAuth(token);
    } catch (e: unknown) {}

    // If the user is not premium, ignore premium-only fields that may be present
    const premiumIgnored: string[] = [];

    let filteredSettings: any = null;
    if (body && typeof body === "object" && body.settings != null) {
      // shallow clone
      filteredSettings = { ...(body.settings as Record<string, unknown>) };

      if (!existingIsPremium) {
        const premiumKeys = [
          "card_glass",
          "music_card_glass",
          "glow_enabled",
          "glow_color",
          "glow_size",
          "glow_title",
          "glow_description",
          "glow_music",
          "glow_cards",
          "glow_icons",
          "mouse_particles",
          "mouse_particles_color",
          "mouse_particles_count",
          "mouse_particles_size",
          "mouse_particles_life",
          "page_background_image",
        ];

        for (const k of premiumKeys) {
          if (k in filteredSettings) {
            delete filteredSettings[k];
            premiumIgnored.push(`settings.${k}`);
          }
        }
      }
    } else if (body && typeof body === "object") {
      filteredSettings = body.settings ?? null;
    }

    // avatar and background animated are premium-only; ignore top-level avatar_url when not premium
    let avatarUrlToSave = body.avatar_url ?? null;
    if (
      !existingIsPremium &&
      body &&
      Object.prototype.hasOwnProperty.call(body, "avatar_url")
    ) {
      avatarUrlToSave = undefined; // ignore change
      premiumIgnored.push("avatar_url");
    }

    const payload = {
      username,
      full_name: body.full_name ?? null,
      description: body.description ?? null,
      avatar_url:
        avatarUrlToSave === undefined ? undefined : (avatarUrlToSave ?? null),
      background_color: body.background_color ?? null,
      theme: body.theme ?? null,
      links: body.links ?? null,
      music_url: body.music_url ?? null,
      settings: filteredSettings ?? null,
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
      try {
        if (hasSetAuth(supabase)) supabase.auth.setAuth(token);
      } catch (_e) {}
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

      const respBody: any = { data: result.data };
      if (premiumIgnored.length) respBody.ignored = premiumIgnored;
      return NextResponse.json(respBody);
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
