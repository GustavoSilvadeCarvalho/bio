"use client";

import { useCallback } from "react";
import type { Profile, Link } from "../lib/types";

type Draft = any;

export default function useProfileActions(params: {
  profile: Profile | null;
  draft: Draft;
  setDraftState: (updater: Draft | ((prev: Draft) => Draft)) => void;
  currentUser: { id?: string; token?: string } | null;
  username: string;
  setProfile: (p: Profile | null) => void;
  setError: (err: string | null) => void;
  setClosingPanels: (v: boolean) => void;
  setEditing: (v: boolean) => void;
}) {
  const {
    profile,
    draft,
    setDraftState,
    currentUser,
    username,
    setProfile,
    setError,
    setClosingPanels,
    setEditing,
  } = params;

  const handleSave = useCallback(async () => {
    if (!currentUser?.token) {
      setError("You must be signed in to save");
      return;
    }
    try {
      const res = await fetch(`/api/profiles/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          full_name: draft.name || null,
          description: draft.description || null,
          music_url: draft.music || null,
          avatar_url: draft.avatarUrl || null,
          links: draft.links && draft.links.length ? draft.links : null,
          background_color: draft.cardColor || null,
          settings: {
            ...(profile?.settings || {}),
            page_background_color: draft.pageColor ?? null,
            page_background_image: draft.pageImage ?? null,
            card_opacity: draft.cardOpacity ?? 1,
            card_glass: draft.cardGlass ?? false,
            music_card_color: draft.musicCardColor ?? null,
            music_card_glass: draft.musicCardGlass ?? false,
            music_card_opacity: draft.musicCardOpacity ?? 1,
            mouse_particles: draft.particlesEnabled ?? true,
            mouse_particles_color: draft.particlesColor ?? "#58a6ff",
            mouse_particles_count: draft.particlesCount ?? 3,
            mouse_particles_size: draft.particlesSize ?? 4,
            mouse_particles_life: draft.particlesLife ?? 60,
            music_enabled: draft.musicEnabled,
            show_music_card: draft.showMusicCard,
            tilt_strength: draft.tiltStrength,
            card_links: draft.cardItems,
            title_color: draft.titleColor || null,
            description_color: draft.descriptionColor || null,
            music_text_color: draft.musicTextColor || null,
            cards_text_color: draft.cardsTextColor || null,
            icon_color: draft.iconColor || null,
            glow_enabled: draft.glowEnabled ?? false,
            glow_color: draft.glowColor || null,
            glow_size: draft.glowSize ?? 8,
            glow_title: draft.glowTitle ?? false,
            glow_description: draft.glowDescription ?? false,
            glow_music: draft.glowMusic ?? false,
            glow_cards: draft.glowCards ?? false,
            glow_icons: draft.glowIcons ?? false,
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || `Save failed: ${res.status}`);
        return;
      }
      const updated = await res.json();
      const newProfile = (updated &&
        (updated.data ?? updated)) as unknown as Profile;
      try {
        const fresh = await fetch(`/api/profiles/${username}`);
        if (fresh.ok) {
          const freshJson = await fresh.json();
          setProfile(freshJson as Profile);
        } else {
          setProfile(newProfile);
        }
      } catch {
        setProfile(newProfile);
      }
      setClosingPanels(true);
      setTimeout(() => {
        setClosingPanels(false);
        setEditing(false);
      }, 320);
      setError(null);
    } catch (err: unknown) {
      setError(String(err));
    }
  }, [
    currentUser,
    draft,
    username,
    profile,
    setProfile,
    setError,
    setClosingPanels,
    setEditing,
  ]);

  const handleCancelEdit = useCallback(() => {
    const newDraft = {
      name: profile?.full_name ?? profile?.username ?? username ?? "",
      description: profile?.description ?? "",
      music: profile?.music_url ?? profile?.settings?.music_url ?? "",
      links: profile?.links ?? [],
      cardColor: profile?.background_color ?? "",
      titleColor:
        typeof profile?.settings?.title_color === "string"
          ? profile!.settings!.title_color!
          : "",
      descriptionColor:
        typeof profile?.settings?.description_color === "string"
          ? profile!.settings!.description_color!
          : "",
      musicTextColor:
        typeof profile?.settings?.music_text_color === "string"
          ? profile!.settings!.music_text_color!
          : "",
      cardsTextColor:
        typeof profile?.settings?.cards_text_color === "string"
          ? profile!.settings!.cards_text_color!
          : "",
      iconColor:
        typeof profile?.settings?.icon_color === "string"
          ? profile!.settings!.icon_color!
          : "",
      pageColor: profile?.settings?.page_background_color ?? "",
      pageImage: profile?.settings?.page_background_image ?? null,
      cardOpacity:
        typeof profile?.settings?.card_opacity === "number"
          ? profile!.settings!.card_opacity!
          : 1,
      musicCardColor: profile?.settings?.music_card_color ?? "",
      musicCardGlass:
        typeof profile?.settings?.music_card_glass === "boolean"
          ? !!profile!.settings!.music_card_glass
          : false,
      musicCardOpacity:
        typeof profile?.settings?.music_card_opacity === "number"
          ? profile!.settings!.music_card_opacity!
          : 1,
      particlesEnabled:
        typeof profile?.settings?.mouse_particles === "boolean"
          ? !!profile!.settings!.mouse_particles
          : true,
      particlesColor: profile?.settings?.mouse_particles_color ?? "#58a6ff",
      particlesCount:
        typeof profile?.settings?.mouse_particles_count === "number"
          ? profile!.settings!.mouse_particles_count!
          : 3,
      particlesSize:
        typeof profile?.settings?.mouse_particles_size === "number"
          ? profile!.settings!.mouse_particles_size!
          : 4,
      particlesLife:
        typeof profile?.settings?.mouse_particles_life === "number"
          ? profile!.settings!.mouse_particles_life!
          : 60,
      cardGlass:
        typeof profile?.settings?.card_glass === "boolean"
          ? !!profile!.settings!.card_glass
          : false,
      cardItems: profile?.settings?.card_links ?? [],
      musicEnabled:
        typeof profile?.settings?.music_enabled === "boolean"
          ? !!profile!.settings!.music_enabled
          : true,
      showMusicCard:
        typeof profile?.settings?.show_music_card === "boolean"
          ? !!profile!.settings!.show_music_card
          : true,
      glowEnabled:
        typeof profile?.settings?.glow_enabled === "boolean"
          ? !!profile!.settings!.glow_enabled
          : false,
      glowColor:
        typeof profile?.settings?.glow_color === "string"
          ? profile!.settings!.glow_color!
          : "#00ffff",
      glowSize:
        typeof profile?.settings?.glow_size === "number"
          ? profile!.settings!.glow_size!
          : 8,
      glowTitle:
        typeof profile?.settings?.glow_title === "boolean"
          ? !!profile!.settings!.glow_title
          : false,
      glowDescription:
        typeof profile?.settings?.glow_description === "boolean"
          ? !!profile!.settings!.glow_description
          : false,
      glowMusic:
        typeof profile?.settings?.glow_music === "boolean"
          ? !!profile!.settings!.glow_music
          : false,
      glowCards:
        typeof profile?.settings?.glow_cards === "boolean"
          ? !!profile!.settings!.glow_cards
          : false,
      glowIcons:
        typeof profile?.settings?.glow_icons === "boolean"
          ? !!profile!.settings!.glow_icons
          : false,
      tiltStrength: profile?.settings?.tilt_strength ?? 50,
      avatarUrl: profile?.avatar_url ?? null,
    } as Draft;

    setDraftState(newDraft);

    setClosingPanels(true);
    setTimeout(() => {
      setClosingPanels(false);
      setEditing(false);
    }, 320);
  }, [profile, username, setDraftState, setClosingPanels, setEditing]);

  const addLink = useCallback(() => {
    setDraftState((d: Draft) => ({
      ...d,
      links: [...(d.links ?? []), { platform: "", url: "" }],
    }));
  }, [setDraftState]);

  const updateLink = useCallback(
    (index: number, field: "platform" | "url", value: string) => {
      setDraftState((d: Draft) => ({
        ...d,
        links: (d.links ?? []).map((l: Link, i: number) =>
          i === index ? { ...l, [field]: value } : l,
        ),
      }));
    },
    [setDraftState],
  );

  const removeLink = useCallback(
    (index: number) => {
      setDraftState((d: Draft) => ({
        ...d,
        links: (d.links ?? []).filter((_: Link, i: number) => i !== index),
      }));
    },
    [setDraftState],
  );

  return {
    handleSave,
    handleCancelEdit,
    addLink,
    updateLink,
    removeLink,
  } as const;
}
