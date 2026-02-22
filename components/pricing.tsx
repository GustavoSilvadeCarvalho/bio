"use client";

import { Check } from "lucide-react"
import getSupabaseClient from "../lib/supabaseClient";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient | null = (() => {
  try { return getSupabaseClient(); } catch { return null; }
})();

const plans = [
  {
    name: "Gratis",
    price: "R$ 0",
    period: "/Vitalicio",
    desc: "Para comecar, conecte todas as suas redes em um so lugar.",
    features: [
      "Links ilimitados",
      "Personalizacao de perfil",
      "Integracao com redes sociais",
      "Analytics basico",
    ],
    cta: "Comecar",
    ctaStyle: "border border-[#232326] bg-[#111113] text-[#fafafa] hover:bg-[#1c1c1f]",
    highlight: false,
  },
  {
    name: "Premium",
    price: "R$ 29,90",
    period: "/Vitalicio",
    desc: "O plano perfeito para liberar sua criatividade e mais recursos.",
    features: [
      "Badge exclusivo",
      "Layouts de perfil",
      "Fontes personalizadas",
      "Animacao de maquina de escrever",
      "Efeitos especiais de perfil",
      "Personalizacao avancada",
    ],
    cta: "Assinar agora",
    ctaStyle: "bg-[#595959] text-[#fafafa] hover:bg-[#797979]",
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="w-full relative bg-[#09090b] px-6 py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff06_1.5px,transparent_1.5px)] bg-size-[32px_32px]" />

      <div className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#999999]/6 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-16 flex flex-col items-center gap-4">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#f9f9f9]">
            Planos
          </span>
          <h2 className="max-w-lg text-center text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl text-balance">
            Explore nossos planos exclusivos
          </h2>
          <p className="text-sm text-[#71717a]">
            Pague uma vez. Fique para sempre.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${plan.highlight
                ? "border-[#797979]/30 bg-[#111113] shadow-[0_0_40px_-12px_rgba(250,250,250,0.15)]"
                : "border-[#232326] bg-[#111113]"
                }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 right-6 rounded-full bg-[#727272] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#fafafa]">
                  Popular
                </div>
              )}

              <div className="mb-6 flex flex-col gap-1">
                <span className="text-sm font-medium text-[#a1a1aa]">{plan.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#fafafa]">{plan.price}</span>
                  <span className="text-sm text-[#3f3f46]">{plan.period}</span>
                </div>
              </div>

              <p className="mb-8 text-sm leading-relaxed text-[#71717a]">{plan.desc}</p>

              <div className="mb-8 h-px bg-[#232326]" />

              <ul className="mb-10 flex flex-1 flex-col gap-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.highlight ? "bg-[#f9f9f9]/15 text-[#cccccc]" : "bg-[#1c1c1f] text-[#71717a]"}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-[#a1a1aa]">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-lg py-3.5 text-sm font-semibold transition-all active:scale-[0.97] ${plan.ctaStyle}`}
                onClick={async () => {
                  if (plan.name !== 'Premium') return;
                  try {
                    if (!supabase) { window.location.href = '/login'; return; }
                    const { data: sessionData } = await supabase.auth.getSession();
                    const session = sessionData?.session;
                    if (!session || !session.access_token) {
                      window.location.href = '/login';
                      return;
                    }

                    const res = await fetch('/api/stripe/checkout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                      },
                      body: JSON.stringify({}),
                    });
                    const json = await res.json();
                    if (json?.url) {
                      window.location.href = json.url;
                    } else {
                      alert(json?.error || 'Falha ao iniciar checkout');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Erro ao iniciar checkout');
                  }
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
