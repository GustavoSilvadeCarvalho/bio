"use client";

import React from 'react';
import { FaDiscord, FaYoutube, FaTwitch, FaTiktok, FaSteam, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { getIconForPlatform, displayUrl } from '../lib/profileUtils';
import type { CardItem } from '../lib/types';

interface LinksGridSettings {
    cards_text_color?: string | null;
    icon_color?: string | null;
    glow_enabled?: boolean;
    glow_color?: string | null;
    glow_size?: number | null;
    glow_cards?: boolean;
    glow_icons?: boolean;
}

interface LinksGridProps {
    items: CardItem[];
    settings: LinksGridSettings;
    editing: boolean;
}

export default function LinksGrid({ items, settings, editing }: LinksGridProps) {
    const cardItems = items || [];
    if (!Array.isArray(cardItems) || cardItems.length === 0) return null;

    const MAX_CARDS = 4;
    const itemsToRender = cardItems.slice(0, MAX_CARDS);
    const colsClass = itemsToRender.length === 1 ? 'grid-cols-1' : 'grid-cols-2';

    const cardsTextColor = settings.cards_text_color ?? undefined;
    const iconColor = settings.icon_color ?? undefined;
    const glowEnabled = !!settings.glow_enabled;
    const glowColor = settings.glow_color ?? undefined;
    const glowSize = settings.glow_size ?? 8;
    const glowCards = !!settings.glow_cards;
    const glowIcons = !!settings.glow_icons;

    return (
        <div className={`grid ${colsClass} gap-2 w-full`}>
            {itemsToRender.map((it: CardItem, i: number) => {
                const url = it.url || '#';
                const iconKey = getIconForPlatform(it.icon || it.url || '');
                let Icon: React.ComponentType<{ className?: string }> = FaGithub;
                switch (iconKey) {
                    case 'discord': Icon = FaDiscord; break;
                    case 'steam': Icon = FaSteam; break;
                    case 'youtube': Icon = FaYoutube; break;
                    case 'twitch': Icon = FaTwitch; break;
                    case 'tiktok': Icon = FaTiktok; break;
                    case 'instagram': Icon = FaInstagram; break;
                    case 'x': Icon = FaXTwitter; break;
                    default: Icon = FaGithub; break;
                }
                const title = it.title || (it.icon ? it.icon.charAt(0).toUpperCase() + it.icon.slice(1) : 'Link');
                const subtitle = it.subtitle || displayUrl(url);

                const spanClass = itemsToRender.length === 3 && i === 2 ? 'col-span-2' : '';

                const iconStyle: React.CSSProperties = {
                    color: iconColor,
                    filter: glowEnabled && glowIcons ? `drop-shadow(0 0 ${glowSize}px ${glowColor})` : undefined,
                };

                const textStyle: React.CSSProperties = {
                    color: cardsTextColor,
                    textShadow: glowEnabled && glowCards ? `0 0 ${glowSize}px ${glowColor}` : undefined,
                };

                return (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={`${spanClass} flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 transition-all`}>
                        <span className="shrink-0" style={iconStyle}>
                            <Icon className="text-4xl" />
                        </span>
                        <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate block" style={textStyle}>{title}</span>
                            <span className="font-medium truncate block" style={textStyle}>{subtitle}</span>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
