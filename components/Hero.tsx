"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, MessageCircle } from "lucide-react"
import { MouseParallax } from "react-just-parallax";

const members = [
    { name: "aroc", slug: "/aroc", initials: "AR", top: "30%", left: "0%" },
    { name: "kgdamn", slug: "/kgdamn", initials: "KG", top: "45%", left: "95%" },
    { name: "shk1ng", slug: "/shk1ng", initials: "SH", top: "80%", left: "10%" },
    { name: "afton", slug: "/afton", initials: "AF", top: "20%", left: "70%" },
    { name: "tokyo", slug: "/tokyo", initials: "TO", top: "75%", left: "75%" },
];

export function Hero() {
    const [username, setUsername] = useState("")
    const router = useRouter()
    const trackRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        const update = () => {
            const total = track.scrollWidth
            const single = total / 2
            track.style.setProperty("--scroll-width", `${single}px`)
            const speed = 120
            const minDuration = 2
            const duration = Math.max(minDuration, single / speed)
            track.style.setProperty("--scroll-duration", `${duration}s`)
        }

        update()

        const ro = new ResizeObserver(() => update())
        ro.observe(track)
        const onWin = () => update()
        window.addEventListener("resize", onWin)

        return () => {
            ro.disconnect()
            window.removeEventListener("resize", onWin)
        }
    }, [])

    return (
        <section className="w-full relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090b] px-6">

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff06_1.5px,transparent_1.5px)] bg-size-[32px_32px]" />
            <div className="pointer-events-none absolute top-[15%] left-1/2 h-125 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#999999]/6 blur-[150px]" />

            <MouseParallax enableOnTouchDevice isAbsolutelyPositioned>
                <div className="absolute inset-0 w-full max-w-7xl left-1/2 -translate-x-1/2 pointer-events-none">
                    {members.map((m, idx) => (
                        <a
                            key={`${m.name}-${idx}`}
                            href={m.slug}
                            className="absolute flex items-center gap-2.5 rounded-lg border border-[#232326] bg-[#111113]/80 pr-22 pl-4 pt-4 pb-4 px-12 transition-all hover:border-[#ffffff]/20 hover:scale-105 pointer-events-auto"
                            style={{
                                top: m.top,
                                left: m.left
                            }}
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1c1c1f] font-mono text-[10px] font-bold text-[#71717a]">
                                {m.initials}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#fafafa]">{m.name}</span>
                                <span className="text-[12px] text-[#3f3f46]">{m.slug}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </MouseParallax>

            <div className="relative z-10 flex max-w-6xl flex-col items-center gap-10">
                <a
                    href="https://discord.gg/ysg4dzpP"
                    target="_blank"
                    className="group flex items-center gap-2.5 rounded-full border border-[#232326] bg-[#111113] px-5 py-2.5 text-sm text-[#a1a1aa] transition-all hover:border-[#747474]/30 hover:text-[#fafafa]"
                >
                    <MessageCircle className="h-4 w-4 text-[#616161]" />
                    <span>Entre no nosso servidor do Discord!</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>

                <div className="flex flex-col items-center gap-5">
                    <h1 className="text-center text-5xl font-bold leading-[1.1] tracking-tight text-[#fafafa] md:text-6xl lg:text-8xl text-balance">
                        Todos os seus links.
                        <br />
                        <span className="text-[#797979]">Um so lugar.</span>
                    </h1>
                    <p className="max-w-md text-center text-base leading-relaxed text-[#71717a] md:text-lg text-pretty">
                        Junte-se a mais de 23 pessoas que usam a broken.bio e faca parte da comunidade.
                    </p>
                </div>

                <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 items-center rounded-lg border border-[#232326] bg-[#111113] px-4 py-3.5 transition-all focus-within:border-[#ef4444]/50 focus-within:ring-1 focus-within:ring-[#ef4444]/20">
                        <span className="mr-1 font-mono text-sm font-medium text-[#999999]">broken.bio/</span>
                        <input
                            type="text"
                            placeholder="seu-nome"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent text-sm text-[#fafafa] outline-none placeholder:text-[#3f3f46]"
                            aria-label="Nome de usuario"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push(`/login?mode=signup&username=${encodeURIComponent(username)}`)}
                        disabled={username.trim() === ""}
                        className="shrink-0 rounded-lg bg-[#949494] px-7 py-3.5 text-sm font-semibold text-[#fafafa] transition-all hover:bg-[#363636] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Criar
                    </button>
                </div>
            </div>

            <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t from-[#09090b] to-transparent" />
        </section>
    )
}
