"use client"

import React, { useRef, useEffect } from "react"

interface Props {
    color?: string;
    count?: number;
    size?: number;
    life?: number;
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

export default function MouseParticles({ color = '#58a6ff', count = 3, size = 4, life = 60 }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const el = canvas
        const ctx = el.getContext('2d')!
        const dpr = Math.max(1, window.devicePixelRatio || 1)
        let width = 0
        let height = 0
        let raf = 0
        let particles: Array<any> = []

        function resize() {
            const parent = el.parentElement!
            width = parent.clientWidth
            height = parent.clientHeight
            el.width = Math.floor(width * dpr)
            el.height = Math.floor(height * dpr)
            el.style.width = `${width}px`
            el.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        function spawn(x: number, y: number) {
            for (let i = 0; i < count; i++) {
                const r = Math.max(0.5, size * (0.6 + Math.random() * 0.9))
                const l = Math.max(8, life * (0.6 + Math.random() * 0.8))
                particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 1.6,
                    vy: -Math.random() * 1.8 - 0.2,
                    r,
                    life: l,
                    age: 0,
                    col: color,
                })
            }
        }

        function onPointer(e: PointerEvent) {
            const parent = el.parentElement!
            const rect = parent.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            spawn(x, y)
        }

        function tick() {
            ctx.clearRect(0, 0, width, height)
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]
                p.vy += 0.035
                p.vx *= 0.995
                p.vy *= 0.995
                p.x += p.vx
                p.y += p.vy
                p.age++
                const life = p.life
                const t = 1 - p.age / life
                if (t <= 0) { particles.splice(i, 1); continue }
                const alpha = Math.pow(t, 1.4)
                const s = p.r * (0.7 + (t * 0.6))
                ctx.beginPath()
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 2)
                g.addColorStop(0, hexToRgba(p.col, alpha))
                g.addColorStop(1, hexToRgba(p.col, 0))
                ctx.fillStyle = g
                ctx.arc(p.x, p.y, s, 0, Math.PI * 2)
                ctx.fill()
            }
            raf = requestAnimationFrame(tick)
        }

        resize()
        window.addEventListener('resize', resize)

        const parent = el.parentElement
        parent?.addEventListener('pointermove', onPointer)

        raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
            parent?.removeEventListener('pointermove', onPointer)
        }
    }, [])

    return (
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none rounded-3xl" />
    )
}
