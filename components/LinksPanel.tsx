"use client";

import React from "react";
import { IoMdAdd } from "react-icons/io";

type CardItem = { icon?: string; title?: string; subtitle?: string; url?: string };

interface Link { platform: string; url: string }

interface Props {
    draftLinks: Link[];
    updateLink: (index: number, field: 'platform' | 'url', value: string) => void;
    addLink: () => void;
    removeLink: (index: number) => void;
    onSave: () => void;
    onCancel: () => void;
    draftCardItems?: CardItem[];
    setDraftCardItems?: (v: CardItem[] | ((prev: CardItem[]) => CardItem[])) => void;
}

export default function LinksPanel({ draftLinks, updateLink, addLink, removeLink, onSave, onCancel, draftCardItems, setDraftCardItems }: Props) {
    return (
        <aside className={`fixed right-0 top-0 bottom-0 z-50 w-md p-8 bg-[#0b0b0c] shadow-lg overflow-auto`}>
            <h3 className="text-lg font-semibold text-white mb-3">Links & Actions</h3>
            <div className="mb-4">
                <h4 className="text-sm text-gray-300 mb-2">Cards (right)</h4>
                {(draftCardItems ?? []).slice(0, 4).map((c: CardItem, idx: number) => (
                    <div key={`card-item-${idx}`} className="mb-3 p-2 bg-white/3 rounded">
                        <div className="flex justify-between items-center mb-2">
                            <strong className="text-sm text-white">Card {idx + 1}</strong>
                            <div className="flex gap-2">
                                <button type="button" className="px-2 py-1 bg-red-600 rounded text-xs" onClick={() => setDraftCardItems?.((prev: CardItem[] = []) => { const copy = prev.slice(); copy.splice(idx, 1); return copy; })}>Remover</button>
                            </div>
                        </div>
                        <label className="block text-xs text-gray-200">Ícone (palavra)</label>
                        <input placeholder="ex: github, discord, youtube" className="w-full p-1 rounded appearance-none bg-transparent border border-white/5 text-white text-sm" value={c.icon ?? ''} onChange={(e) => setDraftCardItems?.((prev: CardItem[] = []) => { const copy = prev.slice(); copy[idx] = { ...(copy[idx] ?? {}), icon: e.target.value }; return copy; })} />
                        <label className="block text-xs text-gray-200 mt-2">Título</label>
                        <input placeholder="Título" className="w-full p-1 rounded bg-transparent border border-white/5 text-white text-sm" value={c.title ?? ''} onChange={(e) => setDraftCardItems?.((prev: CardItem[] = []) => { const copy = prev.slice(); copy[idx] = { ...(copy[idx] ?? {}), title: e.target.value }; return copy; })} />
                        <label className="block text-xs text-gray-200 mt-2">Subtítulo</label>
                        <input placeholder="Subtítulo" className="w-full p-1 rounded bg-transparent border border-white/5 text-white text-sm" value={c.subtitle ?? ''} onChange={(e) => setDraftCardItems?.((prev: CardItem[] = []) => { const copy = prev.slice(); copy[idx] = { ...(copy[idx] ?? {}), subtitle: e.target.value }; return copy; })} />
                        <label className="block text-xs text-gray-200 mt-2">URL</label>
                        <input placeholder="https://..." className="w-full p-1 rounded bg-transparent border border-white/5 text-white text-sm" value={c.url ?? ''} onChange={(e) => setDraftCardItems?.((prev: CardItem[] = []) => { const copy = prev.slice(); copy[idx] = { ...(copy[idx] ?? {}), url: e.target.value }; return copy; })} />
                    </div>
                ))}
                <div className="flex gap-2">
                    <button type="button" onClick={() => setDraftCardItems?.((prev: CardItem[] = []) => { const copy = prev.slice(); if (copy.length >= 4) return copy; copy.push({ icon: '', title: '', subtitle: '', url: '' }); return copy; })} className="px-3 py-2 bg-white/10 rounded text-sm" disabled={(draftCardItems ?? []).length >= 4}><IoMdAdd /></button>
                    <span className="text-sm text-gray-400 self-center">{(draftCardItems ?? []).length} / 4</span>
                </div>
            </div>
            <div className="space-y-3">
                {draftLinks.map((l, i) => (
                    <div key={`panel-link-${i}`} className="flex gap-2">
                        <select className="flex-[0.4] p-2 rounded appearance-none bg-[#0b0b0c] border border-white/5 text-white" value={l.platform} onChange={(e) => updateLink(i, 'platform', e.target.value)}>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="">Plataforma...</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="youtube">YouTube</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="twitch">Twitch</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="tiktok">TikTok</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="discord">Discord</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="steam">Steam</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="github">GitHub</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="instagram">Instagram</option>
                            <option style={{ backgroundColor: '#0b0b0c', color: '#fff' }} value="twitter">Twitter</option>
                        </select>
                        <input placeholder="https://..." className="flex-1 p-2 rounded bg-white/3 border border-white/5 text-white" value={l.url} onChange={(e) => updateLink(i, 'url', e.target.value)} />
                        <button className="px-3 py-2 bg-red-600 rounded text-sm" onClick={() => removeLink(i)} type="button">Remover</button>
                    </div>
                ))}
                <div>
                    <button type="button" onClick={addLink} className="px-3 py-3 bg-white/10 rounded text-sm"><IoMdAdd /></button>
                </div>
            </div>

            <div className="flex gap-2 mt-6">
                <button className="px-4 py-2 bg-green-600 rounded text-sm" onClick={onSave}>Save</button>
                <button className="px-4 py-2 bg-white/5 rounded text-sm" onClick={onCancel}>Cancel</button>
            </div>
        </aside>
    );
}
