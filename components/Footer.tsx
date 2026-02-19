import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="w-full border-t border-[#232326] bg-[#09090b] px-6 py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo_broken.png"
                        alt="linkz.bio logo"
                        width={80}
                        height={80}
                        className="rounded-sm"
                    />
                </Link>

                <div className="flex items-center gap-8">
                    <Link href="#" className="text-xs uppercase tracking-widest text-[#71717a] transition-colors hover:text-[#fafafa]">
                        Discord
                    </Link>
                    <Link href="#" className="text-xs uppercase tracking-widest text-[#71717a] transition-colors hover:text-[#fafafa]">
                        Twitter
                    </Link>
                    <Link href="#" className="text-xs uppercase tracking-widest text-[#71717a] transition-colors hover:text-[#fafafa]">
                        GitHub
                    </Link>
                </div>

                <p className="font-mono text-xs text-[#3f3f46]">
                    {'2026 broken.bio'}
                </p>
            </div>
        </footer>
    )
}
