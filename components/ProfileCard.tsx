"use client";

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { FaDiscord, FaYoutube, FaTwitch, FaTiktok, FaSteam, FaEye, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MusicPlayer } from "./MusicPlayer";
import { createClient } from "@supabase/supabase-js";

interface ProfileCardProps {
    username: string;
    onBgColorChange?: (color?: string) => void;
}

export default function ProfileCard({ username, onBgColorChange }: ProfileCardProps) {
    interface Profile {
        id?: string;
        username?: string;
        full_name?: string | null;
        avatar_url?: string | null;
        background_color?: string | null;
        theme?: string | null;
        links?: any;
        music_url?: string | null;
        views?: number | null;
        settings?: any;
        updated_at?: string | null;
    }

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
        sb.auth.getSession().then((res: any) => {
            const session = res?.data?.session;
            if (!mounted) return;
            if (session?.user) setCurrentUser({ id: session.user.id, token: session.access_token });
        }).catch(() => { });
        return () => { mounted = false; };
    }, []);

    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftMusic, setDraftMusic] = useState("");
    const [draftLinks, setDraftLinks] = useState<Array<{ platform: string; url: string }>>([]);
    const [draftCardColor, setDraftCardColor] = useState<string>("");
    const [draftPageColor, setDraftPageColor] = useState<string>("");

    const [signEmail, setSignEmail] = useState("");
    const [signMessage, setSignMessage] = useState<string | null>(null);
    const [signLoading, setSignLoading] = useState(false);

    async function handleSendMagicLink() {
        const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!NEXT_URL || !NEXT_KEY) {
            setSignMessage("Supabase não está configurado no cliente (NEXT_PUBLIC_SUPABASE_*)");
            return;
        }
        setSignLoading(true);
        setSignMessage(null);
        try {
            const sb = createClient(NEXT_URL, NEXT_KEY);
            const { error } = await sb.auth.signInWithOtp({ email: signEmail });
            if (error) setSignMessage(error.message);
            else setSignMessage("Link enviado — verifique seu e-mail (pode demorar alguns minutos)");
        } catch (err: any) {
            setSignMessage(String(err));
        } finally {
            setSignLoading(false);
        }
    }

    useEffect(() => {
        if (profile) {
            setDraftName(profile.full_name ?? "");
            setDraftMusic(profile.music_url ?? "");
            setDraftCardColor(profile.background_color ?? "");
            setDraftPageColor((profile.settings && profile.settings.page_background_color) ?? "");
            if (profile.links) {
                try {
                    const l = profile.links;
                    if (Array.isArray(l)) setDraftLinks(l as any);
                    else if (typeof l === 'object') setDraftLinks(Object.entries(l).map(([k, v]) => ({ platform: k, url: String(v) })));
                    else setDraftLinks([]);
                } catch (e) {
                    setDraftLinks([]);
                }
            } else {
                setDraftLinks([]);
            }
        }
    }, [profile]);

    const DEFAULT_MUSIC = "https://youtu.be/5RPBpMKQCLA?si=YikhXa74wXfz9yVz";
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
                const data = await res.json();
                if (mounted) setProfile(data);
            } catch (err: any) {
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
                    music_url: draftMusic || null,
                    links: draftLinks && draftLinks.length ? draftLinks : null,
                    background_color: draftCardColor || null,
                    settings: { ...(profile?.settings || {}), page_background_color: draftPageColor || null },
                }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body?.error || `Save failed: ${res.status}`);
                return;
            }
            const updated = await res.json();
            setProfile(updated);
            setEditing(false);
            setError(null);
        } catch (err: any) {
            setError(String(err));
        }
    }

    function addLink() { setDraftLinks((d) => [...d, { platform: '', url: '' }]); }
    function updateLink(index: number, field: 'platform' | 'url', value: string) { setDraftLinks((d) => d.map((l, i) => (i === index ? { ...l, [field]: value } : l))); }
    function removeLink(index: number) { setDraftLinks((d) => d.filter((_, i) => i !== index)); }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (typeof onBgColorChange !== 'function') return;
        const color = editing ? (draftPageColor || undefined) : (profile?.settings?.page_background_color || undefined);
        try { onBgColorChange(color); } catch (e) { }
    }, [editing, draftPageColor, profile?.settings, onBgColorChange]);

    return (
        <div className="relative w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-8" style={{ backgroundColor: (editing ? draftCardColor : profile?.background_color) || undefined }}>
            <div className="absolute left-6 top-6 flex items-center gap-2 bg-black/5 text-white/90 px-3 py-1 rounded-full border border-white/2">
                <FaEye className="text-sm" />
                <span className="text-sm font-medium">{views.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-xl transition-all duration-500 border-white/10">
                        <Image src={profile?.avatar_url ?? `https://github.com/${username}.png`} alt={`${username} avatar`} width={128} height={128} className="w-full h-full object-cover transition-transform duration-[10s]" />
                    </div>
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-300">{loading ? 'Loading…' : profile?.full_name ?? username}</h1>
                {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                {!currentUser && (
                    <div className="mt-3 w-full max-w-md">
                        <p className="text-sm text-gray-400">Faça login para editar sua página.</p>
                        <div className="flex gap-2 mt-2">
                            <input aria-label="email" placeholder="seu@email.com" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={signEmail} onChange={(e) => setSignEmail(e.target.value)} />
                            <button className="px-3 py-2 bg-blue-600 rounded text-sm" onClick={handleSendMagicLink} disabled={!signEmail || signLoading}>{signLoading ? 'Enviando...' : 'Enviar link'}</button>
                        </div>
                        {signMessage && <p className="text-sm mt-2 text-yellow-300">{signMessage}</p>}
                    </div>
                )}
                {canEdit && !editing && (
                    <div className="mt-3">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm" onClick={() => setEditing(true)}>Edit profile</button>
                    </div>
                )}
                {editing && (
                    <div className="mt-3 w-full max-w-lg">
                        <label className="block text-sm text-gray-300">Full name</label>
                        <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
                        <label className="block text-sm text-gray-300 mt-2">Music URL</label>
                        <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={draftMusic} onChange={(e) => setDraftMusic(e.target.value)} />
                        <label className="block text-sm text-gray-300 mt-4">Cor do card</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={draftCardColor || '#000000'} onChange={(e) => setDraftCardColor(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={draftCardColor} onChange={(e) => setDraftCardColor(e.target.value)} />
                        </div>
                        <label className="block text-sm text-gray-300 mt-4">Cor da página</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={draftPageColor || '#000000'} onChange={(e) => setDraftPageColor(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={draftPageColor} onChange={(e) => setDraftPageColor(e.target.value)} />
                        </div>
                        <label className="block text-sm text-gray-300 mt-4">Links</label>
                        <div className="mt-2 space-y-2">
                            {draftLinks.map((l, i) => (
                                <div key={`link-${i}`} className="flex gap-2">
                                    <select className="flex-[0.4] p-2 rounded bg-white/3 border border-white/5 text-white" value={l.platform} onChange={(e) => updateLink(i, 'platform', e.target.value)}>
                                        <option value="">Plataforma...</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="twitch">Twitch</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="discord">Discord</option>
                                        <option value="steam">Steam</option>
                                        <option value="github">GitHub</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="twitter">Twitter</option>
                                    </select>
                                    <input placeholder="https://..." className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={l.url} onChange={(e) => updateLink(i, 'url', e.target.value)} />
                                    <button className="px-3 py-2 bg-red-600 rounded text-sm" onClick={() => removeLink(i)} type="button">Remover</button>
                                </div>
                            ))}
                            <div>
                                <button type="button" onClick={addLink} className="px-3 py-3 bg-white/10 rounded text-sm"><IoMdAdd /></button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button className="px-4 py-2 bg-green-600 rounded text-sm" onClick={handleSave}>Save</button>
                            <button className="px-4 py-2 bg-white/5 rounded text-sm" onClick={() => {
                                setEditing(false);
                                setDraftName(profile?.full_name ?? "");
                                setDraftMusic(profile?.music_url ?? "");
                                setDraftCardColor(profile?.background_color ?? "");
                                setDraftPageColor((profile?.settings && profile.settings.page_background_color) ?? "");
                                if (profile) {
                                    if (profile.links) {
                                        if (Array.isArray(profile.links)) setDraftLinks(profile.links as any);
                                        else if (typeof profile.links === 'object') setDraftLinks(Object.entries(profile.links).map(([k, v]) => ({ platform: k, url: String(v) })));
                                        else setDraftLinks([]);
                                    } else {
                                        setDraftLinks([]);
                                    }
                                } else {
                                    setDraftLinks([]);
                                }
                            }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-center gap-6">
                {(profile?.links && Array.isArray(profile.links) ? profile.links : (editing && draftLinks.length ? draftLinks : [])).map((l: any, i: number) => {
                    const url = l.url || l;
                    const platform = (l.platform || '').toLowerCase();
                    const commonProps = { key: `${platform}-${i}`, href: url, target: '_blank' };
                    if (platform.includes('youtube')) return <a {...commonProps}><FaYoutube className="text-2xl text-white/70" /></a>;
                    if (platform.includes('twitch')) return <a {...commonProps}><FaTwitch className="text-2xl text-white/70" /></a>;
                    if (platform.includes('tiktok')) return <a {...commonProps}><FaTiktok className="text-2xl text-white/70" /></a>;
                    if (platform.includes('discord')) return <a {...commonProps}><FaDiscord className="text-2xl text-white/70" /></a>;
                    if (platform.includes('steam')) return <a {...commonProps}><FaSteam className="text-2xl text-white/70" /></a>;
                    if (platform.includes('github')) return <a {...commonProps}><FaGithub className="text-2xl text-white/70" /></a>;
                    if (platform.includes('instagram')) return <a {...commonProps}><FaInstagram className="text-2xl text-white/70" /></a>;
                    if (platform.includes('twitter')) return <a {...commonProps}><FaXTwitter className="text-2xl text-white/70" /></a>;
                    return <a {...commonProps}><FaSteam className="text-2xl text-white/70" /></a>;
                })}
            </div>
            <div className="flex justify-center">
                <MusicPlayer url={profile?.music_url ?? DEFAULT_MUSIC} />
            </div>
            <div className="flex items-center justify-center gap-2">
                <a href={`https://github.com/${username}`} target="_blank" className="flex w-full items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all">
                    <FaSteam className="text-4xl text-white/70" />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-200">Steam Profile.</span>
                        <span className="font-medium text-gray-500">https://steamcommuni...</span>
                    </div>
                </a>
                <a href="#" className="flex w-full items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all">
                    <FaDiscord className="text-4xl text-white/70" />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-200">Discord.</span>
                        <span className="font-medium text-gray-500">.gg/broken</span>
                    </div>
                </a>
            </div>
        </div>
    );
}