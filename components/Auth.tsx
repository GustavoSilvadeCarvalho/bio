"use client";

import React, { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export default function Auth() {
    const [sb, setSb] = useState<SupabaseClient | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!NEXT_URL || !NEXT_KEY) {
            setMessage("Supabase público não configurado (NEXT_PUBLIC_SUPABASE_*)");
            return;
        }

        const client = createClient(NEXT_URL, NEXT_KEY);
        setSb(client);

        // load initial session
        client.auth.getSession().then((res: any) => {
            const session = res?.data?.session;
            if (session?.user) setUser(session.user);
        }).catch(() => { });

        // subscribe to changes
        const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            try { sub?.subscription?.unsubscribe(); } catch (e) { }
        };
    }, []);

    async function signInWithGitHub() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        setLoading(true);
        setMessage(null);
        try {
            await sb.auth.signInWithOAuth({ provider: "github" });
        } catch (err: any) {
            setMessage(String(err?.message ?? err));
        } finally { setLoading(false); }
    }

    async function signInWithDiscord() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        setLoading(true);
        setMessage(null);
        try {
            await sb.auth.signInWithOAuth({ provider: "discord" });
        } catch (err: any) {
            setMessage(String(err?.message ?? err));
        } finally { setLoading(false); }
    }

    async function signUpWithPassword() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        if (!email || !password) return setMessage("Informe email e senha");
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await sb.auth.signUp({ email, password });
            if (error) setMessage(error.message);
            else setMessage("Conta criada. Verifique seu e-mail se for requerido.");
        } catch (err: any) {
            setMessage(String(err?.message ?? err));
        } finally { setLoading(false); }
    }

    async function signInWithPassword() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        if (!email || !password) return setMessage("Informe email e senha");
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await sb.auth.signInWithPassword({ email, password });
            if (error) setMessage(error.message);
            else setMessage("Logado");
        } catch (err: any) {
            setMessage(String(err?.message ?? err));
        } finally { setLoading(false); }
    }

    async function sendMagicLink() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        if (!email) return setMessage("Informe um e-mail");
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await sb.auth.signInWithOtp({ email });
            if (error) setMessage(error.message);
            else setMessage("Link enviado — verifique seu email");
        } catch (err: any) {
            setMessage(String(err?.message ?? err));
        } finally { setLoading(false); }
    }

    async function signOut() {
        if (!sb) return;
        await sb.auth.signOut();
        setMessage("Desconectado");
    }

    return (
        <div className="p-4 bg-white/3 rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-3">Autenticação</h3>

            {/* mensagens de estado */}
            {message && <div className="mb-3"><p className="text-sm text-yellow-300">{message}</p></div>}

            {/* Usuário já autenticado */}
            {user ? (
                <div>
                    <p className="text-sm">Conectado como <strong>{user.email ?? user.id}</strong></p>
                    <div className="mt-3">
                        <button className="px-3 py-2 bg-red-600 rounded text-sm" onClick={signOut}>Sair</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* OAuth */}
                    <div>
                        <p className="text-sm text-gray-300 mb-2">Entrar com conta externa</p>
                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-gray-800 text-white rounded" onClick={signInWithGitHub} disabled={loading}>GitHub</button>
                            <button className="flex-1 px-3 py-2 bg-gray-800 text-white rounded" onClick={signInWithDiscord} disabled={loading}>Discord</button>
                        </div>
                    </div>

                    {/* Email + senha */}
                    <div>
                        <p className="text-sm text-gray-300 mb-2">Entrar com email e senha</p>
                        <div className="flex gap-2">
                            <input
                                aria-label="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 p-2 rounded bg-white/5 border border-white/5"
                            />
                            <input
                                aria-label="senha"
                                placeholder="senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-40 p-2 rounded bg-white/5 border border-white/5"
                            />
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={signInWithPassword} disabled={loading}>Entrar</button>
                            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={signUpWithPassword} disabled={loading}>Criar conta</button>
                        </div>
                    </div>

                    {/* Magic link (optional) */}
                    <div>
                        <p className="text-sm text-gray-300 mb-2">Ou faça login sem senha (magic link)</p>
                        <div className="flex gap-2">
                            <input
                                aria-label="email-magic"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 p-2 rounded bg-white/5 border border-white/5"
                            />
                            <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={sendMagicLink} disabled={loading}>Enviar link</button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Se o envio de e-mails falhar, configure SMTP em Supabase Dashboard.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
