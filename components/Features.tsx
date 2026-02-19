import { Link2, Palette, BarChart3, Zap } from "lucide-react"

const features = [
    {
        icon: Link2,
        title: "Links ilimitados",
        description:
            "Adicione quantos links quiser ao seu perfil. Sem limites, sem restricoes.",
    },
    {
        icon: Palette,
        title: "Personalizacao total",
        description:
            "Customize cores, fontes e layout do seu perfil do jeito que voce quiser.",
    },
    {
        icon: BarChart3,
        title: "Analytics avancado",
        description:
            "Acompanhe cliques, visitantes e estatisticas em tempo real.",
    },
    {
        icon: Zap,
        title: "Super rapido",
        description:
            "Seu perfil carrega instantaneamente com nossa infraestrutura otimizada.",
    },
]

export function Features() {
    return (
        <section className="w-full relative px-6 py-32 bg-[#09090b]">

            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                        Tudo que voce precisa.
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Recursos poderosos para criar o perfil perfeito.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-[#797979] hover:bg-[#191919]"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#090909] text-[#797979] transition-colors group-hover:bg-[#292929]">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
