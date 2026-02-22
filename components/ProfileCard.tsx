"use client";

import React from "react";
import { FaEye, FaMusic } from "react-icons/fa";
import { MusicPlayer } from "./MusicPlayer";
import TiltWrapper from "./TiltWrapper";
import SocialIcons from "./SocialIcons";
import MouseParticles from './MouseParticles';
import ProfileAvatar from './ProfileAvatar';
import dynamic from 'next/dynamic';
import useProfileCard from '../hooks/useProfileCard';
import LinksGrid from './LinksGrid';

const ProfilePanel = dynamic(() => import('./ProfilePanel'), { ssr: false, loading: () => null });
const LinksPanel = dynamic(() => import('./LinksPanel'), { ssr: false, loading: () => null });

interface ProfileCardProps {
    username: string;
    onBgColorChange?: (color?: string) => void;
}

export default function ProfileCard({ username, onBgColorChange }: ProfileCardProps) {
    const {
        profile,
        loading,
        error,
        canEdit,
        views,
        editing,
        setEditing,
        startEditing,
        musicSectionOpen,
        particlesSectionOpen,
        closingPanels,
        setClosingPanels,
        draft,
        handlers,
        musicUrl,
        draftLinks,
        draftCardItems,
        setDraftCardItems, 
        draftParticlesColor,
        draftParticlesCount,
        draftParticlesSize,
        draftParticlesLife,
        tiltStrength,
        draftTitleColor,
        draftDescription,
        draftDescriptionColor,
        draftCardsTextColor,
        draftIconColor,
        draftMusicEnabled,
        draftMusicCardColor,
        draftShowMusicCard,
        draftMusicCardGlass,
        draftMusicCardOpacity,
        draftMusicTextColor,
        draftGlowEnabled,
        draftGlowColor,
        draftGlowSize,
        draftGlowTitle,
        draftGlowDescription,
        draftGlowMusic,
        draftGlowCards,
        draftGlowIcons,
        draftAvatarUrl,
        setDraftAvatarUrl,
        avatarUploading,
        handleSave,
        handleCancelEdit,
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
    } = useProfileCard({ username, onBgColorChange });

    const avatarSrc = draftAvatarUrl ?? profile?.avatar_url ?? null;

    return (
        <>
            <TiltWrapper outerClassName="w-[800px] flex justify-center" perspective={1000} maxRotate={tiltStrength} scale={1.03} innerClassName="relative w-full max-w-3xl bg-transparent border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-8" innerStyle={computedInnerStyle}>
                {particlesActive && (
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
                    <ProfileAvatar src={avatarSrc} username={profile?.full_name ?? username} />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight" style={{ color: editing ? (draftTitleColor || undefined) : (typeof profile?.settings?.title_color === 'string' ? profile!.settings!.title_color! : undefined), textShadow: (editing ? (draftGlowEnabled && draftGlowTitle ? `0 0 ${draftGlowSize}px ${draftGlowColor}, 0 0 ${Math.max(1, Math.round(draftGlowSize * 0.6))}px ${draftGlowColor}` : undefined) : (savedGlowTitle && savedGlowColor ? `0 0 ${savedGlowSize}px ${savedGlowColor}, 0 0 ${Math.max(1, Math.round(savedGlowSize * 0.6))}px ${savedGlowColor}` : undefined)) }}>{loading ? 'Loading…' : profile?.full_name ?? username}</h1>
                    {(editing ? draftDescription : profile?.description) ? (
                        <p className="mt-2 text-sm whitespace-pre-wrap" style={{ color: editing ? (draftDescriptionColor || undefined) : (typeof profile?.settings?.description_color === 'string' ? profile!.settings!.description_color! : undefined), textShadow: (editing ? (draftGlowEnabled && draftGlowDescription ? `0 0 ${draftGlowSize}px ${draftGlowColor}, 0 0 ${Math.max(1, Math.round(draftGlowSize * 0.6))}px ${draftGlowColor}` : undefined) : (savedGlowDescription && savedGlowColor ? `0 0 ${savedGlowSize}px ${savedGlowColor}, 0 0 ${Math.max(1, Math.round(savedGlowSize * 0.6))}px ${savedGlowColor}` : undefined)) }}>{editing ? draftDescription : profile?.description}</p>
                    ) : null}
                    {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

                    {canEdit && !editing && (
                        <div className="mt-3">
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm" onClick={() => { startEditing(); }} >Edit profile</button>
                        </div>
                    )}
                </div>
                <SocialIcons links={editing ? draftLinks : (profile?.links && Array.isArray(profile.links) ? profile.links : [])} className="flex justify-center gap-6" iconClassName="text-2xl text-white/70" iconColor={editing ? (draftIconColor || undefined) : (typeof profile?.settings?.icon_color === 'string' ? profile!.settings!.icon_color! : undefined)} glowEnabled={editing ? (draftGlowEnabled && draftGlowIcons) : savedGlowIcons} glowColor={editing ? draftGlowColor : savedGlowColor} glowSize={editing ? draftGlowSize : savedGlowSize} />
                <div className="flex justify-center">
                    {((editing ? draftMusicEnabled : (profile?.settings?.music_enabled ?? true))) && (
                        musicUrl ? (
                            <MusicPlayer
                                url={musicUrl}
                                cardColor={editing ? draftMusicCardColor : (profile?.settings?.music_card_color ?? undefined)}
                                showCard={editing ? draftShowMusicCard : (profile?.settings?.show_music_card ?? true)}
                                glass={editing ? draftMusicCardGlass : (profile?.is_premium ? !!profile?.settings?.music_card_glass : false)}
                                opacity={editing ? draftMusicCardOpacity : profile?.settings?.music_card_opacity ?? 1}
                                textColor={editing ? (draftMusicTextColor || undefined) : (typeof profile?.settings?.music_text_color === 'string' ? profile!.settings!.music_text_color! : undefined)}
                                iconColor={editing ? (draftIconColor || undefined) : (typeof profile?.settings?.icon_color === 'string' ? profile!.settings!.icon_color! : undefined)}
                                glowEnabled={editing ? (draftGlowEnabled && draftGlowMusic) : savedGlowMusic}
                                glowColor={editing ? draftGlowColor : savedGlowColor}
                                glowSize={editing ? draftGlowSize : savedGlowSize}
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
                    {
                        (() => {
                            const cardItems = editing ? draftCardItems : (profile?.settings?.card_links ?? []);
                            const settings = {
                                cards_text_color: editing ? (draftCardsTextColor || null) : (typeof profile?.settings?.cards_text_color === 'string' ? profile!.settings!.cards_text_color! : null),
                                icon_color: editing ? (draftIconColor || null) : (typeof profile?.settings?.icon_color === 'string' ? profile!.settings!.icon_color! : null),
                                glow_enabled: editing ? !!draftGlowEnabled : !!(profile?.settings?.glow_enabled),
                                glow_color: editing ? (draftGlowColor || null) : (typeof profile?.settings?.glow_color === 'string' ? profile!.settings!.glow_color! : null),
                                glow_size: editing ? draftGlowSize : (typeof profile?.settings?.glow_size === 'number' ? profile!.settings!.glow_size! : 8),
                                glow_cards: editing ? !!draftGlowCards : !!profile?.settings?.glow_cards,
                                glow_icons: editing ? !!draftGlowIcons : !!profile?.settings?.glow_icons,
                            };

                            return <LinksGrid items={cardItems} settings={settings} editing={editing} />;
                        })()
                    }
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
                        draft={draft}
                        handlers={handlers}
                        avatarUploading={avatarUploading}
                        musicSectionOpen={musicSectionOpen}
                        particlesSectionOpen={particlesSectionOpen}
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
