"use client";

import React from "react";
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
    draftMusicCardGlass?: boolean;
    setDraftMusicCardGlass?: (v: boolean | ((prev: boolean) => boolean)) => void;
    draftMusicCardOpacity?: number;
    setDraftMusicCardOpacity?: (v: number) => void;
    draftCardItems?: CardItem[];
    setDraftCardItems?: (v: CardItem[] | ((prev: CardItem[]) => CardItem[])) => void;
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
}

export default function ProfilePanel(props: Props) {
    const p = props.profile;
    return (
        <aside className={`fixed left-0 top-0 bottom-0 z-50 w-md p-8 bg-[#0b0b0c] shadow-lg overflow-auto`}>
            <h3 className="text-lg font-semibold text-white mb-3">Profile</h3>

            <label className="block text-sm text-gray-300 mt-3">Avatar</label>
            <div className="flex items-center gap-3 mt-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10">
                    <Image src={(props.draftAvatarUrl ?? (p?.avatar_url ?? `https://github.com/${props.username}.png`)) as string} alt="avatar preview" width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div>
                    <input type="file" accept="image/*" id="avatar-file" className="hidden" onChange={props.onAvatarFileChange} />
                    <label htmlFor="avatar-file" className="px-3 py-2 bg-white/5 rounded text-sm cursor-pointer">{props.avatarUploading ? 'Enviando...' : 'Selecionar imagem'}</label>
                </div>
            </div>


            <label className="block text-sm text-gray-300">Name</label>
            <input className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftName} onChange={(e) => props.setDraftName(e.target.value)} />
            <label className="block text-sm text-gray-300 mt-3">Descrição</label>
            <textarea className="w-full mt-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftDescription} onChange={(e) => props.setDraftDescription(e.target.value)} />
            <label className="block text-sm text-gray-300 mt-4">Cor do card</label>
            <div className="flex gap-2 mt-2 items-center">
                <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftCardColor || '#000000'} onChange={(e) => props.setDraftCardColor(e.target.value)} />
                <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftCardColor} onChange={(e) => props.setDraftCardColor(e.target.value)} />
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
                        <label className="block text-sm text-gray-300 mt-3">Opacidade do player</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input type="range" min={0} max={100} value={Math.round((props.draftMusicCardOpacity ?? 1) * 100)} onChange={(e) => props.setDraftMusicCardOpacity?.(Number(e.target.value) / 100)} />
                            <span className="text-sm text-gray-300">{Math.round((props.draftMusicCardOpacity ?? 1) * 100)}%</span>
                        </div>
                    </div>
                )}
            </div>

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

            <label className="block text-sm text-gray-300 mt-4">Cor da página</label>
            <div className="flex gap-2 mt-2 items-center">
                <input type="color" className="w-12 h-10 p-1 rounded bg-white/3 border border-white/5" value={props.draftPageColor || '#000000'} onChange={(e) => props.setDraftPageColor(e.target.value)} />
                <input placeholder="#rrggbb" className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftPageColor} onChange={(e) => props.setDraftPageColor(e.target.value)} />
            </div>

            <label className="block text-sm text-gray-300 mt-4">Imagem/GIF de fundo</label>
            <div className="flex gap-2 mt-2 items-center">
                <input placeholder="https://..." className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={props.draftPageImage ?? ''} onChange={(e) => props.setDraftPageImage?.(e.target.value || null)} />
                <input type="file" accept="image/*,video/*" id="bg-file" className="hidden" onChange={props.onBgFileChange} />
                <label htmlFor="bg-file" className="px-3 py-2 bg-white/5 rounded text-sm cursor-pointer">{props.avatarUploading ? 'Enviando...' : 'Upload'}</label>
            </div>

            <label className="block text-sm text-gray-300 mt-4">Opacidade do card</label>
            <div className="flex items-center gap-3 mt-2">
                <input type="range" min={0} max={100} value={Math.round((props.draftCardOpacity ?? 1) * 100)} onChange={(e) => props.setDraftCardOpacity?.(Number(e.target.value) / 100)} />
                <span className="text-sm text-gray-300">{Math.round((props.draftCardOpacity ?? 1) * 100)}%</span>
            </div>

            <label className="block text-sm text-gray-300 mt-4">Estilo do card</label>
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
        </aside>
    );
}
