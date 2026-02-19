"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { FaDiscord, FaYoutube, FaTwitch, FaTiktok, FaSteam, FaEye, FaInstagram, FaGithub, FaMusic } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MusicPlayer } from "./MusicPlayer";
import { createClient } from "@supabase/supabase-js";
import TiltWrapper from "./TiltWrapper";
import SocialIcons from "./SocialIcons";
import MouseParticles from './MouseParticles';
import dynamic from 'next/dynamic';
import { normalizeLinks, resolveMusicUrl } from '../lib/profileUtils';
import type { Profile, Link, CardItem } from '../lib/types';

const ProfilePanel = dynamic(() => import('./ProfilePanel'), { ssr: false, loading: () => null });
const LinksPanel = dynamic(() => import('./LinksPanel'), { ssr: false, loading: () => null });

interface ProfileCardProps {
    username: string;
    onBgColorChange?: (color?: string) => void;
}

export default function ProfileCard({ username, onBgColorChange }: ProfileCardProps) {


    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentUser, setCurrentUser] = useState<{ id?: string; token?: string } | null>(null);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!NEXT_URL || !NEXT_KEY) return;
        const sb = createClient(NEXT_URL, NEXT_KEY);
        let mounted = true;
        sb.auth.getSession().then((res) => {
            const session = res?.data?.session;
            if (!mounted) return;
            if (session?.user) setCurrentUser({ id: session.user.id, token: session.access_token });
        }).catch(() => { /* ignore */ });
        return () => { mounted = false; };
    }, []);

    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [draftMusic, setDraftMusic] = useState("");
    const [draftLinks, setDraftLinks] = useState<Link[]>([]);
    const [draftCardColor, setDraftCardColor] = useState<string>("");
    const [draftPageColor, setDraftPageColor] = useState<string>("");
    const [draftPageImage, setDraftPageImage] = useState<string | null>(null);
    const [draftCardOpacity, setDraftCardOpacity] = useState<number>(1);
    const [draftMusicCardColor, setDraftMusicCardColor] = useState<string>("");
    const [draftMusicCardGlass, setDraftMusicCardGlass] = useState<boolean>(false);
    const [draftMusicCardOpacity, setDraftMusicCardOpacity] = useState<number>(1);
    const [draftParticlesEnabled, setDraftParticlesEnabled] = useState<boolean>(true);
    const [draftParticlesColor, setDraftParticlesColor] = useState<string>('#58a6ff');
    const [draftParticlesCount, setDraftParticlesCount] = useState<number>(3);
    const [draftParticlesSize, setDraftParticlesSize] = useState<number>(4);
    const [draftParticlesLife, setDraftParticlesLife] = useState<number>(60);
    const [draftCardGlass, setDraftCardGlass] = useState<boolean>(false);
    const [draftCardItems, setDraftCardItems] = useState<Array<{ icon?: string; title?: string; subtitle?: string; url?: string }>>([]);
    const [draftMusicEnabled, setDraftMusicEnabled] = useState<boolean>(true);
    const [draftShowMusicCard, setDraftShowMusicCard] = useState<boolean>(true);
    const [tiltStrength, setTiltStrength] = useState<number>(50);
    const [musicSectionOpen, setMusicSectionOpen] = useState<boolean>(false);
    const [particlesSectionOpen, setParticlesSectionOpen] = useState<boolean>(false);
    const [closingPanels, setClosingPanels] = useState(false);
    const [draftAvatarUrl, setDraftAvatarUrl] = useState<string | null>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);



    useEffect(() => {
        if (profile) {
            setDraftName(profile.full_name ?? profile.username ?? username ?? "");
            setDraftDescription(profile.description ?? "");
            setDraftMusic(profile.music_url ?? profile.settings?.music_url ?? "");
            setDraftCardColor(profile.background_color ?? "");
            setDraftPageColor(profile.settings?.page_background_color ?? "");
            setDraftMusicCardColor(profile.settings?.music_card_color ?? "");
            setDraftMusicCardGlass(typeof profile.settings?.music_card_glass === 'boolean' ? !!profile.settings!.music_card_glass : false);
            setDraftMusicCardOpacity(typeof profile.settings?.music_card_opacity === 'number' ? profile.settings!.music_card_opacity! : 1);
            setDraftParticlesEnabled(typeof profile.settings?.mouse_particles === 'boolean' ? !!profile.settings!.mouse_particles : true);
            setDraftParticlesColor(profile.settings?.mouse_particles_color ?? '#58a6ff');
            setDraftParticlesCount(typeof profile.settings?.mouse_particles_count === 'number' ? profile.settings!.mouse_particles_count! : 3);
            setDraftParticlesSize(typeof profile.settings?.mouse_particles_size === 'number' ? profile.settings!.mouse_particles_size! : 4);
            setDraftParticlesLife(typeof profile.settings?.mouse_particles_life === 'number' ? profile.settings!.mouse_particles_life! : 60);
            setTiltStrength(profile.settings?.tilt_strength ?? 50);
            setDraftMusicEnabled(typeof profile.settings?.music_enabled === 'boolean' ? !!profile.settings!.music_enabled : true);
            setDraftShowMusicCard(typeof profile.settings?.show_music_card === 'boolean' ? !!profile.settings!.show_music_card : true);
            setDraftAvatarUrl(profile.avatar_url ?? null);
            setDraftPageImage(profile.settings?.page_background_image ?? null);
            setDraftCardOpacity(typeof profile.settings?.card_opacity === 'number' ? profile.settings!.card_opacity! : 1);
            setDraftCardGlass(typeof profile.settings?.card_glass === 'boolean' ? !!profile.settings!.card_glass : false);
            setDraftLinks(normalizeLinks(profile.links));
            setDraftCardItems(profile.settings?.card_links ?? [
                { icon: 'github', title: 'GitHub', subtitle: `github.com/${username}`, url: `https://github.com/${username}` },
                { icon: 'discord', title: 'Discord', subtitle: 'Invite', url: '#' },
            ]);
        }
    }, [profile]);

    const DEFAULT_MUSIC = null;
    const musicUrl = editing ? (draftMusic || null) : (profile?.music_url ?? profile?.settings?.music_url ?? null);
    const [views] = useState<number>(() => 132);

    useEffect(() => {
        let mounted = true;
        async function loadProfile() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/profiles/${username}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setProfile(null);
                        setError("Profile not found");
                    } else {
                        setError(`Failed to load profile: ${res.status}`);
                    }
                    return;
                }
                const data = await res.json() as Profile;
                if (mounted) setProfile(data);
            } catch (err: unknown) {
                if (mounted) setError(String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadProfile();
        return () => { mounted = false; };
    }, [username]);

    const canEdit = Boolean(currentUser && (!profile?.owner_id || currentUser.id === profile?.owner_id));

    async function handleSave() {
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
                    full_name: draftName || null,
                    description: draftDescription || null,
                    music_url: draftMusic || null,
                    avatar_url: draftAvatarUrl || null,
                    links: draftLinks && draftLinks.length ? draftLinks : null,
                    background_color: draftCardColor || null,
                    settings: { ...(profile?.settings || {}), page_background_color: draftPageColor ?? null, page_background_image: draftPageImage ?? null, card_opacity: draftCardOpacity ?? 1, card_glass: draftCardGlass ?? false, music_card_color: draftMusicCardColor ?? null, music_card_glass: draftMusicCardGlass ?? false, music_card_opacity: draftMusicCardOpacity ?? 1, mouse_particles: draftParticlesEnabled ?? true, mouse_particles_color: draftParticlesColor ?? '#58a6ff', mouse_particles_count: draftParticlesCount ?? 3, mouse_particles_size: draftParticlesSize ?? 4, mouse_particles_life: draftParticlesLife ?? 60, music_enabled: draftMusicEnabled, show_music_card: draftShowMusicCard, tilt_strength: tiltStrength, card_links: draftCardItems },
                }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body?.error || `Save failed: ${res.status}`);
                return;
            }
            const updated = await res.json();
            const newProfile = (updated && (updated.data ?? updated)) as unknown as Profile;
            try {
                const fresh = await fetch(`/api/profiles/${username}`);
                if (fresh.ok) {
                    const freshJson = await fresh.json();
                    setProfile(freshJson as Profile);
                } else {
                    setProfile(newProfile);
                }
            } catch (_e) {
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
    }

    function addLink() { setDraftLinks((d) => [...d, { platform: '', url: '' }]); }
    function updateLink(index: number, field: 'platform' | 'url', value: string) { setDraftLinks((d) => d.map((l, i) => (i === index ? { ...l, [field]: value } : l))); }
    function removeLink(index: number) { setDraftLinks((d) => d.filter((_, i) => i !== index)); }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const el = document.body;
            const img = editing ? draftPageImage ?? undefined : profile?.settings?.page_background_image ?? undefined;
            const color = editing ? (draftPageColor || undefined) : profile?.settings?.page_background_color ?? undefined;
            if (img) {
                el.style.backgroundImage = `url("${img}")`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.backgroundAttachment = 'fixed';
                el.style.backgroundColor = '';
            } else if (color) {
                el.style.backgroundImage = '';
                el.style.backgroundColor = color as string;
            } else {
                el.style.background = '';
            }
            try {
                if (typeof onBgColorChange === 'function') {
                    const bgValue = img ? `url("${img}") center/cover fixed` : (color ?? undefined);
                    try { onBgColorChange(bgValue); } catch { }
                }
            } catch { }
        } catch { }
    }, [editing, draftPageColor, draftPageImage, profile?.settings, onBgColorChange]);

    async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!NEXT_URL || !NEXT_KEY) {
            setError('Supabase client not configured for uploads');
            return;
        }
        try {
            if (!f.type.startsWith('image/')) {
                setError('Arquivo não é uma imagem');
                return;
            }
            const MAX_MB = 8;
            if (f.size > MAX_MB * 1024 * 1024) {
                setError(`Arquivo muito grande (max ${MAX_MB}MB)`);
                return;
            }

            setAvatarUploading(true);
            const sb = createClient(NEXT_URL, NEXT_KEY);
            const fileName = `${username}-${Date.now()}-${f.name}`;

            const res = await sb.storage.from('avatars').upload(fileName, f, { upsert: true });
            if (res.error) {
                setError(res.error.message || JSON.stringify(res.error));
                setAvatarUploading(false);
                return;
            }

            const publicRes = sb.storage.from('avatars').getPublicUrl(fileName);
            const publicUrl = publicRes?.data?.publicUrl ?? null;
            if (!publicUrl) {
                setError('Não foi possível obter URL pública do avatar');
            }
            setDraftAvatarUrl(publicUrl);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
        } finally {
            setAvatarUploading(false);
        }
    }

    async function handleBgFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!NEXT_URL || !NEXT_KEY) {
            setError('Supabase client not configured for uploads');
            return;
        }
        try {
            if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
                setError('Arquivo não é uma imagem ou vídeo');
                return;
            }
            const MAX_MB = 16;
            if (f.size > MAX_MB * 1024 * 1024) {
                setError(`Arquivo muito grande (max ${MAX_MB}MB)`);
                return;
            }

            setAvatarUploading(true);
            const sb = createClient(NEXT_URL, NEXT_KEY);
            const fileName = `background-${username}-${Date.now()}-${f.name}`;

            const res = await sb.storage.from('backgrounds').upload(fileName, f, { upsert: true });
            if (res.error) {
                setError(res.error.message || JSON.stringify(res.error));
                setAvatarUploading(false);
                return;
            }

            const publicRes = sb.storage.from('backgrounds').getPublicUrl(fileName);
            const publicUrl = publicRes?.data?.publicUrl ?? null;
            if (!publicUrl) {
                setError('Não foi possível obter URL pública do background');
            }
            setDraftPageImage(publicUrl);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
        } finally {
            setAvatarUploading(false);
        }
    }

    function handleCancelEdit() {
        setDraftName(profile?.full_name ?? profile?.username ?? username ?? "");
        setDraftMusic(profile?.music_url ?? profile?.settings?.music_url ?? "");
        setDraftCardColor(profile?.background_color ?? "");
        setDraftPageColor(profile?.settings?.page_background_color ?? "");
        setDraftAvatarUrl(profile?.avatar_url ?? null);
        setDraftMusicEnabled(typeof profile?.settings?.music_enabled === 'boolean' ? !!profile!.settings!.music_enabled : true);
        setDraftShowMusicCard(typeof profile?.settings?.show_music_card === 'boolean' ? !!profile!.settings!.show_music_card : true);
        setTiltStrength(profile?.settings?.tilt_strength ?? 50);
        setDraftDescription(profile?.description ?? "");
        setDraftMusicCardOpacity(typeof profile?.settings?.music_card_opacity === 'number' ? profile!.settings!.music_card_opacity! : 1);
        setDraftParticlesEnabled(typeof profile?.settings?.mouse_particles === 'boolean' ? !!profile!.settings!.mouse_particles : true);
        setDraftParticlesColor(profile?.settings?.mouse_particles_color ?? '#58a6ff');
        setDraftParticlesCount(typeof profile?.settings?.mouse_particles_count === 'number' ? profile!.settings!.mouse_particles_count! : 3);
        setDraftParticlesSize(typeof profile?.settings?.mouse_particles_size === 'number' ? profile!.settings!.mouse_particles_size! : 4);
        setDraftParticlesLife(typeof profile?.settings?.mouse_particles_life === 'number' ? profile!.settings!.mouse_particles_life! : 60);
        if (profile) {
            setDraftLinks(normalizeLinks(profile.links));
        } else {
            setDraftLinks([]);
        }
        setClosingPanels(true);
        setTimeout(() => { setClosingPanels(false); setEditing(false); }, 320);
    }



    const avatarSrc = draftAvatarUrl ?? profile?.avatar_url ?? null;
    const initials = ((profile?.full_name ?? username ?? '').split(' ').map(s => s[0]).slice(0, 2).join('') || (username ? username.slice(0, 2) : '')).toUpperCase();

    function hexToRgba(hex: string, alpha = 1) {
        try {
            const h = hex.replace('#', '').trim();
            const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } catch { return `rgba(255,255,255,${alpha})`; }
    }

    function getIconForPlatform(platformOrUrl: string): React.ComponentType<{ className?: string }> {
        const p = (platformOrUrl || '').toLowerCase();
        if (p.includes('discord')) return FaDiscord;
        if (p.includes('steam')) return FaSteam;
        if (p.includes('youtube') || p.includes('youtu')) return FaYoutube;
        if (p.includes('twitch')) return FaTwitch;
        if (p.includes('tiktok')) return FaTiktok;
        if (p.includes('instagram')) return FaInstagram;
        if (p.includes('github')) return FaGithub;
        if (p === 'x' || p.includes('twitter') || p.includes('x.com')) return FaXTwitter;
        return FaGithub;
    }

    function displayUrl(raw: string) {
        try {
            const u = new URL(raw);
            return u.hostname.replace('www.', '');
        } catch {
            if (!raw) return '';
            return raw.length > 24 ? raw.slice(0, 21) + '...' : raw;
        }
    }

    const cardBaseColor = editing ? draftCardColor : (profile?.background_color ?? undefined);
    const cardGlassActive = editing ? draftCardGlass : !!profile?.settings?.card_glass;
    const cardOpacity = editing ? draftCardOpacity : profile?.settings?.card_opacity ?? 1;
    const particlesActive = editing ? draftParticlesEnabled : !!profile?.settings?.mouse_particles;
    let computedCardBg: string | undefined;
    if (cardGlassActive) {
        const baseAlpha = cardBaseColor ? 0.28 : 0.04;
        const alpha = Math.max(0, Math.min(1, baseAlpha * (cardOpacity ?? 1)));
        computedCardBg = cardBaseColor ? hexToRgba(cardBaseColor, alpha) : `rgba(255,255,255,${alpha})`;
    } else {
        computedCardBg = cardBaseColor ? hexToRgba(cardBaseColor, (cardOpacity ?? 1)) : undefined;
    }
    const computedInnerStyle: React.CSSProperties & Record<string, string | number | undefined> = { backgroundColor: computedCardBg, transformStyle: 'preserve-3d', transition: 'transform 80ms cubic-bezier(.2,.9,.2,1)', cursor: particlesActive ? 'none' : undefined };
    if (cardGlassActive) {
        computedInnerStyle.backdropFilter = 'blur(10px)';
        computedInnerStyle.WebkitBackdropFilter = 'blur(10px)';
        computedInnerStyle.border = '1px solid rgba(255,255,255,0.06)';
    }

    return (
        <>
            <TiltWrapper outerClassName="w-[800px] flex justify-center" perspective={1000} maxRotate={tiltStrength} scale={1.03} innerClassName="relative w-full max-w-3xl bg-transparent border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-8" innerStyle={computedInnerStyle}>
                {(editing ? draftParticlesEnabled : !!profile?.settings?.mouse_particles) && (
                    <MouseParticles
                        color={editing ? draftParticlesColor : profile?.settings?.mouse_particles_color ?? '#58a6ff'}
                        count={editing ? draftParticlesCount : profile?.settings?.mouse_particles_count ?? 3}
                        size={editing ? draftParticlesSize : profile?.settings?.mouse_particles_size ?? 4}
                        life={editing ? draftParticlesLife : profile?.settings?.mouse_particles_life ?? 60}
                    />
                )}
                <div className="absolute left-6 top-6 flex items-center gap-2 bg-black/5 text-white/90 px-3 py-1 rounded-full border border-white/2">
                    <FaEye className="text-sm" />
                    <span className="text-sm font-medium">{views.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-xl transition-all duration-500 border-white/10 bg-gray-800 flex items-center justify-center text-white/90">
                            {avatarSrc ? (
                                (avatarSrc.toLowerCase().endsWith('.gif') || avatarSrc.toLowerCase().includes('.gif')) ? (
                                    <img src={avatarSrc} alt={`${username} avatar`} width={128} height={128} className="w-full h-full object-cover transition-transform duration-[10s]" />
                                ) : (
                                    <Image src={avatarSrc} alt={`${username} avatar`} width={128} height={128} className="w-full h-full object-cover transition-transform duration-[10s]" />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-transparent text-2xl font-bold">{initials}</div>
                            )}
                        </div>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-300">{loading ? 'Loading…' : profile?.full_name ?? username}</h1>
                    {(editing ? draftDescription : profile?.description) ? (
                        <p className="mt-2 text-sm text-gray-400">{editing ? draftDescription : profile?.description}</p>
                    ) : null}
                    {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

                    {canEdit && !editing && (
                        <div className="mt-3">
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm" onClick={() => {
                                setEditing(true);
                                setDraftName(profile?.full_name ?? profile?.username ?? username ?? "");
                                setDraftMusic(profile?.music_url ?? profile?.settings?.music_url ?? "");
                                setDraftCardColor(profile?.background_color ?? "");
                                setDraftPageColor(profile?.settings?.page_background_color ?? "");
                                if (profile) {
                                    setDraftLinks(normalizeLinks(profile.links));
                                } else {
                                    setDraftLinks([]);
                                }
                                setDraftAvatarUrl(profile?.avatar_url ?? null);
                                setDraftMusicCardColor((profile?.settings && profile.settings.music_card_color) ?? "");
                                setDraftMusicEnabled((profile?.settings && typeof profile.settings.music_enabled === 'boolean') ? !!profile.settings.music_enabled : true);
                                setDraftShowMusicCard((profile?.settings && typeof profile.settings.show_music_card === 'boolean') ? !!profile.settings.show_music_card : true);
                                setTiltStrength(profile?.settings?.tilt_strength ?? 50);
                                setDraftDescription(profile?.description ?? "");
                                setDraftCardItems((profile?.settings?.card_links && Array.isArray(profile!.settings!.card_links)) ? profile!.settings!.card_links : []);
                            }}>Edit profile</button>
                        </div>
                    )}
                </div>
                <SocialIcons links={editing ? draftLinks : (profile?.links && Array.isArray(profile.links) ? profile.links : [])} className="flex justify-center gap-6" iconClassName="text-2xl text-white/70" />
                <div className="flex justify-center">
                    {((editing ? draftMusicEnabled : (profile?.settings?.music_enabled ?? true))) && (
                        musicUrl ? (
                            <MusicPlayer
                                url={musicUrl}
                                cardColor={editing ? draftMusicCardColor : (profile?.settings?.music_card_color ?? undefined)}
                                showCard={editing ? draftShowMusicCard : (profile?.settings?.show_music_card ?? true)}
                                glass={editing ? draftMusicCardGlass : !!profile?.settings?.music_card_glass}
                                opacity={editing ? draftMusicCardOpacity : profile?.settings?.music_card_opacity ?? 1}
                            />
                        ) : (
                            <div className="w-full max-w-2xl mx-auto">
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                                    <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-white/80">
                                        <FaMusic />
                                    </div>
                                    <div className="text-sm text-gray-400 font-medium">Sem URL de música</div>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className="w-full">
                    {(() => {
                        const linksForCards = (editing ? draftLinks : normalizeLinks(profile?.links)) || [];
                        const cardItems = editing ? draftCardItems : (profile?.settings?.card_links ?? []);
                        const cardItemsAvailable = Array.isArray(cardItems) && cardItems.length > 0;
                        if (!cardItemsAvailable) return null;
                        const MAX_CARDS = 4;
                        const itemsToRender = cardItems!.slice(0, MAX_CARDS);

                        const colsClass = itemsToRender.length === 1 ? 'grid-cols-1' : 'grid-cols-2';

                        return (
                            <div className={`grid ${colsClass} gap-2 w-full`}>
                                {itemsToRender.map((it: CardItem, i: number) => {
                                    const url = it.url || '#';
                                    const Icon = getIconForPlatform(it.icon || it.url || '');
                                    const title = it.title || (it.icon ? it.icon.charAt(0).toUpperCase() + it.icon.slice(1) : 'Link');
                                    const subtitle = it.subtitle || displayUrl(url);

                                    const spanClass = itemsToRender.length === 3 && i === 2 ? 'col-span-2' : '';

                                    return (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={`${spanClass} flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all`}>
                                            <Icon className="text-4xl text-white/70 shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium text-gray-200 truncate block">{title}</span>
                                                <span className="font-medium text-gray-500 truncate block">{subtitle}</span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </TiltWrapper>

            {editing && (
                <>
                    <div className={`fixed inset-0 z-40 bg-transparent transition-opacity ${closingPanels ? 'opacity-0' : 'opacity-100'}`} onClick={() => {
                        setClosingPanels(true);
                        setDraftAvatarUrl(profile?.avatar_url ?? null);
                        setTimeout(() => { setClosingPanels(false); setEditing(false); }, 320);
                    }} />
                    <ProfilePanel
                        username={username}
                        profile={profile}
                        draftAvatarUrl={draftAvatarUrl}
                        avatarUploading={avatarUploading}
                        onAvatarFileChange={handleAvatarFileChange}
                        draftName={draftName}
                        setDraftName={setDraftName}
                        draftDescription={draftDescription}
                        setDraftDescription={setDraftDescription}
                        draftCardColor={draftCardColor}
                        setDraftCardColor={setDraftCardColor}
                        draftMusic={draftMusic}
                        setDraftMusic={setDraftMusic}
                        musicSectionOpen={musicSectionOpen}
                        setMusicSectionOpen={setMusicSectionOpen}
                        draftMusicEnabled={draftMusicEnabled}
                        setDraftMusicEnabled={setDraftMusicEnabled}
                        draftShowMusicCard={draftShowMusicCard}
                        setDraftShowMusicCard={setDraftShowMusicCard}
                        draftMusicCardColor={draftMusicCardColor}
                        setDraftMusicCardColor={setDraftMusicCardColor}
                        draftPageColor={draftPageColor}
                        setDraftPageColor={setDraftPageColor}
                        draftPageImage={draftPageImage}
                        setDraftPageImage={setDraftPageImage}
                        draftCardOpacity={draftCardOpacity}
                        setDraftCardOpacity={setDraftCardOpacity}
                        draftCardGlass={draftCardGlass}
                        setDraftCardGlass={setDraftCardGlass}
                        draftMusicCardGlass={draftMusicCardGlass}
                        setDraftMusicCardGlass={setDraftMusicCardGlass}
                        draftMusicCardOpacity={draftMusicCardOpacity}
                        setDraftMusicCardOpacity={setDraftMusicCardOpacity}
                        draftParticlesEnabled={draftParticlesEnabled}
                        setDraftParticlesEnabled={setDraftParticlesEnabled}
                        draftParticlesColor={draftParticlesColor}
                        setDraftParticlesColor={setDraftParticlesColor}
                        draftParticlesCount={draftParticlesCount}
                        setDraftParticlesCount={setDraftParticlesCount}
                        draftParticlesSize={draftParticlesSize}
                        setDraftParticlesSize={setDraftParticlesSize}
                        draftParticlesLife={draftParticlesLife}
                        particlesSectionOpen={particlesSectionOpen}
                        setParticlesSectionOpen={setParticlesSectionOpen}
                        setDraftParticlesLife={setDraftParticlesLife}
                        onBgFileChange={handleBgFileChange}
                    />

                    <LinksPanel draftLinks={draftLinks} updateLink={updateLink} addLink={addLink} removeLink={removeLink} onSave={handleSave} onCancel={handleCancelEdit} draftCardItems={draftCardItems} setDraftCardItems={setDraftCardItems} />
                </>
            )}

            <style jsx>{`
                .panel-in-left { animation: slideInLeft 320ms ease-out forwards; }
                .panel-in-right { animation: slideInRight 320ms ease-out forwards; }
                .panel-out-left { animation: slideOutLeft 320ms ease-in forwards; }
                .panel-out-right { animation: slideOutRight 320ms ease-in forwards; }
                @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
                @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1 } to { transform: translateX(-100%); opacity: 0 } }
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
                @keyframes slideOutRight { from { transform: translateX(0); opacity: 1 } to { transform: translateX(100%); opacity: 0 } }
            `}</style>
        </>
    );
}