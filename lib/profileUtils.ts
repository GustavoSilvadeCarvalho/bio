import type { Link, Profile } from "./types";

export function normalizeLinks(raw: unknown): Link[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Link[];
  if (typeof raw === "object")
    return Object.entries(raw as Record<string, unknown>).map(([k, v]) => ({
      platform: k,
      url: String(v),
    }));
  return [];
}

export function resolveMusicUrl(p?: Profile | null): string | null {
  if (!p) return null;
  const s = p.settings;
  // support a few legacy key names that might appear in settings
  const alt = (() => {
    if (!s) return null;
    if (typeof s.music_url === "string") return s.music_url;
    const obj = s as Record<string, unknown>;
    if (obj.music && typeof obj.music === "object" && obj.music !== null) {
      const m = obj.music as Record<string, unknown>;
      if (typeof m.url === "string") return m.url;
    }
    if (typeof obj.musicUrl === "string") return obj.musicUrl;
    if (typeof obj.default_music_url === "string") return obj.default_music_url;
    return null;
  })();
  return p.music_url || alt || null;
}
