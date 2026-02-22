import type { Profile } from "../lib/types";
import { hexToRgba } from "../lib/profileUtils";

type Draft = any;

export default function useProfileStyles({
  profile,
  draft,
  editing,
}: {
  profile: Profile | null;
  draft: Draft;
  editing: boolean;
}) {
  const cardBaseColor = editing
    ? draft.cardColor
    : (profile?.background_color ?? undefined);
  const cardGlassActive = editing
    ? draft.cardGlass
    : profile?.is_premium
      ? !!profile?.settings?.card_glass
      : false;
  const cardOpacity = editing
    ? draft.cardOpacity
    : (profile?.settings?.card_opacity ?? 1);

  let computedCardBg: string | undefined;
  if (cardGlassActive) {
    const baseAlpha = cardBaseColor ? 0.28 : 0.04;
    const alpha = Math.max(0, Math.min(1, baseAlpha * (cardOpacity ?? 1)));
    computedCardBg = cardBaseColor
      ? hexToRgba(cardBaseColor, alpha)
      : `rgba(255,255,255,${alpha})`;
  } else {
    computedCardBg = cardBaseColor
      ? hexToRgba(cardBaseColor, cardOpacity ?? 1)
      : undefined;
  }

  const particlesActive = editing
    ? draft.particlesEnabled && !!profile?.is_premium
    : !!profile?.settings?.mouse_particles && !!profile?.is_premium;

  const computedInnerStyle: Record<string, string | number | undefined> = {
    backgroundColor: computedCardBg,
    transformStyle: "preserve-3d",
    transition: "transform 80ms cubic-bezier(.2,.9,.2,1)",
    cursor: particlesActive ? "none" : undefined,
  };
  if (cardGlassActive) {
    (computedInnerStyle as any).backdropFilter = "blur(10px)";
    (computedInnerStyle as any).WebkitBackdropFilter = "blur(10px)";
    (computedInnerStyle as any).border = "1px solid rgba(255,255,255,0.06)";
  }

  const savedGlowColor =
    profile?.is_premium && typeof profile?.settings?.glow_color === "string"
      ? profile!.settings!.glow_color!
      : undefined;
  const savedGlowSize =
    profile?.is_premium && typeof profile?.settings?.glow_size === "number"
      ? profile!.settings!.glow_size!
      : 8;
  const savedGlowTitle =
    profile?.is_premium && typeof profile?.settings?.glow_title === "boolean"
      ? !!profile!.settings!.glow_title
      : false;
  const savedGlowDescription =
    profile?.is_premium &&
    typeof profile?.settings?.glow_description === "boolean"
      ? !!profile!.settings!.glow_description
      : false;
  const savedGlowMusic =
    profile?.is_premium && typeof profile?.settings?.glow_music === "boolean"
      ? !!profile!.settings!.glow_music
      : false;
  const savedGlowIcons =
    profile?.is_premium && typeof profile?.settings?.glow_icons === "boolean"
      ? !!profile!.settings!.glow_icons
      : false;

  return {
    cardBaseColor,
    cardGlassActive,
    cardOpacity,
    computedCardBg,
    particlesActive,
    computedInnerStyle,
    savedGlowColor,
    savedGlowSize,
    savedGlowTitle,
    savedGlowDescription,
    savedGlowMusic,
    savedGlowIcons,
  } as const;
}
