"use client";

import React from "react";
import { FaDiscord, FaYoutube, FaTwitch, FaTiktok, FaSteam, FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type Link = { platform: string; url: string } | string;

interface Props {
    links?: Link[];
    className?: string;
    iconClassName?: string;
}

export default function SocialIcons({ links = [], className = '', iconClassName = 'text-2xl text-white/70' }: Props) {
    if (!links || !links.length) return null;

    return (
        <div className={className}>
            {links.map((l, i) => {
                const url = typeof l === 'string' ? l : l.url;
                const platform = typeof l === 'string' ? '' : (l.platform || '').toLowerCase();
                const key = `${platform}-${i}`;
                if (platform.includes('youtube')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaYoutube className={iconClassName} /></a>;
                if (platform.includes('twitch')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaTwitch className={iconClassName} /></a>;
                if (platform.includes('tiktok')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaTiktok className={iconClassName} /></a>;
                if (platform.includes('discord')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaDiscord className={iconClassName} /></a>;
                if (platform.includes('steam')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaSteam className={iconClassName} /></a>;
                if (platform.includes('github')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaGithub className={iconClassName} /></a>;
                if (platform.includes('instagram')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaInstagram className={iconClassName} /></a>;
                if (platform.includes('twitter') || platform.includes('x')) return <a key={key} href={url} target="_blank" rel="noreferrer"><FaXTwitter className={iconClassName} /></a>;
                return <a key={key} href={url} target="_blank" rel="noreferrer"><FaSteam className={iconClassName} /></a>;
            })}
        </div>
    );
}
