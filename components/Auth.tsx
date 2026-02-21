"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";
import { FaGithub, FaDiscord } from "react-icons/fa";

export default function Auth() {
    const [sb, setSb] = useState<SupabaseClient | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        try {
            const modeParam = searchParams.get("mode");
            const usernameParam = searchParams.get("username");
            if (modeParam === "signup") setMode("signup");
            if (usernameParam) setUsername(usernameParam);
        } catch (_e) { /* ignore in SSR or if no params */ }
    }, [searchParams]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const NEXT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const NEXT_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!NEXT_URL || !NEXT_KEY) {
            setMessage("Supabase público não configurado (NEXT_PUBLIC_SUPABASE_*)");
            return;
        }

        let subscriptionToUnsubscribe: any = null;

        (async () => {
            try {
                const client = (await import("../lib/supabaseClient")).getSupabaseClient();
                setSb(client as any);

                client.auth.getSession().then((res) => {
                    const session = res?.data?.session as Session | null;
                    if (session?.user) setUser(session.user);
                }).catch(() => { });

                const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
                    void _event;
                    setUser(session?.user ?? null);
                });

                subscriptionToUnsubscribe = sub?.subscription ?? null;
            } catch (_e) {
                setMessage("Supabase público não configurado (NEXT_PUBLIC_SUPABASE_*)");
                return;
            }
        })();

        return () => {
            try { subscriptionToUnsubscribe?.unsubscribe?.(); } catch (e) { void e; }
        };
    }, []);

    async function signInWithGitHub() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        setLoading(true);
        setMessage(null);
        try {
            await sb.auth.signInWithOAuth({ provider: "github", options: { redirectTo: window.location.origin + "/login" } });
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(err.message);
            else setMessage(String(err));
        } finally { setLoading(false); }
    }

    useEffect(() => {
        if (!sb || !user) return;
        // clear only when we have a logged-in user and are about to fetch their profile
        setUsername(null);
        (async () => {
            try {
                const { data, error } = await sb
                    .from("profiles")
                    .select("username")
                    .eq("owner_id", user.id)
                    .maybeSingle();

                if (!error && data && typeof (data as Record<string, unknown>).username === 'string') {
                    setUsername((data as Record<string, unknown>).username as string);
                }
            } catch (_e: unknown) { void _e; }
        })();
    }, [sb, user]);

    async function signInWithDiscord() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        setLoading(true);
        setMessage(null);
        try {
            await sb.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: window.location.origin + "/login" } });
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(err.message);
            else setMessage(String(err));
        } finally { setLoading(false); }
    }

    async function signUpWithPassword() {
        if (!sb) return setMessage("Supabase cliente não inicializado");
        if (!email || !password) return setMessage("Informe email e senha");
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await sb.auth.signUp({
                email,
                password,
                options: { data: { username: username ?? undefined } },
            } as any);
            if (error) setMessage(error.message);
            else setMessage("Conta criada. Verifique seu e-mail se for requerido.");
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(err.message);
            else setMessage(String(err));
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
        } catch (err: unknown) {
            if (err instanceof Error) setMessage(err.message);
            else setMessage(String(err));
        } finally { setLoading(false); }
    }

    async function signOut() {
        if (!sb) return;
        await sb.auth.signOut();
        setMessage("Desconectado");
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff06_1.5px,transparent_1.5px)] bg-size-[32px_32px] bg-[#09090b]" />

            <div className="p-6 bg-linear-to-br from-white/4 via-white/6 to-white/4 rounded-2xl border border-white/6 shadow-xl backdrop-blur-md">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold">Autenticação</h3>
                        <p className="text-sm text-gray-300">Entre na sua conta ou crie uma nova</p>
                    </div>

                    <div className="relative inline-flex items-center bg-white/3 rounded-full p-1">
                        <div
                            className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out"
                            style={{ left: mode === "signup" ? "50%" : "0.25rem", width: "calc(50% - 0.25rem)" }}
                        />

                        <button
                            onClick={() => setMode("signin")}
                            className={`relative z-10 px-3 py-1 rounded-full text-sm ${mode === "signin" ? "text-black" : "text-gray-300"}`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`relative z-10 px-3 py-1 rounded-full text-sm ${mode === "signup" ? "text-black" : "text-gray-300"}`}
                        >
                            Criar
                        </button>
                    </div>
                </div>

                {message && <div className="mb-3"><p className="text-sm text-yellow-300">{message}</p></div>}

                {user ? (
                    <div>
                        <p className="text-sm">Está logado no email <strong>{user.email ?? user.id}</strong></p>
                        <div className="mt-3 flex gap-3">
                            <button
                                className="px-4 py-2 bg-blue-600 rounded text-sm"
                                onClick={() => username ? router.push(`/${username}`) : null}
                                disabled={!username}
                            >
                                Ir para sua página
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 rounded text-sm"
                                onClick={async () => { await signOut(); router.push('/'); }}
                            >
                                Logoff
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-300 mb-2 block">Email</label>
                            <input
                                aria-label="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className="text-sm text-gray-300 mb-2 block">Username</label>
                                <input
                                    aria-label="username"
                                    placeholder="username"
                                    value={username ?? ''}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-white/5 border border-white/6"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-300 mb-2 block">Senha</label>
                            <input
                                aria-label="senha"
                                placeholder="senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/6"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {mode === "signin" ? (
                                <button className="flex-1 px-4 py-2 bg-[#797979] text-white rounded-lg" onClick={signInWithPassword} disabled={loading}>Entrar</button>
                            ) : (
                                <button className="flex-1 px-4 py-2 bg-[#494949] text-white rounded-lg" onClick={signUpWithPassword} disabled={loading}>Criar conta</button>
                            )}
                        </div>
                        <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px bg-white/6" />
                            <p className="text-sm text-gray-400">ou</p>
                            <div className="flex-1 h-px bg-white/6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-300 mb-3">Entrar com</p>
                            <div className="grid grid-cols-1 gap-2">
                                <button className="flex items-center justify-center gap-3 px-3 py-3 bg-black text-white rounded-lg border border-white/6 hover:opacity-95" onClick={signInWithGitHub} disabled={loading}><FaGithub className="h-6 w-6" />GitHub</button>
                                <button className="flex items-center justify-center gap-3 px-3 py-3 bg-indigo-600 text-white rounded-lg hover:opacity-95" onClick={signInWithDiscord} disabled={loading}><FaDiscord className="h-6 w-6" />Discord</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
