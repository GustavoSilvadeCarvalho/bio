"use client";

import React from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
    src: string | null;
    username: string;
}

export default function ProfileAvatar({ src, username }: ProfileAvatarProps) {
    const initials = ((username ?? '').split(' ').map(s => s[0]).slice(0, 2).join('') || (username ? username.slice(0, 2) : '')).toUpperCase();

    if (src) {
        const s = (src || '').toLowerCase();
        const isGifSrc = s.includes('.gif');
        const isVideoSrc = s.includes('.mp4') || s.includes('.webm');

        return (
            <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-xl transition-all duration-500 border-white/10 bg-gray-800 flex items-center justify-center text-white/90">
                    {isGifSrc ? (
                        <img src={src} alt={`${username} avatar`} width={128} height={128} className="w-full h-full object-cover transition-transform duration-[10s]" />
                    ) : isVideoSrc ? (
                        <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                        <Image src={src} alt={`${username} avatar`} width={128} height={128} className="w-full h-full object-cover transition-transform duration-[10s]" />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 overflow-hidden shadow-xl transition-all duration-500 border-white/10 bg-gray-800 flex items-center justify-center text-white/90">
                <div className="w-full h-full flex items-center justify-center bg-transparent text-2xl font-bold">{initials}</div>
            </div>
        </div>
    );
}
