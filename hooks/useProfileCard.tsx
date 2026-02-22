"use client";

import { useEffect, useState, useCallback } from "react";
import type React from "react";
import getSupabaseClient from "../lib/supabaseClient";
import { normalizeLinks } from "../lib/profileUtils";
import useProfileStyles from "./useProfileStyles";
import useProfileUploads from "./useProfileUploads";
import useProfileData from "./useProfileData";
import useProfileActions from "./useProfileActions";
import useBodyBackground from "./useBodyBackground";
import type { Profile, Link, CardItem } from "../lib/types";

type DraftState = {
    name: string;
    description: string;
    music: string;
    links: Link[];
    cardColor: string;
    titleColor: string;
    descriptionColor: string;
    musicTextColor: string;
    cardsTextColor: string;
    iconColor: string;
    pageColor: string;
    pageImage: string | null;
    cardOpacity: number;
    musicCardColor: string;
    musicCardGlass: boolean;
    musicCardOpacity: number;
    particlesEnabled: boolean;
    particlesColor: string;
    particlesCount: number;
    particlesSize: number;
    particlesLife: number;
    cardGlass: boolean;
    cardItems: CardItem[];
    musicEnabled: boolean;
    showMusicCard: boolean;
    glowEnabled: boolean;
    glowColor: string;
    glowSize: number;
    glowTitle: boolean;
    glowDescription: boolean;
    glowMusic: boolean;
    glowCards: boolean;
    glowIcons: boolean;
    tiltStrength: number;
    avatarUrl: string | null;
};

function createInitialDraft(profile: Profile | null, username: string): DraftState {
    return {
        name: profile?.full_name ?? profile?.username ?? username ?? "",
        description: profile?.description ?? "",
        music: profile?.music_url ?? profile?.settings?.music_url ?? "",
        links: normalizeLinks(profile?.links ?? []),
        cardColor: profile?.background_color ?? "",
        titleColor:
            typeof profile?.settings?.title_color === "string"
                ? (profile!.settings!.title_color as string)
                : "",
        descriptionColor:
            typeof profile?.settings?.description_color === "string"
                ? (profile!.settings!.description_color as string)
                : "",
        musicTextColor:
            typeof profile?.settings?.music_text_color === "string"
                ? (profile!.settings!.music_text_color as string)
                : "",
        cardsTextColor:
            typeof profile?.settings?.cards_text_color === "string"
                ? (profile!.settings!.cards_text_color as string)
                : "",
        iconColor:
            typeof profile?.settings?.icon_color === "string"
                ? (profile!.settings!.icon_color as string)
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
                ? (profile!.settings!.glow_color as string)
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
    };
}

export default function useProfileCard({ username, onBgColorChange }: { username: string; onBgColorChange?: (color?: string) => void }) {
    const { profile, setProfile, loading, error, setError, views } =
        useProfileData(username);

    const [draftState, setDraftState] = useState<DraftState>(() =>
        createInitialDraft(null, username),
    );

    useEffect(() => {
        setDraftState(createInitialDraft(profile, username));
    }, [profile, username]);

    const [editing, setEditing] = useState(false);

    const [uiState, setUiState] = useState({
        musicSectionOpen: false,
        particlesSectionOpen: false,
        closingPanels: false,
    });

    

    const updateDraft = useCallback(<K extends keyof DraftState>(
        key: K,
        value: DraftState[K],
    ) => {
        setDraftState((prev) => ({ ...prev, [key]: value }));
    }, []);

    const uploads = useProfileUploads();

    const [currentUser, setCurrentUser] = useState<
        { id?: string; token?: string } | null
    >(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const client = getSupabaseClient();
                const session = await client.auth.getSession();
                if (!mounted) return;
                setCurrentUser({ id: session?.data?.session?.user?.id, token: session?.data?.session?.access_token });
            } catch {
                if (!mounted) return;
                setCurrentUser(null);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        return uploads.handleAvatarFileChange(e, {
            profile,
            currentUser,
            username,
            setDraftAvatarUrl: (v: string | null) => setDraftState((s) => ({ ...s, avatarUrl: v })),
            setError,
        });
    }

    async function handleBgFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        return uploads.handleBgFileChange(e, {
            profile,
            currentUser,
            username,
            setDraftPageImage: (v: string | null) => setDraftState((s) => ({ ...s, pageImage: v })),
            setError,
        });
    }

    async function startEditing() {
        setEditing(true);
        if (profile) setDraftState(createInitialDraft(profile, username));
    }

    const musicUrl = editing ? (draftState.music || null) : (profile?.music_url ?? profile?.settings?.music_url ?? null);

    const setMusicSectionOpen = (v: React.SetStateAction<boolean>) => {
        if (typeof v === "function") {
            const fn = v as (prev: boolean) => boolean;
            setUiState((s) => ({ ...s, musicSectionOpen: fn(s.musicSectionOpen) }));
        } else {
            setUiState((s) => ({ ...s, musicSectionOpen: v }));
        }
    };

    const setParticlesSectionOpen = (v: React.SetStateAction<boolean>) => {
        if (typeof v === "function") {
            const fn = v as (prev: boolean) => boolean;
            setUiState((s) => ({ ...s, particlesSectionOpen: fn(s.particlesSectionOpen) }));
        } else {
            setUiState((s) => ({ ...s, particlesSectionOpen: v }));
        }
    };

    const setClosingPanels = (v: React.SetStateAction<boolean>) => {
        if (typeof v === "function") {
            const fn = v as (prev: boolean) => boolean;
            setUiState((s) => ({ ...s, closingPanels: fn(s.closingPanels) }));
        } else {
            setUiState((s) => ({ ...s, closingPanels: v }));
        }
    };

    const setDraftCardItems = (v: React.SetStateAction<CardItem[]>) => {
        if (typeof v === "function") {
            const fn = v as (prev: CardItem[]) => CardItem[];
            setDraftState((s) => ({ ...s, cardItems: fn(s.cardItems) }));
        } else {
            setDraftState((s) => ({ ...s, cardItems: v }));
        }
    };

    const setDraftAvatarUrl = (v: React.SetStateAction<string | null>) => {
        if (typeof v === "function") {
            const fn = v as (prev: string | null) => string | null;
            setDraftState((s) => ({ ...s, avatarUrl: fn(s.avatarUrl) }));
        } else {
            setDraftState((s) => ({ ...s, avatarUrl: v }));
        }
    };

    useBodyBackground({ editing, draft: draftState, profile, onBgColorChange });

    const canEdit = Boolean(currentUser && (!profile?.owner_id || currentUser.id === profile?.owner_id));

    const draft = draftState;

    const {
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
    } = useProfileStyles({ profile, draft, editing });

    const styles = {
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

    const { handleSave, handleCancelEdit, addLink, updateLink, removeLink } = useProfileActions({
        profile,
        draft,
        setDraftState,
        currentUser,
        username,
        setProfile,
        setError,
        setClosingPanels,
        setEditing,
    });

    const handlers = {
        setEditing,
        setUiState,
        setMusicSectionOpen,
        setParticlesSectionOpen,
        updateDraft,
        setDraftState,
        handleAvatarFileChange,
        handleBgFileChange,
        handleSave,
        handleCancelEdit,
        addLink,
        updateLink,
        removeLink,
    } as const;

    return {
        profile,
        loading,
        error,
        canEdit,
        views,
        editing,
        setEditing,
        startEditing,
        musicSectionOpen: uiState.musicSectionOpen,
        setMusicSectionOpen,
        particlesSectionOpen: uiState.particlesSectionOpen,
        setParticlesSectionOpen,
        closingPanels: uiState.closingPanels,
        setClosingPanels,
        draft,
        handlers,
        musicUrl,
        draftLinks: draft.links,
        draftCardItems: draft.cardItems,
        setDraftCardItems,
        draftParticlesColor: draft.particlesColor,
        draftParticlesCount: draft.particlesCount,
        draftParticlesSize: draft.particlesSize,
        draftParticlesLife: draft.particlesLife,
        tiltStrength: draft.tiltStrength,
        draftTitleColor: draft.titleColor,
        draftDescription: draft.description,
        draftDescriptionColor: draft.descriptionColor,
        draftCardsTextColor: draft.cardsTextColor,
        draftIconColor: draft.iconColor,
        draftMusicEnabled: draft.musicEnabled,
        draftMusicCardColor: draft.musicCardColor,
        draftShowMusicCard: draft.showMusicCard,
        draftMusicCardGlass: draft.musicCardGlass,
        draftMusicCardOpacity: draft.musicCardOpacity,
        draftMusicTextColor: draft.musicTextColor,
        draftGlowEnabled: draft.glowEnabled,
        draftGlowColor: draft.glowColor,
        draftGlowSize: draft.glowSize,
        draftGlowTitle: draft.glowTitle,
        draftGlowDescription: draft.glowDescription,
        draftGlowMusic: draft.glowMusic,
        draftGlowCards: draft.glowCards,
        draftGlowIcons: draft.glowIcons,
        draftAvatarUrl: draft.avatarUrl,
        setDraftAvatarUrl,
        avatarUploading: uploads.avatarUploading,
        handleSave,
        handleCancelEdit,
        handleAvatarFileChange,
        handleBgFileChange,
        addLink,
        updateLink,
        removeLink,
        particlesActive,
        computedInnerStyle,
        savedGlowColor,
        savedGlowSize,
        savedGlowTitle,
        savedGlowDescription,
        savedGlowMusic,
        savedGlowIcons,
        bgUploading: uploads.bgUploading,
    } as const;
}
