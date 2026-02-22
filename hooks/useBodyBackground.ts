"use client";

import { useEffect } from "react";
import type { Profile } from "../lib/types";

export default function useBodyBackground({
  editing,
  draft,
  profile,
  onBgColorChange,
}: {
  editing: boolean;
  draft: any;
  profile: Profile | null;
  onBgColorChange?: (color?: string) => void;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const el = document.body;
      const img = editing
        ? (draft.pageImage ?? undefined)
        : (profile?.settings?.page_background_image ?? undefined);
      const color = editing
        ? draft.pageColor || undefined
        : (profile?.settings?.page_background_color ?? undefined);
      if (img) {
        el.style.backgroundImage = `url("${img}")`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundAttachment = "fixed";
        el.style.backgroundColor = "";
      } else if (color) {
        el.style.backgroundImage = "";
        el.style.backgroundColor = color as string;
      } else {
        el.style.background = "";
      }
      try {
        if (typeof onBgColorChange === "function") {
          const bgValue = img
            ? `url("${img}") center/cover fixed`
            : (color ?? undefined);
          try {
            onBgColorChange(bgValue);
          } catch {}
        }
      } catch {}
    } catch {}
  }, [
    editing,
    draft.pageColor,
    draft.pageImage,
    profile?.settings,
    onBgColorChange,
  ]);
}
