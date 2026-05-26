import { Link } from "@tanstack/react-router";
import {
  ShieldHalf, ArrowRight, ClipboardCheck, ShieldCheck, GitPullRequestArrow,
  AlertTriangle, CheckSquare, FileText, Sparkles, Building2, ChevronRight,
} from "lucide-react";

const modules = [
  { to: "/assessments/iso-27001", icon: ClipboardCheck, title: "Évaluation ISO 27001",
    text: "Lancez une évaluation structurée pour mesurer votre niveau de préparation.",
    m1: "9 domaines", m2: "81 contrôles" },
  { to: "/controls", icon: ShieldCheck, title: "Contrôles",
    text: "Suivez les contrôles, les responsables et les preuves associées.",
    m1: "48 conformes", m2: "12 à améliorer" },
  { to: "/gaps", icon: GitPullRequestArrow, title: "Écarts de preuves",
    text: "Identifiez les preuves manquantes et priorisez les écarts critiques.",
    m1: "13 ouverts", m2: "5 critiques" },
  { to: "/risks", icon: AlertTriangle, title: "Risques",
    text: "Analysez les risques selon leur impact, probabilité et traitement.",
    m1: "4 critiques", m2: "7 élevés" },
  { to: "/tasks", icon: CheckSquare, title: "Tâches",
    text: "Transformez les écarts et risques en actions de remédiation.",
    m1: "9 à faire", m2: "3 urgentes" },
  { to: "/reports", icon: FileText, title: "Rapports",
    text: "Générez des rapports exécutifs exportables en Markdown, HTML et JSON.",
    m1: "Synthèse IA", m2: "Export réel" },
  { to: "/reports", icon: Sparkles, title: "Assistant IA",
    text: "Explique les écarts, analyse les risques et prépare des synthèses basées sur vos données.",
    m1: "IA contrôlée", m2: "Sources utilisées" },
  { to: "/vendors", icon: Building2, title: "Fournisseurs",
    text: "Évaluez les risques tiers et les revues fournisseurs.",
    m1: "Google Workspace", m2: "Revues manuelles" },
] as const;

const workflow = ["Évaluation", "Contrôles", "Écarts", "Risques", "Tâches", "Rapports"];

export function AveronixSite() {
  return (
    <div className="min-h-screen bg-white text-[#1a1424]">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C560CC] text-white">
              <ShieldHalf className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Averonix</span>
          </Link>
          <div className="hidden gap-7 text-sm text-[#4a3d5c] md:flex">
            <a href="#produit" className="hover:text-[#C560CC]">Produit</a>
            <a href="#workflow" className="hover:text-[#C560CC]">Workflow</a>
            <a href="#modules" className="hover:text-[#C560CC]">Modules</a>
            <a href="#ia" className="hover:text-[#C560CC]">IA</a>
            <a href="#rapports" className="hover:text-[#C560CC]">Rapports</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-[#1a1424] hover:bg-black/5">
              Se connecter
            </Link>
            <Link to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#C560CC] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#a945b1]">
              Explorer le tableau de bord <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="produit" className="relative overflow-hidden border-b border-black/5
        bg-[radial-gradient(1100px_500px_at_85%_-10%,rgba(197,96,204,0.18),transparent_60%),radial-gradient(900px_400px_at_-10%_20%,rgba(80,40,120,0.10),transparent_60%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C560CC]/30 bg-[#C560CC]/10 px-3 py-1 text-xs font-medium text-[#7a2d82]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C560CC]" />
              Plateforme de préparation à la conformité cybersécurité
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Transformez votre évaluation <span className="text-[#C560CC]">ISO 27001</span> en plan d’action clair.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4a3d5c]">
              Averonix aide les équipes à suivre les contrôles, les écarts, les risques, les tâches
              et les rapports depuis un tableau de bord unique.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-[#C560CC] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#a945b1]">
                Explorer le tableau de bord <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/request-demo"
                className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-[#1a1424] hover:border-[#C560CC]/40 hover:text-[#C560CC]">
                Demander une démonstration
              </Link>
            </div>
          </div>

          {/* PREVIEW MOCKUP */}
          <HeroPreview />
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C560CC]">Modules</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Un produit, huit modules connectés</h2>
          </div>
          <span className="hidden text-xs text-[#7a6f88] md:block">Données de démonstration</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link key={m.title} to={m.to}
              className="group rounded-xl border border-black/[0.07] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 hover:border-[#C560CC]/40 hover:shadow-[0_12px_30px_-12px_rgba(197,96,204,0.35)]">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C560CC]/10 text-[#7a2d82]">
                  <m.icon className="h-5 w-5" />
                </div>
                <ChevronRight className="h-4 w-4 text-[#b3a8c2] group-hover:text-[#C560CC]" />
              </div>
              <div className="mt-4 text-sm font-semibold text-[#1a1424]">{m.title}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6b5f7d]">{m.text}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-[#C560CC]/20 bg-[#C560CC]/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#7a2d82]">{m.m1}</span>
                <span className="rounded-md border border-black/[0.06] bg-[#f6f3fa] px-2 py-0.5 text-[10px] font-medium text-[#5b4d6e]">{m.m2}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="border-y border-black/5 bg-[#faf7fc]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C560CC]">Workflow</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Du diagnostic aux actions concrètes</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#6b5f7d]">
              Un workflow simple pour passer du diagnostic aux actions concrètes.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {workflow.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className={
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium " +
                  (i === 0
                    ? "border-[#C560CC] bg-[#C560CC] text-white shadow-sm"
                    : "border-[#C560CC]/25 bg-white text-[#5b4d6e]")
                }>{step}</span>
                {i < workflow.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-[#C560CC]/60" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="rapports" className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-2xl border border-[#C560CC]/20 bg-[linear-gradient(135deg,#1a1029_0%,#2a1840_55%,#4a2360_100%)] p-10 text-center text-white shadow-[0_30px_60px_-30px_rgba(74,35,96,0.6)]">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Prêt à explorer Averonix ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
            Découvrez comment une évaluation peut devenir un plan d’action clair.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-[#C560CC] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a945b1]">
              Explorer le tableau de bord <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/request-demo"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10">
              Demander une démonstration
            </Link>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between text-xs text-[#8a7e9c]">
          <div className="flex items-center gap-2">
            <ShieldHalf className="h-3.5 w-3.5 text-[#C560CC]" />
            <span>© {new Date().getFullYear()} Averonix · Compliance Cloud</span>
          </div>
          <span>Données de démonstration · Simulation indicative</span>
        </div>
      </section>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[28px] bg-[radial-gradient(closest-side,rgba(197,96,204,0.25),transparent)] blur-2xl" />
      <div className="relative rounded-2xl border border-black/10 bg-white p-3 shadow-[0_30px_80px_-30px_rgba(74,35,96,0.35)]">
        {/* fake window chrome */}
        <div className="flex items-center justify-between rounded-t-xl border border-black/5 bg-[#f7f4fa] px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5d3e8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5d3e8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5d3e8]" />
          </div>
          <span className="text-[10px] font-medium text-[#7a6f88]">averonix · tableau de bord</span>
          <span className="rounded-full bg-[#C560CC]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#7a2d82]">
            Démo
          </span>
        </div>

        <div className="rounded-b-xl border border-t-0 border-black/5 bg-white p-4">
          {/* Readiness card */}
          <div className="rounded-xl border border-[#C560CC]/20 bg-[linear-gradient(135deg,#fff_0%,#fbf4fc_100%)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#7a6f88]">Préparation globale</div>
                <div className="mt-1 text-3xl font-semibold tabular-nums text-[#1a1424]">72%</div>
              </div>
              <span className="rounded-full bg-[#C560CC]/10 px-2 py-0.5 text-[10px] font-semibold text-[#7a2d82]">+6%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#efe6f1]">
              <div className="h-full rounded-full bg-[#C560CC]" style={{ width: "72%" }} />
            </div>
          </div>

          {/* mini KPIs */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { l: "Contrôles", v: "48/81" },
              { l: "Écarts", v: "13" },
              { l: "Risques", v: "4" },
              { l: "Tâches", v: "9" },
            ].map((k) => (
              <div key={k.l} className="rounded-lg border border-black/5 bg-white p-2.5">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-[#9c8fa8]">{k.l}</div>
                <div className="mt-0.5 text-sm font-semibold tabular-nums text-[#1a1424]">{k.v}</div>
              </div>
            ))}
          </div>

          {/* Lower split */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-black/5 bg-white p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9c8fa8]">Actions prioritaires</div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-[#3d3450]">
                {[
                  ["Politique de sauvegarde", "critique"],
                  ["Revue accès admin", "élevé"],
                  ["Plan de réponse incident", "moyen"],
                ].map(([t, sev]) => (
                  <li key={t} className="flex items-center justify-between">
                    <span className="truncate">{t}</span>
                    <span className={
                      "ml-2 shrink-0 rounded-full px-1.5 py-[1px] text-[9px] font-semibold " +
                      (sev === "critique"
                        ? "bg-[#fde6e6] text-[#a83232]"
                        : sev === "élevé"
                        ? "bg-[#fdeacd] text-[#92590f]"
                        : "bg-[#e9e4f3] text-[#5b4d6e]")
                    }>{sev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[#C560CC]/20 bg-[#fbf4fc] p-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#C560CC]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7a2d82]">Synthèse IA</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#3d3450]">
                Votre préparation progresse de +6%. Concentrez-vous sur 5 écarts critiques pour atteindre 80%.
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-[#C560CC]/30 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#7a2d82]">
                <FileText className="h-2.5 w-2.5" /> Rapport prêt
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-[9px] font-medium uppercase tracking-wider text-[#9c8fa8]">
            Données de démonstration
          </div>
        </div>
      </div>
    </div>
  );
}
