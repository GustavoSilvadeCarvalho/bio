"use client";

import React, { useState } from "react";
import Image from 'next/image';
import type { Profile, CardItem, Link } from '../lib/types';

interface DraftShape {
    name: string;
    description: string;
    music: string;
    links: Link[];
    cardColor: string;
    titleColor?: string;
    descriptionColor?: string;
    musicTextColor?: string;
    cardsTextColor?: string;
    iconColor?: string;
    pageColor?: string;
    pageImage?: string | null;
    cardOpacity?: number;
    musicCardColor?: string;
    musicCardGlass?: boolean;
    musicCardOpacity?: number;
    particlesEnabled?: boolean;
    particlesColor?: string;
    particlesCount?: number;
    particlesSize?: number;
    particlesLife?: number;
    cardGlass?: boolean;
    cardItems?: CardItem[];
    musicEnabled?: boolean;
    showMusicCard?: boolean;
    glowEnabled?: boolean;
    glowColor?: string;
    glowSize?: number;
    glowTitle?: boolean;
    glowDescription?: boolean;
    glowMusic?: boolean;
    glowCards?: boolean;
    glowIcons?: boolean;
    tiltStrength?: number;
    avatarUrl?: string | null;
}

interface HandlersShape {
    setEditing?: (v: boolean) => void;
    setClosingPanels?: (v: boolean) => void;
    setMusicSectionOpen?: (v: boolean | ((prev: boolean) => boolean)) => void;
    setParticlesSectionOpen?: (v: boolean | ((prev: boolean) => boolean)) => void;
    setDraftName?: (v: string) => void;
    setDraftDescription?: (v: string) => void;
    setDraftMusic?: (v: string) => void;
    setDraftLinks?: (v: Link[] | ((prev: Link[]) => Link[])) => void;
    setDraftCardColor?: (v: string) => void;
    setDraftTitleColor?: (v: string) => void;
    setDraftDescriptionColor?: (v: string) => void;
    setDraftMusicTextColor?: (v: string) => void;
    setDraftCardsTextColor?: (v: string) => void;
    setDraftIconColor?: (v: string) => void;
    setDraftPageColor?: (v: string) => void;
    setDraftPageImage?: (v: string | null) => void;
    setDraftCardOpacity?: (v: number) => void;
    setDraftMusicCardColor?: (v: string) => void;
    setDraftMusicCardGlass?: (v: boolean) => void;
    setDraftMusicCardOpacity?: (v: number) => void;
    setDraftParticlesEnabled?: (v: boolean) => void;
    setDraftParticlesColor?: (v: string) => void;
    setDraftParticlesCount?: (v: number) => void;
    setDraftParticlesSize?: (v: number) => void;
    setDraftParticlesLife?: (v: number) => void;
    setDraftCardGlass?: (v: boolean) => void;
    setDraftCardItems?: (v: CardItem[] | ((prev: CardItem[]) => CardItem[])) => void;
    setDraftMusicEnabled?: (v: boolean | ((prev: boolean) => boolean)) => void;
    setDraftShowMusicCard?: (v: boolean | ((prev: boolean) => boolean)) => void;
    setDraftGlowEnabled?: (v: boolean) => void;
    setDraftGlowColor?: (v: string) => void;
    setDraftGlowSize?: (v: number) => void;
    setDraftGlowTitle?: (v: boolean) => void;
    setDraftGlowDescription?: (v: boolean) => void;
    setDraftGlowMusic?: (v: boolean) => void;
    setDraftGlowCards?: (v: boolean) => void;
    setDraftGlowIcons?: (v: boolean) => void;
    setTiltStrength?: (v: number) => void;
    setDraftAvatarUrl?: (v: string | null) => void;
    handleAvatarFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleBgFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleSave?: () => Promise<void>;
    handleCancelEdit?: () => void;
    addLink?: () => void;
    updateLink?: (index: number, field: 'platform' | 'url', value: string) => void;
    removeLink?: (index: number) => void;
    [key: string]: unknown;
}

interface Props {
    username: string;
    profile: Profile | null;
    draft: DraftShape;
    handlers: HandlersShape;
    avatarUploading?: boolean;
    musicSectionOpen?: boolean;
    particlesSectionOpen?: boolean;
}

export default function ProfilePanel(props: Props) {
    const p = props.profile;
    const [profileOpen, setProfileOpen] = useState(false);
    const [appearanceOpen, setAppearanceOpen] = useState(false);

    return (
        <aside className={`fixed left-0 top-0 bottom-0 z-50 w-md p-8 bg-[#0b0b0c] shadow-lg overflow-auto`}>
            <h3 className="text-lg font-semibold text-white mb-3">Profile</h3>

            <div className="mt-2">
                <button type="button" onClick={() => setProfileOpen(v => !v)} className="flex w-full items-center justify-between px-2 py-2 bg-white/5 hover:bg-white/10 rounded">
                    <span className="font-medium text-white">Identidade</span>
                    <svg className={`h-4 w-4 text-white transition-transform ${profileOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L14 10L6 16V4Z" fill="currentColor" /></svg>
                </button>

                {profileOpen && (
                    <div className="mt-3 space-y-3">
                        <label className="block text-sm text-gray-300">Avatar</label>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10">
                                <Image src={(props.draft.avatarUrl ?? (p?.avatar_url ?? `https://github.com/${props.username}.png`)) as string} alt="avatar preview" width={64} height={64} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                {(() => {
                                    const isPremium = !!props.profile?.is_premium;
                                    const accept = isPremium ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,.webm" : "image/jpeg,image/png,image/webp";
                                    return (
                                        <>
                                            <input type="file" accept={accept} id="avatar-file" className="hidden" onChange={props.handlers.handleAvatarFileChange} />
                                            <label htmlFor="avatar-file" className="px-3 py-2 bg-white/5 rounded text-sm cursor-pointer">{props.avatarUploading ? 'Enviando...' : 'Selecionar imagem'}</label>
                                            {!isPremium && <p className="mt-2 text-xs text-gray-400">GIFs e vídeos (MP4/WebM) exclusivos para Premium</p>}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <label className="block text-sm text-gray-300">Name</label>
                        <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.name} onChange={(e) => props.handlers.setDraftName?.(e.target.value)} />

                        <label className="block text-sm text-gray-300 mt-3">Descrição</label>
                        <textarea className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.description} onChange={(e) => props.handlers.setDraftDescription?.(e.target.value)} />

                        <label className="block text-sm text-gray-300 mt-4">Cor do título</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.titleColor || '#ffffff'} onChange={(e) => props.handlers.setDraftTitleColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.titleColor ?? ''} onChange={(e) => props.handlers.setDraftTitleColor?.(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-4">Cor da descrição</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.descriptionColor || '#cccccc'} onChange={(e) => props.handlers.setDraftDescriptionColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.descriptionColor ?? ''} onChange={(e) => props.handlers.setDraftDescriptionColor?.(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <button type="button" onClick={() => props.handlers.setMusicSectionOpen?.((v) => !v)} className="flex w-full items-center justify-between px-2 py-2 bg-white/5 hover:bg-white/10 rounded">
                    <span className="font-medium text-white">Música</span>
                    <svg className={`h-4 w-4 text-white transition-transform ${props.musicSectionOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L14 10L6 16V4Z" fill="currentColor" /></svg>
                </button>

                {props.musicSectionOpen && (
                    <div className="mt-3 space-y-3">
                        <label className="block text-sm text-gray-300">Music URL</label>
                        <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.music} onChange={(e) => props.handlers.setDraftMusic?.(e.target.value)} />
                        <div className="flex items-center gap-4 mt-1">
                            <label className="flex items-center gap-3">
                                <span className="text-sm text-gray-300">Música no perfil</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={props.draft.musicEnabled}
                                    onClick={() => props.handlers.setDraftMusicEnabled?.((v) => !v)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${props.draft.musicEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${props.draft.musicEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>

                            <label className="flex items-center gap-3">
                                <span className="text-sm text-gray-300">Mostrar card</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={props.draft.showMusicCard}
                                    onClick={() => props.handlers.setDraftShowMusicCard?.((v) => !v)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${props.draft.showMusicCard ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${props.draft.showMusicCard ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>
                        </div>

                        <label className="block text-sm text-gray-300 mt-2">Cor do card de música</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.musicCardColor || '#000000'} onChange={(e) => props.handlers.setDraftMusicCardColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.musicCardColor} onChange={(e) => props.handlers.setDraftMusicCardColor?.(e.target.value)} />
                        </div>
                        {props.profile?.is_premium && (
                            <div className="flex items-center gap-3 mt-3">
                                <label className="flex items-center gap-3">
                                    <span className="text-sm text-gray-300">Efeito vidro no player</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={props.draft.musicCardGlass}
                                        onClick={() => props.handlers.setDraftMusicCardGlass?.(!(props.draft.musicCardGlass ?? false))}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.musicCardGlass ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.musicCardGlass ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </label>
                            </div>
                        )}
                        <label className="block text-sm text-gray-300 mt-3">Cor do texto do player</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.musicTextColor || '#ffffff'} onChange={(e) => props.handlers.setDraftMusicTextColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.musicTextColor ?? ''} onChange={(e) => props.handlers.setDraftMusicTextColor?.(e.target.value)} />
                        </div>
                        <label className="block text-sm text-gray-300 mt-3">Opacidade do player</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={100} value={Math.round((props.draft.musicCardOpacity ?? 1) * 100)} onChange={(e) => props.handlers.setDraftMusicCardOpacity?.(Number(e.target.value) / 100)} />
                            <span className="text-sm text-gray-300">{Math.round((props.draft.musicCardOpacity ?? 1) * 100)}%</span>
                        </div>
                    </div>
                )}
            </div>

            {props.profile?.is_premium && (
                <div className="mt-4">
                    <button type="button" onClick={() => props.handlers.setParticlesSectionOpen?.((v) => !v)} className="flex w-full items-center justify-between px-2 py-2 bg-white/5 hover:bg-white/10 rounded">
                        <span className="font-medium text-white">Partículas</span>
                        <svg className={`h-4 w-4 text-white transition-transform ${props.particlesSectionOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L14 10L6 16V4Z" fill="currentColor" /></svg>
                    </button>

                    {props.particlesSectionOpen && (
                        <div className="mt-3 space-y-3">
                            <label className="flex items-center gap-3">
                                <span className="text-sm text-gray-300">Rastro de partículas</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={props.draft.particlesEnabled}
                                    onClick={() => props.handlers.setDraftParticlesEnabled?.(!(props.draft.particlesEnabled ?? false))}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.particlesEnabled ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.particlesEnabled ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>

                            {props.draft.particlesEnabled && (
                                <div className="mt-3 space-y-3">
                                    <label className="block text-sm text-gray-300">Cor das partículas</label>
                                    <div className="flex gap-2 items-center">
                                        <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.particlesColor || '#58a6ff'} onChange={(e) => props.handlers.setDraftParticlesColor?.(e.target.value)} />
                                        <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.particlesColor} onChange={(e) => props.handlers.setDraftParticlesColor?.(e.target.value)} />
                                    </div>

                                    <label className="block text-sm text-gray-300">Intensidade</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min={1} max={12} value={props.draft.particlesCount ?? 3} onChange={(e) => props.handlers.setDraftParticlesCount?.(Number(e.target.value))} />
                                        <span className="text-sm text-gray-300">{props.draft.particlesCount ?? 3}</span>
                                    </div>

                                    <label className="block text-sm text-gray-300">Tamanho médio</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min={1} max={12} value={props.draft.particlesSize ?? 4} onChange={(e) => props.handlers.setDraftParticlesSize?.(Number(e.target.value))} />
                                        <span className="text-sm text-gray-300">{props.draft.particlesSize ?? 4}px</span>
                                    </div>

                                    <label className="block text-sm text-gray-300">Vida (frames)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min={10} max={200} value={props.draft.particlesLife ?? 60} onChange={(e) => props.handlers.setDraftParticlesLife?.(Number(e.target.value))} />
                                        <span className="text-sm text-gray-300">{props.draft.particlesLife ?? 60}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4">
                <button type="button" onClick={() => setAppearanceOpen(v => !v)} className="flex w-full items-center justify-between px-2 py-2 bg-white/5 hover:bg-white/10 rounded">
                    <span className="font-medium text-white">Aparência</span>
                    <svg className={`h-4 w-4 text-white transition-transform ${appearanceOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L14 10L6 16V4Z" fill="currentColor" /></svg>
                </button>

                {appearanceOpen && (
                    <div className="mt-3 space-y-3">
                        <label className="block text-sm text-gray-300 mt-1">Cor do card</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.cardColor || '#000000'} onChange={(e) => props.handlers.setDraftCardColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.cardColor} onChange={(e) => props.handlers.setDraftCardColor?.(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Cor da página</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.pageColor || '#000000'} onChange={(e) => props.handlers.setDraftPageColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.pageColor} onChange={(e) => props.handlers.setDraftPageColor?.(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Imagem/GIF de fundo</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input placeholder="https://..." className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.pageImage ?? ''} onChange={(e) => props.handlers.setDraftPageImage?.(e.target.value || null)} />
                            {(() => {
                                const isPremium = !!props.profile?.is_premium;
                                const accept = isPremium ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,.webm" : "image/jpeg,image/png,image/webp";
                                return (
                                    <>
                                        <input type="file" accept={accept} id="bg-file" className="hidden" onChange={props.handlers.handleBgFileChange} />
                                        <label htmlFor="bg-file" className="px-3 py-2 bg-white/5 rounded text-sm cursor-pointer">{props.avatarUploading ? 'Enviando...' : 'Upload'}</label>
                                        {!isPremium && <p className="mt-2 text-xs text-gray-400">GIFs e vídeos (MP4/WebM) exclusivos para Premium</p>}
                                    </>
                                );
                            })()}
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Opacidade do card</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={100} value={Math.round((props.draft.cardOpacity ?? 1) * 100)} onChange={(e) => props.handlers.setDraftCardOpacity?.(Number(e.target.value) / 100)} />
                            <span className="text-sm text-gray-300">{Math.round((props.draft.cardOpacity ?? 1) * 100)}%</span>
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Cor do texto dos cards</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.cardsTextColor || '#e5e7eb'} onChange={(e) => props.handlers.setDraftCardsTextColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.cardsTextColor ?? ''} onChange={(e) => props.handlers.setDraftCardsTextColor?.(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Cor dos ícones</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.iconColor || '#9ca3af'} onChange={(e) => props.handlers.setDraftIconColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.iconColor ?? ''} onChange={(e) => props.handlers.setDraftIconColor?.(e.target.value)} />
                        </div>

                        {props.profile?.is_premium && (
                            <>
                                <label className="block text-sm text-gray-300 mt-3">Estilo do card</label>
                                <div className="flex items-center gap-3 mt-2">
                                    <label className="flex items-center gap-3">
                                        <span className="text-sm text-gray-300">Efeito vidro</span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={props.draft.cardGlass}
                                            onClick={() => props.handlers.setDraftCardGlass?.(!(props.draft.cardGlass ?? false))}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.cardGlass ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.cardGlass ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </label>
                                </div>
                            </>
                        )}
                        <label className="block text-sm text-gray-300 mt-3">Intensidade do efeito 3D</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={90} value={props.draft.tiltStrength ?? 50} onChange={(e) => props.handlers.setTiltStrength?.(Number(e.target.value))} />
                            <span className="text-sm text-gray-300">{props.draft.tiltStrength ?? 50}°</span>
                        </div>
                        {props.profile?.is_premium && (
                            <>
                                <label className="block text-sm text-gray-300 mt-3">Glow nas fontes</label>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-3">
                                        <span className="text-sm text-gray-300">Habilitar glow</span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={props.draft.glowEnabled}
                                            onClick={() => props.handlers.setDraftGlowEnabled?.(!(props.draft.glowEnabled ?? false))}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.glowEnabled ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.glowEnabled ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </label>
                                </div>

                                {props.draft.glowEnabled && (
                                    <>
                                        <label className="block text-sm text-gray-300 mt-2">Cor do glow</label>
                                        <div className="flex gap-2 mt-2 items-center">
                                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draft.glowColor || '#00ffff'} onChange={(e) => props.handlers.setDraftGlowColor?.(e.target.value)} />
                                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draft.glowColor ?? ''} onChange={(e) => props.handlers.setDraftGlowColor?.(e.target.value)} />
                                        </div>
                                        <label className="block text-sm text-gray-300 mt-2">Tamanho do glow (px)</label>
                                        <div className="flex items-center gap-3">
                                            <input type="range" min={0} max={40} value={props.draft.glowSize ?? 8} onChange={(e) => props.handlers.setDraftGlowSize?.(Number(e.target.value))} />
                                            <span className="text-sm text-gray-300">{props.draft.glowSize ?? 8}px</span>
                                        </div>
                                        <label className="block text-sm text-gray-300 mt-3">Aplicar glow em</label>
                                        <div className="mt-2 space-y-2">
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Título</span>
                                                <button type="button" role="switch" aria-checked={props.draft.glowTitle} onClick={() => props.handlers.setDraftGlowTitle?.(!(props.draft.glowTitle ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.glowTitle ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.glowTitle ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Descrição</span>
                                                <button type="button" role="switch" aria-checked={props.draft.glowDescription} onClick={() => props.handlers.setDraftGlowDescription?.(!(props.draft.glowDescription ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.glowDescription ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.glowDescription ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Player</span>
                                                <button type="button" role="switch" aria-checked={props.draft.glowMusic} onClick={() => props.handlers.setDraftGlowMusic?.(!(props.draft.glowMusic ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.glowMusic ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.glowMusic ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Cards</span>
                                                <button type="button" role="switch" aria-checked={props.draft.glowCards} onClick={() => props.handlers.setDraftGlowCards?.(!(props.draft.glowCards ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.glowCards ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.glowCards ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Ícones</span>
                                                <button type="button" role="switch" aria-checked={props.draft.glowIcons} onClick={() => props.handlers.setDraftGlowIcons?.(!(props.draft.glowIcons ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draft.glowIcons ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draft.glowIcons ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
