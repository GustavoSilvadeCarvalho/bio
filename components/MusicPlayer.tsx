"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Music, Play, Pause, Loader2 } from "lucide-react"

declare global {
    interface Window {
        YT: typeof YT
        onYouTubeIframeAPIReady: (() => void) | undefined
    }
}

function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
        /(?:youtu\.be\/)([^?\s]+)/,
        /(?:youtube\.com\/embed\/)([^?\s]+)/,
        /(?:youtube\.com\/shorts\/)([^?\s]+)/,
    ]
    for (const p of patterns) {
        const m = url.match(p)
        if (m) return m[1]
    }
    return null
}

function loadYTApi(): Promise<void> {
    return new Promise((resolve) => {
        if (window.YT?.Player) {
            resolve()
            return
        }
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const id = setInterval(() => {
                if (window.YT?.Player) { clearInterval(id); resolve() }
            }, 100)
            return
        }
        window.onYouTubeIframeAPIReady = () => resolve()
        const s = document.createElement("script")
        s.src = "https://www.youtube.com/iframe_api"
        document.head.appendChild(s)
    })
}

function useYTPlayer(url: string) {
    const [playing, setPlaying] = useState(false)
    const [loading, setLoading] = useState(true)
    const [ready, setReady] = useState(false)
    const [time, setTime] = useState(0)
    const [dur, setDur] = useState(0)
    const [title, setTitle] = useState("")

    const player = useRef<YT.Player | null>(null)
    const ticker = useRef<ReturnType<typeof setInterval> | null>(null)
    const box = useRef<HTMLDivElement | null>(null)

    const tick = useCallback((on: boolean) => {
        if (ticker.current) clearInterval(ticker.current)
        if (on) {
            ticker.current = setInterval(() => {
                if (player.current?.getCurrentTime)
                    setTime(player.current.getCurrentTime())
            }, 250)
        }
    }, [])

    useEffect(() => {
        const videoId = extractVideoId(url)
        if (!videoId) return

        let cancelled = false

            ; (async () => {
                setLoading(true)
                setReady(false)
                setTime(0)
                setDur(0)
                setTitle("")
                tick(false)

                await loadYTApi()
                if (cancelled) return

                if (player.current) { player.current.destroy(); player.current = null }

                if (!box.current) {
                    box.current = document.createElement("div")
                    Object.assign(box.current.style, {
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                        opacity: "0",
                        pointerEvents: "none",
                    })
                    document.body.appendChild(box.current)
                }

                const div = document.createElement("div")
                div.id = "yt-" + Date.now()
                box.current.innerHTML = ""
                box.current.appendChild(div)

                player.current = new window.YT.Player(div.id, {
                    videoId,
                    height: "1",
                    width: "1",
                    playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0 },
                    events: {
                        onReady(e: YT.PlayerEvent) {
                            if (cancelled) return
                            const p = e.target
                            setDur(p.getDuration())
                            setLoading(false)
                            setReady(true)
                            setPlaying(true)
                            const d = p.getVideoData?.()
                            if (d?.title) setTitle(d.title)
                            tick(true)
                        },
                        onStateChange(e: YT.OnStateChangeEvent) {
                            if (cancelled) return
                            const s = e.data
                            if (s === window.YT.PlayerState.PLAYING) { setPlaying(true); tick(true) }
                            if (s === window.YT.PlayerState.PAUSED) { setPlaying(false); tick(false) }
                            if (s === window.YT.PlayerState.ENDED) { setPlaying(false); tick(false) }
                            setLoading(s === window.YT.PlayerState.BUFFERING)
                        },
                    },
                })
            })()

        return () => {
            cancelled = true
            tick(false)
            player.current?.destroy()
            player.current = null
        }
    }, [url, tick])

    const toggle = useCallback(() => {
        if (!player.current) return
        if (playing) {
            player.current.pauseVideo()
        } else {
            player.current.playVideo()
        }
    }, [playing])

    const seek = useCallback((t: number) => {
        player.current?.seekTo(t, true)
        setTime(t)
    }, [])

    return { playing, loading, ready, time, dur, title, toggle, seek }
}

function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
}

interface MusicPlayerProps {
    url: string
    cardColor?: string
    showCard?: boolean
    glass?: boolean
    opacity?: number
}

export function MusicPlayer({ url, cardColor, showCard = true, glass = false, opacity = 1 }: MusicPlayerProps) {
    const { playing, loading, ready, time, dur, title, toggle, seek } =
        useYTPlayer(url)

    const barRef = useRef<HTMLDivElement>(null)
    const dragging = useRef(false)

    const pct = dur > 0 ? (time / dur) * 100 : 0

    const seekFromEvent = useCallback(
        (e: React.PointerEvent | PointerEvent) => {
            const rect = barRef.current?.getBoundingClientRect()
            if (!rect || dur === 0) return
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
            seek((x / rect.width) * dur)
        },
        [dur, seek]
    )

    const onPointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!ready) return
            dragging.current = true
                ; (e.target as HTMLDivElement).setPointerCapture(e.pointerId)
            seekFromEvent(e)
        },
        [ready, seekFromEvent]
    )

    const onPointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (dragging.current) seekFromEvent(e)
        },
        [seekFromEvent]
    )

    const onPointerUp = useCallback(() => {
        dragging.current = false
    }, [])

    if (!showCard) {
        return null
    }

    function hexToRgba(hex: string, a = 1) {
        try {
            const h = hex.replace('#', '').trim();
            const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        } catch { return `rgba(255,255,255,${a})`; }
    }

    let bg: string | undefined;
    if (cardColor) {
        if (glass) {
            const alpha = Math.max(0.02, Math.min(1, (opacity ?? 1) * 0.28));
            bg = hexToRgba(cardColor, alpha);
        } else {
            bg = hexToRgba(cardColor, opacity ?? 1);
        }
    }

    const containerStyle: React.CSSProperties & Record<string, string | number | undefined> = { backgroundColor: bg };
    if (glass) {
        containerStyle.backdropFilter = 'blur(8px)';
        containerStyle.WebkitBackdropFilter = 'blur(8px)';
        containerStyle.border = '1px solid rgba(255,255,255,0.06)';
    }

    return (
        <div style={containerStyle} className="flex w-full select-none flex-col gap-4 rounded-xl p-5 transition-all">
            <div className="flex items-center gap-3.5">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 ${playing ? "animate-pulse" : ""
                        }`}
                >
                    <Music className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-tight text-[#e8e8ec]">
                        {title || (ready ? "Sem titulo" : loading ? "Carregando..." : "...")}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <div
                        ref={barRef}
                        role="slider"
                        aria-label="Progresso da musica"
                        aria-valuemin={0}
                        aria-valuemax={dur}
                        aria-valuenow={Math.floor(time)}
                        tabIndex={0}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        className="group relative h-5 cursor-pointer touch-none"
                    >
                        <div className="absolute left-0 top-1/2 h-1.25 w-full -translate-y-1/2 overflow-hidden rounded-full bg-[#1c1c1f]">
                            <div
                                className="h-full rounded-full bg-white/80 transition-[width] duration-100"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div
                            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                            style={{ left: `${pct}%` }}
                        />
                    </div>

                    <div className="flex justify-between px-0.5">
                        <span className="text-[10px] tabular-nums text-[#6e6e78]">{fmt(time)}</span>
                        <span className="text-[10px] tabular-nums text-[#6e6e78]">{fmt(dur)}</span>
                    </div>
                </div>

                <div>
                    <button
                        onClick={toggle}
                        disabled={!ready}
                        aria-label={playing ? "Pausar" : "Tocar"}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-30"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : playing ? (
                            <Pause className="h-5 w-5" fill="currentColor" />
                        ) : (
                            <Play className="h-5 w-5 translate-x-px" fill="currentColor" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}