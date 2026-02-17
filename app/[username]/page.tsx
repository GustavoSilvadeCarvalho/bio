"use client";

import { use, useState } from "react";
import dynamic from "next/dynamic";

// Importa o ProfileCard. O "ssr: false" aqui é importante!
const ProfileCard = dynamic(() => import("../../components/ProfileCard"), {
    ssr: false,
    loading: () => <div className="text-white text-center p-10">Carregando Bio...</div>
});

export default function UserProfile({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const [pageBg, setPageBg] = useState<string | undefined>(undefined);

    const mainStyle = pageBg ? { background: pageBg } : undefined;

    return (
        <main style={mainStyle} className="min-h-screen flex items-center justify-center text-white p-4">
            <ProfileCard username={username} onBgColorChange={(c) => setPageBg(c)} />
        </main>
    );
}