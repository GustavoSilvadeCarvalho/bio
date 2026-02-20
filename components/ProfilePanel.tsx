"use client";

import React, { useState } from "react";
import Image from 'next/image';
import type { Profile, CardItem } from '../lib/types';

interface Props {
    username: string;
    profile: Profile | null;
    draftAvatarUrl: string | null;
    avatarUploading: boolean;
    onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    draftName: string;
    setDraftName: (v: string) => void;
    draftDescription: string;
    setDraftDescription: (v: string) => void;
    draftCardColor: string;
    setDraftCardColor: (v: string) => void;
    draftTitleColor?: string;
    setDraftTitleColor?: (v: string) => void;
    draftDescriptionColor?: string;
    setDraftDescriptionColor?: (v: string) => void;
    draftMusic: string;
    setDraftMusic: (v: string) => void;
    musicSectionOpen: boolean;
    setMusicSectionOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftMusicEnabled: boolean;
    setDraftMusicEnabled: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftShowMusicCard: boolean;
    setDraftShowMusicCard: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftMusicCardColor: string;
    setDraftMusicCardColor: (v: string) => void;
    draftMusicTextColor?: string;
    setDraftMusicTextColor?: (v: string) => void;
    draftMusicCardGlass?: boolean;
    setDraftMusicCardGlass?: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftMusicCardOpacity?: number;
    setDraftMusicCardOpacity?: (v: number) => void;
    draftCardItems?: CardItem[];
    setDraftCardItems?: (v: CardItem[] | ((prev: CardItem[]) => CardItem[])) => void;
    draftCardsTextColor?: string;
    setDraftCardsTextColor?: (v: string) => void;
    draftIconColor?: string;
    setDraftIconColor?: (v: string) => void;
    draftGlowEnabled?: boolean;
    setDraftGlowEnabled?: (v: boolean) => void;
    draftGlowColor?: string;
    setDraftGlowColor?: (v: string) => void;
    draftGlowSize?: number;
    setDraftGlowSize?: (v: number) => void;
    draftGlowTitle?: boolean;
    setDraftGlowTitle?: (v: boolean) => void;
    draftGlowDescription?: boolean;
    setDraftGlowDescription?: (v: boolean) => void;
    draftGlowMusic?: boolean;
    setDraftGlowMusic?: (v: boolean) => void;
    draftGlowCards?: boolean;
    setDraftGlowCards?: (v: boolean) => void;
    draftGlowIcons?: boolean;
    setDraftGlowIcons?: (v: boolean) => void;
    draftParticlesEnabled?: boolean;
    setDraftParticlesEnabled?: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftParticlesColor?: string;
    setDraftParticlesColor?: (v: string) => void;
    draftParticlesCount?: number;
    setDraftParticlesCount?: (v: number) => void;
    draftParticlesSize?: number;
    setDraftParticlesSize?: (v: number) => void;
    draftParticlesLife?: number;
    setDraftParticlesLife?: (v: number) => void;
    particlesSectionOpen?: boolean;
    setParticlesSectionOpen?: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftPageColor: string;
    setDraftPageColor: (v: string) => void;
    draftPageImage?: string | null;
    setDraftPageImage?: (v: string | null) => void;
    onBgFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    draftCardOpacity?: number;
    setDraftCardOpacity?: (v: number) => void;
    draftCardGlass?: boolean;
    setDraftCardGlass?: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftTiltStrength?: number;
    setDraftTiltStrength?: (v: number) => void;
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
                                <Image src={(props.draftAvatarUrl ?? (p?.avatar_url ?? `https://github.com/${props.username}.png`)) as string} alt="avatar preview" width={64} height={64} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                {(() => {
                                    const isPremium = !!props.profile?.is_premium;
                                    const accept = isPremium ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,.webm" : "image/jpeg,image/png,image/webp";
                                    return (
                                        <>
                                            <input type="file" accept={accept} id="avatar-file" className="hidden" onChange={props.onAvatarFileChange} />
                                            <label htmlFor="avatar-file" className="px-3 py-2 bg-white/5 rounded text-sm cursor-pointer">{props.avatarUploading ? 'Enviando...' : 'Selecionar imagem'}</label>
                                            {!isPremium && <p className="mt-2 text-xs text-gray-400">GIFs e vídeos (MP4/WebM) exclusivos para Premium</p>}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <label className="block text-sm text-gray-300">Name</label>
                        <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftName} onChange={(e) => props.setDraftName(e.target.value)} />

                        <label className="block text-sm text-gray-300 mt-3">Descrição</label>
                        <textarea className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftDescription} onChange={(e) => props.setDraftDescription(e.target.value)} />

                        <label className="block text-sm text-gray-300 mt-4">Cor do título</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftTitleColor || '#ffffff'} onChange={(e) => props.setDraftTitleColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftTitleColor ?? ''} onChange={(e) => props.setDraftTitleColor?.(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-4">Cor da descrição</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftDescriptionColor || '#cccccc'} onChange={(e) => props.setDraftDescriptionColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftDescriptionColor ?? ''} onChange={(e) => props.setDraftDescriptionColor?.(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <button type="button" onClick={() => props.setMusicSectionOpen((v) => !v)} className="flex w-full items-center justify-between px-2 py-2 bg-white/5 hover:bg-white/10 rounded">
                    <span className="font-medium text-white">Música</span>
                    <svg className={`h-4 w-4 text-white transition-transform ${props.musicSectionOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L14 10L6 16V4Z" fill="currentColor" /></svg>
                </button>

                {props.musicSectionOpen && (
                    <div className="mt-3 space-y-3">
                        <label className="block text-sm text-gray-300">Music URL</label>
                        <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftMusic} onChange={(e) => props.setDraftMusic(e.target.value)} />
                        <div className="flex items-center gap-4 mt-1">
                            <label className="flex items-center gap-3">
                                <span className="text-sm text-gray-300">Música no perfil</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={props.draftMusicEnabled}
                                    onClick={() => props.setDraftMusicEnabled((v) => !v)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${props.draftMusicEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${props.draftMusicEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>

                            <label className="flex items-center gap-3">
                                <span className="text-sm text-gray-300">Mostrar card</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={props.draftShowMusicCard}
                                    onClick={() => props.setDraftShowMusicCard((v) => !v)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${props.draftShowMusicCard ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${props.draftShowMusicCard ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>
                        </div>

                        <label className="block text-sm text-gray-300 mt-2">Cor do card de música</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftMusicCardColor || '#000000'} onChange={(e) => props.setDraftMusicCardColor(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftMusicCardColor} onChange={(e) => props.setDraftMusicCardColor(e.target.value)} />
                        </div>
                        {props.profile?.is_premium && (
                            <div className="flex items-center gap-3 mt-3">
                                <label className="flex items-center gap-3">
                                    <span className="text-sm text-gray-300">Efeito vidro no player</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={props.draftMusicCardGlass}
                                        onClick={() => props.setDraftMusicCardGlass?.(!(props.draftMusicCardGlass ?? false))}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftMusicCardGlass ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftMusicCardGlass ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </label>
                            </div>
                        )}
                        <label className="block text-sm text-gray-300 mt-3">Cor do texto do player</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftMusicTextColor || '#ffffff'} onChange={(e) => props.setDraftMusicTextColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftMusicTextColor ?? ''} onChange={(e) => props.setDraftMusicTextColor?.(e.target.value)} />
                        </div>
                        <label className="block text-sm text-gray-300 mt-3">Opacidade do player</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={100} value={Math.round((props.draftMusicCardOpacity ?? 1) * 100)} onChange={(e) => props.setDraftMusicCardOpacity?.(Number(e.target.value) / 100)} />
                            <span className="text-sm text-gray-300">{Math.round((props.draftMusicCardOpacity ?? 1) * 100)}%</span>
                        </div>
                    </div>
                )}
            </div>

            {props.profile?.is_premium && (
                <div className="mt-4">
                    <button type="button" onClick={() => props.setParticlesSectionOpen?.((v) => !v)} className="flex w-full items-center justify-between px-2 py-2 bg-white/5 hover:bg-white/10 rounded">
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
                                    aria-checked={props.draftParticlesEnabled}
                                    onClick={() => props.setDraftParticlesEnabled?.(!(props.draftParticlesEnabled ?? false))}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftParticlesEnabled ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftParticlesEnabled ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>

                            {props.draftParticlesEnabled && (
                                <div className="mt-3 space-y-3">
                                    <label className="block text-sm text-gray-300">Cor das partículas</label>
                                    <div className="flex gap-2 items-center">
                                        <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftParticlesColor || '#58a6ff'} onChange={(e) => props.setDraftParticlesColor?.(e.target.value)} />
                                        <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftParticlesColor} onChange={(e) => props.setDraftParticlesColor?.(e.target.value)} />
                                    </div>

                                    <label className="block text-sm text-gray-300">Intensidade</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min={1} max={12} value={props.draftParticlesCount ?? 3} onChange={(e) => props.setDraftParticlesCount?.(Number(e.target.value))} />
                                        <span className="text-sm text-gray-300">{props.draftParticlesCount ?? 3}</span>
                                    </div>

                                    <label className="block text-sm text-gray-300">Tamanho médio</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min={1} max={12} value={props.draftParticlesSize ?? 4} onChange={(e) => props.setDraftParticlesSize?.(Number(e.target.value))} />
                                        <span className="text-sm text-gray-300">{props.draftParticlesSize ?? 4}px</span>
                                    </div>

                                    <label className="block text-sm text-gray-300">Vida (frames)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="range" min={10} max={200} value={props.draftParticlesLife ?? 60} onChange={(e) => props.setDraftParticlesLife?.(Number(e.target.value))} />
                                        <span className="text-sm text-gray-300">{props.draftParticlesLife ?? 60}</span>
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
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftCardColor || '#000000'} onChange={(e) => props.setDraftCardColor(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftCardColor} onChange={(e) => props.setDraftCardColor(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Cor da página</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftPageColor || '#000000'} onChange={(e) => props.setDraftPageColor(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftPageColor} onChange={(e) => props.setDraftPageColor(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Imagem/GIF de fundo</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input placeholder="https://..." className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftPageImage ?? ''} onChange={(e) => props.setDraftPageImage?.(e.target.value || null)} />
                            {(() => {
                                const isPremium = !!props.profile?.is_premium;
                                const accept = isPremium ? "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,.webm" : "image/jpeg,image/png,image/webp";
                                return (
                                    <>
                                        <input type="file" accept={accept} id="bg-file" className="hidden" onChange={props.onBgFileChange} />
                                        <label htmlFor="bg-file" className="px-3 py-2 bg-white/5 rounded text-sm cursor-pointer">{props.avatarUploading ? 'Enviando...' : 'Upload'}</label>
                                        {!isPremium && <p className="mt-2 text-xs text-gray-400">GIFs e vídeos (MP4/WebM) exclusivos para Premium</p>}
                                    </>
                                );
                            })()}
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Opacidade do card</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={100} value={Math.round((props.draftCardOpacity ?? 1) * 100)} onChange={(e) => props.setDraftCardOpacity?.(Number(e.target.value) / 100)} />
                            <span className="text-sm text-gray-300">{Math.round((props.draftCardOpacity ?? 1) * 100)}%</span>
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Cor do texto dos cards</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftCardsTextColor || '#e5e7eb'} onChange={(e) => props.setDraftCardsTextColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftCardsTextColor ?? ''} onChange={(e) => props.setDraftCardsTextColor?.(e.target.value)} />
                        </div>

                        <label className="block text-sm text-gray-300 mt-1">Cor dos ícones</label>
                        <div className="flex gap-2 mt-2 items-center">
                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftIconColor || '#9ca3af'} onChange={(e) => props.setDraftIconColor?.(e.target.value)} />
                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftIconColor ?? ''} onChange={(e) => props.setDraftIconColor?.(e.target.value)} />
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
                                            aria-checked={props.draftCardGlass}
                                            onClick={() => props.setDraftCardGlass?.(!(props.draftCardGlass ?? false))}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftCardGlass ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftCardGlass ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </label>
                                </div>
                            </>
                        )}
                        <label className="block text-sm text-gray-300 mt-3">Intensidade do efeito 3D</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={90} value={props.draftTiltStrength ?? 50} onChange={(e) => props.setDraftTiltStrength?.(Number(e.target.value))} />
                            <span className="text-sm text-gray-300">{props.draftTiltStrength ?? 50}°</span>
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
                                            aria-checked={props.draftGlowEnabled}
                                            onClick={() => props.setDraftGlowEnabled?.(!(props.draftGlowEnabled ?? false))}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftGlowEnabled ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftGlowEnabled ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </label>
                                </div>

                                {props.draftGlowEnabled && (
                                    <>
                                        <label className="block text-sm text-gray-300 mt-2">Cor do glow</label>
                                        <div className="flex gap-2 mt-2 items-center">
                                            <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftGlowColor || '#00ffff'} onChange={(e) => props.setDraftGlowColor?.(e.target.value)} />
                                            <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftGlowColor ?? ''} onChange={(e) => props.setDraftGlowColor?.(e.target.value)} />
                                        </div>
                                        <label className="block text-sm text-gray-300 mt-2">Tamanho do glow (px)</label>
                                        <div className="flex items-center gap-3">
                                            <input type="range" min={0} max={40} value={props.draftGlowSize ?? 8} onChange={(e) => props.setDraftGlowSize?.(Number(e.target.value))} />
                                            <span className="text-sm text-gray-300">{props.draftGlowSize ?? 8}px</span>
                                        </div>
                                        <label className="block text-sm text-gray-300 mt-3">Aplicar glow em</label>
                                        <div className="mt-2 space-y-2">
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Título</span>
                                                <button type="button" role="switch" aria-checked={props.draftGlowTitle} onClick={() => props.setDraftGlowTitle?.(!(props.draftGlowTitle ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftGlowTitle ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftGlowTitle ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Descrição</span>
                                                <button type="button" role="switch" aria-checked={props.draftGlowDescription} onClick={() => props.setDraftGlowDescription?.(!(props.draftGlowDescription ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftGlowDescription ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftGlowDescription ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Player</span>
                                                <button type="button" role="switch" aria-checked={props.draftGlowMusic} onClick={() => props.setDraftGlowMusic?.(!(props.draftGlowMusic ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftGlowMusic ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftGlowMusic ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Cards</span>
                                                <button type="button" role="switch" aria-checked={props.draftGlowCards} onClick={() => props.setDraftGlowCards?.(!(props.draftGlowCards ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftGlowCards ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftGlowCards ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <span className="text-sm text-gray-300">Ícones</span>
                                                <button type="button" role="switch" aria-checked={props.draftGlowIcons} onClick={() => props.setDraftGlowIcons?.(!(props.draftGlowIcons ?? false))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${(props.draftGlowIcons ?? false) ? 'bg-green-500' : 'bg-gray-600'}`}>
                                                    <span className={`absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${(props.draftGlowIcons ?? false) ? 'translate-x-5' : 'translate-x-0'}`} />
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
