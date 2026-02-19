"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const tabs = [
    { label: "HOME", href: "#" },
    { label: "PLANOS", href: "#pricing" },
]

export function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const activeTab = tabRefs.current[activeIndex]
        const container = containerRef.current
        if (activeTab && container) {
            const containerRect = container.getBoundingClientRect()
            const tabRect = activeTab.getBoundingClientRect()
            setIndicatorStyle({
                left: tabRect.left - containerRect.left,
                width: tabRect.width,
            })
        }
    }, [activeIndex])

    const handleTabClick = (index: number) => {
        setActiveIndex(index)
        const href = tabs[index].href
        if (href !== "#") {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: "smooth" })
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo_broken.png"
                        alt="linkz.bio logo"
                        width={102}
                        height={102}
                        className="rounded-sm"
                    />
                </Link>


                <div
                    ref={containerRef}
                    className="relative hidden items-center rounded-full border border-[#232326] bg-[#111113] p-1 md:flex"
                >
                    <div
                        className="absolute top-1 bottom-1 rounded-full bg-[#fafafa] transition-all duration-300 ease-in-out"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`,
                        }}
                    />
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            ref={(el) => { tabRefs.current[index] = el }}
                            onClick={() => handleTabClick(index)}
                            className={`relative z-10 cursor-pointer rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${activeIndex === index
                                ? "text-[#09090b]"
                                : "text-[#71717a] hover:text-[#fafafa]"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <Link
                    href="/login"
                    className="group flex items-center gap-1.5 rounded-full bg-[#292929] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#fafafa] transition-all hover:bg-[#747474] active:scale-95"
                >
                    LOGIN
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
            </div>
        </header>
    )
}
