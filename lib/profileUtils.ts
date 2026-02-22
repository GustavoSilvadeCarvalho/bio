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

export function hexToRgba(hex: string, alpha = 1) {
  try {
    const h = hex.replace("#", "").trim();
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16,
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(255,255,255,${alpha})`;
  }
}

export function getIconForPlatform(platformOrUrl: string) {
  const p = (platformOrUrl || "").toLowerCase();
  if (p.includes("discord")) return "discord";
  if (p.includes("steam")) return "steam";
  if (p.includes("youtube") || p.includes("youtu")) return "youtube";
  if (p.includes("twitch")) return "twitch";
  if (p.includes("tiktok")) return "tiktok";
  if (p.includes("instagram")) return "instagram";
  if (p.includes("github")) return "github";
  if (p === "x" || p.includes("twitter") || p.includes("x.com")) return "x";
  return "github";
}

export function displayUrl(raw: string) {
  try {
    const u = new URL(raw);
    return u.hostname.replace("www.", "");
  } catch {
    if (!raw) return "";
    return raw.length > 24 ? raw.slice(0, 21) + "..." : raw;
  }
}
