import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { StatusBadge, severityVariant } from "@/components/averonix/StatusBadge";
import { Sparkline } from "@/components/averonix/Charts";
import {
  frameworks, controls, gaps, risks, tasks, reports, evidenceGaps,
} from "@/mocks/data";
import {
  Shield, AlertTriangle, FileCheck, ArrowRight, ArrowUpRight, Sparkles,
  ClipboardList, ShieldCheck, ListChecks, FileText, Building2, Bot,
  Lock, CheckCircle2, MousePointer2, ChevronRight, Play,
} from "lucide-react";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "Averonix — Préparation à la conformité ISO 27001" },
      { name: "description", content: "Averonix transforme vos évaluations ISO 27001 en contrôles, écarts, risques, tâches et rapports — depuis un tableau de bord unique." },
      { property: "og:title", content: "Averonix — Préparation à la conformité ISO 27001" },
      { property: "og:description", content: "Une plateforme française pour structurer votre préparation ISO 27001." },
    ],
  }),
  component: MarketingPage,
});

const NAV = [
  { label: "Produit", href: "#produit" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Tableau de bord", href: "#tableau" },
  { label: "IA", href: "#ia" },
  { label: "Rapports", href: "#rapports" },
  { label: "Fournisseurs", href: "#fournisseurs" },
  { label: "Sécurité", href: "#securite" },
];

function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#FCFBFE] text-[#1F1630]">
      <TopNav />
      <Hero />
      <LogosStrip />
      <Workflow />
      <ProductTour />
      <Features />
      <DashboardGrid />
      <AISection />
      <ReportSection />
      <VendorSection />
      <TrustSection />
      <UseCases />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E9DDEA]/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/marketing" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C560CC] to-[#943A9B] text-white">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">Averonix</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-[#4A3F55] transition hover:text-[#C560CC]">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm" className="hidden sm:inline-flex">Se connecter</Button></Link>
          <Link to="/">
            <Button size="sm" className="bg-[#C560CC] text-white hover:bg-[#B14AB8]">
              Explorer le tableau de bord <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(197,96,204,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#FCFBFE)]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E9DDEA] bg-white px-3 py-1 text-xs text-[#6F6478]">
            <Sparkles className="h-3.5 w-3.5 text-[#C560CC]" />
            Plateforme de préparation à la conformité — ISO 27001
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Transformez vos évaluations ISO 27001 en{" "}
            <span className="bg-gradient-to-r from-[#C560CC] to-[#943A9B] bg-clip-text text-transparent">plan d'action clair</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-[#6F6478]">
            Averonix aide les équipes sécurité et conformité à suivre les contrôles, preuves, écarts, risques et tâches de remédiation depuis un tableau de bord unique.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/">
              <Button size="lg" className="bg-[#C560CC] text-white hover:bg-[#B14AB8]">
                Explorer le tableau de bord <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#fonctionnement">
              <Button size="lg" variant="outline" className="border-[#E9DDEA]">
                <Play className="mr-2 h-4 w-4" /> Voir le fonctionnement
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-16">
          <BrowserMockup>
            <DashboardOverviewPreview />
          </BrowserMockup>
        </div>
      </div>
    </section>
  );
}

function LogosStrip() {
  return (
    <section className="border-y border-[#E9DDEA]/60 bg-white/50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-center text-xs uppercase tracking-wider text-[#6F6478]">Conçu pour les équipes sécurité et conformité des PME</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[#6F6478]">
          {["ISO 27001:2022", "Annexe A", "9 domaines", "81 contrôles", "Évaluation guidée", "Rapports exportables"].map((t) => (
            <span key={t} className="opacity-70">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WORKFLOW ---------------- */
const WORKFLOW = [
  { id: "eval", label: "Évaluation", desc: "Répondez par domaine ISO 27001.", icon: ClipboardList },
  { id: "ctrl", label: "Contrôles", desc: "Cartographie des contrôles et preuves attendues.", icon: ShieldCheck },
  { id: "gaps", label: "Écarts", desc: "Faiblesses regroupées et exploitables.", icon: AlertTriangle },
  { id: "risk", label: "Risques", desc: "Priorisation par impact et probabilité.", icon: Shield },
  { id: "task", label: "Tâches", desc: "Actions assignées avec checklists.", icon: ListChecks },
  { id: "rep",  label: "Rapports", desc: "Synthèses prêtes pour les décideurs.", icon: FileText },
];

function Workflow() {
  return (
    <section id="fonctionnement" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Fonctionnement"
        title="De l'évaluation aux actions concrètes"
        subtitle="Averonix structure tout le cycle de préparation, sans dispersion entre outils."
      />
      <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {WORKFLOW.map((s, i) => (
          <div key={s.id} className="group relative">
            <Card className="border-[#E9DDEA] transition hover:-translate-y-0.5 hover:border-[#C560CC] hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF2FB] text-[#943A9B]">
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs uppercase tracking-wider text-[#6F6478]">Étape {i + 1}</div>
                <div className="mt-0.5 font-semibold">{s.label}</div>
                <p className="mt-1 text-sm text-[#6F6478]">{s.desc}</p>
              </CardContent>
            </Card>
            {i < WORKFLOW.length - 1 && (
              <ChevronRight className="absolute top-1/2 -right-3 hidden h-4 w-4 -translate-y-1/2 text-[#C560CC]/40 lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ANIMATED PRODUCT TOUR ---------------- */
const TOUR_STEPS = [
  { key: "overview",  label: "Vue d'ensemble",     route: "/" },
  { key: "controls",  label: "Contrôles",          route: "/controls" },
  { key: "gaps",      label: "Écarts de preuves",  route: "/gaps" },
  { key: "risks",     label: "Risques",            route: "/risks" },
  { key: "tasks",     label: "Tâches",             route: "/tasks" },
  { key: "reports",   label: "Rapports",           route: "/reports" },
] as const;

function ProductTour() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % TOUR_STEPS.length), 3800);
    return () => clearInterval(t);
  }, [paused]);
  const current = TOUR_STEPS[step];

  return (
    <section id="produit" className="relative overflow-hidden border-y border-[#E9DDEA]/60 bg-gradient-to-b from-white to-[#FAF2FB]/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          eyebrow="Visite produit"
          title="Un espace de travail conçu pour la préparation à la conformité"
          subtitle="Suivez le parcours réel : évaluation, contrôles, écarts, risques, tâches et rapports."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Stepper */}
          <div
            className="space-y-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {TOUR_STEPS.map((s, i) => {
              const active = i === step;
              return (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#C560CC] bg-white shadow-[0_8px_30px_-12px_rgba(197,96,204,0.4)]"
                      : "border-transparent hover:border-[#E9DDEA] hover:bg-white/60"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${
                    active ? "bg-[#C560CC] text-white" : "bg-[#F4F1F6] text-[#6F6478]"
                  }`}>{i + 1}</span>
                  <span className={`text-sm font-medium ${active ? "text-[#1F1630]" : "text-[#6F6478]"}`}>{s.label}</span>
                  {active && (
                    <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-[#C560CC]" />
                  )}
                </button>
              );
            })}
            <Link to={current.route} className="mt-3 inline-flex items-center gap-1 px-4 text-xs text-[#943A9B] hover:underline">
              Ouvrir cette page dans le tableau de bord <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Animated browser */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(197,96,204,0.18),transparent)]" />
            <BrowserMockup url={`averonix.app${current.route === "/" ? "" : current.route}`}>
              <div key={current.key} className="animate-fade-in">
                {current.key === "overview" && <DashboardOverviewPreview compact />}
                {current.key === "controls" && <ControlsPreview />}
                {current.key === "gaps" && <GapsPreview />}
                {current.key === "risks" && <RisksPreview />}
                {current.key === "tasks" && <TasksPreview />}
                {current.key === "reports" && <ReportsPreview />}
              </div>
              <CursorHint step={step} />
            </BrowserMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

function CursorHint({ step }: { step: number }) {
  const positions = [
    { top: "22%", left: "28%" },
    { top: "44%", left: "55%" },
    { top: "38%", left: "40%" },
    { top: "50%", left: "62%" },
    { top: "46%", left: "35%" },
    { top: "30%", left: "58%" },
  ];
  const p = positions[step];
  return (
    <div
      className="pointer-events-none absolute z-20 transition-all duration-700 ease-out"
      style={{ top: p.top, left: p.left }}
    >
      <div className="relative">
        <span className="absolute -inset-2 animate-ping rounded-full bg-[#C560CC]/30" />
        <MousePointer2 className="relative h-5 w-5 fill-[#C560CC] text-white drop-shadow" />
      </div>
    </div>
  );
}

/* ---------------- FEATURES ---------------- */
const FEATURES = [
  { icon: ClipboardList, title: "Évaluation ISO 27001 structurée", desc: "Répondez par domaine, suivez la progression et générez les éléments de suivi." },
  { icon: ShieldCheck,   title: "Contrôles et preuves", desc: "Visualisez les contrôles, les preuves attendues et les éléments à compléter." },
  { icon: AlertTriangle, title: "Écarts intelligemment regroupés", desc: "Averonix regroupe les faiblesses similaires en écarts exploitables au lieu d'une alerte par question." },
  { icon: Shield,        title: "Risques et priorisation", desc: "Identifiez les risques critiques et priorisez les traitements adaptés." },
  { icon: ListChecks,    title: "Tâches de remédiation", desc: "Transformez les écarts en actions concrètes avec responsables, échéances et checklists." },
  { icon: FileText,      title: "Rapports professionnels", desc: "Générez des rapports de préparation lisibles, exportables et adaptés aux décideurs." },
  { icon: Bot,           title: "Assistant IA", desc: "Obtenez des explications en français sur les écarts, risques, tâches et rapports." },
  { icon: Building2,     title: "Fournisseurs et revues", desc: "Évaluez vos fournisseurs avec des questionnaires courts et des scores de risque." },
];

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Fonctionnalités"
        title="Tout ce dont une équipe a besoin pour préparer ISO 27001"
        subtitle="Une plateforme unifiée, pensée pour les responsables sécurité et conformité."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Card key={f.title} className="group h-full border-[#E9DDEA] transition hover:-translate-y-0.5 hover:border-[#C560CC] hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F6E5F8] to-white text-[#943A9B] ring-1 ring-[#E9DDEA]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold leading-snug">{f.title}</h3>
              <p className="mt-2 text-sm text-[#6F6478]">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- DASHBOARD GRID ---------------- */
function DashboardGrid() {
  return (
    <section id="tableau" className="border-y border-[#E9DDEA]/60 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          eyebrow="Tableau de bord"
          title="Le pilotage de la conformité, vue par vue"
          subtitle="Vues réelles du produit, alimentées par votre évaluation."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PreviewCard title="Vue d'ensemble" to="/" desc="Préparation globale, écarts ouverts et tendance."><DashboardOverviewPreview compact /></PreviewCard>
          <PreviewCard title="Écarts de preuves" to="/gaps" desc="Faiblesses regroupées et statut de remédiation."><GapsPreview /></PreviewCard>
          <PreviewCard title="Registre des risques" to="/risks" desc="Sévérité, propriétaire et plan de traitement."><RisksPreview /></PreviewCard>
          <PreviewCard title="Tâches de remédiation" to="/tasks" desc="Actions assignées avec progression."><TasksPreview /></PreviewCard>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ title, desc, to, children }: { title: string; desc: string; to: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden border-[#E9DDEA]">
      <div className="flex items-start justify-between p-5">
        <div>
          <div className="font-semibold">{title}</div>
          <p className="mt-0.5 text-sm text-[#6F6478]">{desc}</p>
        </div>
        <Link to={to} className="inline-flex items-center gap-1 text-xs text-[#943A9B] hover:underline">Ouvrir <ArrowUpRight className="h-3 w-3" /></Link>
      </div>
      <div className="border-t border-[#E9DDEA] bg-[#FCFBFE] p-4">
        <div className="overflow-hidden rounded-lg border border-[#E9DDEA] bg-white">
          {children}
        </div>
      </div>
    </Card>
  );
}

/* ---------------- AI ---------------- */
function AISection() {
  const items = [
    "Expliquer un écart en langage clair",
    "Expliquer un risque et son impact",
    "Générer une checklist de remédiation",
    "Générer une synthèse de rapport",
  ];
  return (
    <section id="ia" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Assistant IA"
            title="Une IA utile, pas décorative"
            subtitle="L'IA ne remplace pas l'évaluation. Elle explique, recommande et aide à prioriser."
          />
          <ul className="mt-8 space-y-3">
            {items.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#C560CC]" />
                <span className="text-[15px] text-[#1F1630]">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="border-[#E9DDEA]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-xs text-[#6F6478]">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#C560CC] to-[#943A9B] text-white"><Bot className="h-3.5 w-3.5" /></div>
              Assistant Averonix
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg bg-[#F4F1F6] p-3"><strong>Vous —</strong> Pourquoi cet écart est-il critique ?</div>
              <div className="rounded-lg border border-[#E9DDEA] bg-white p-3">
                <strong className="text-[#943A9B]">Averonix —</strong> Cet écart concerne la gestion des accès privilégiés (A.5.15). Sans preuve de revue trimestrielle, le risque de persistance d'accès obsolètes augmente. Je recommande une tâche de revue avec responsable défini et échéance à 14 jours.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ---------------- REPORTS ---------------- */
function ReportSection() {
  return (
    <section id="rapports" className="border-y border-[#E9DDEA]/60 bg-gradient-to-b from-[#FAF2FB]/40 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          eyebrow="Rapports"
          title="Des rapports prêts pour la décision"
          subtitle="Une lecture immédiate pour les responsables sécurité, conformité et direction."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Synthèse exécutive",
            "Indicateurs clés",
            "Scores par domaine",
            "Écarts prioritaires",
            "Risques prioritaires",
            "Plan d'action sur 30 jours",
          ].map((s) => (
            <Card key={s} className="border-[#E9DDEA]">
              <CardContent className="flex items-start gap-3 p-5">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-[#FAF2FB] text-[#943A9B]"><FileText className="h-4 w-4" /></div>
                <div>
                  <div className="font-medium">{s}</div>
                  <p className="mt-1 text-sm text-[#6F6478]">Section générée automatiquement à partir de votre évaluation.</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/reports"><Button variant="outline" className="border-[#E9DDEA]">Voir les rapports <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- VENDORS ---------------- */
function VendorSection() {
  return (
    <section id="fournisseurs" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Card className="order-2 border-[#E9DDEA] lg:order-1">
          <CardContent className="p-6">
            <div className="text-xs uppercase tracking-wider text-[#6F6478]">Revue fournisseur</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-semibold">CloudOps Provider</div>
              <StatusBadge variant="warning">Risque moyen</StatusBadge>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {[
                ["Sécurité applicative", 78],
                ["Gestion des accès", 64],
                ["Continuité d'activité", 52],
                ["Protection des données", 81],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs"><span className="text-[#6F6478]">{l}</span><span className="font-medium tabular-nums">{v}%</span></div>
                  <ProgressBar value={v as number} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Fournisseurs"
            title="Évaluez la posture de vos fournisseurs"
            subtitle="Des questionnaires courts, un score clair, et une revue intégrée à votre cycle de conformité."
          />
          <ul className="mt-6 space-y-2 text-[15px] text-[#1F1630]">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C560CC]" /> Questionnaires standardisés</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C560CC]" /> Score de risque automatique</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#C560CC]" /> Revues périodiques planifiées</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST ---------------- */
function TrustSection() {
  const items = [
    { icon: Lock, t: "Clés IA côté serveur", d: "Aucune clé exposée au navigateur." },
    { icon: ShieldCheck, t: "Aucune preuve inventée", d: "Les preuves restent celles que vous fournissez." },
    { icon: FileCheck, t: "Données structurées", d: "Modèle de données pensé pour ISO 27001:2022." },
    { icon: ClipboardList, t: "Journalisation prévue", d: "Traçabilité des actions et des évaluations." },
    { icon: Shield, t: "Préparation à l'audit", d: "Vues prêtes pour les responsables d'audit." },
    { icon: AlertTriangle, t: "Pas de revendication de certification", d: "Averonix prépare, ne certifie pas." },
  ];
  return (
    <section id="securite" className="border-y border-[#E9DDEA]/60 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          eyebrow="Sécurité & traçabilité"
          title="Pensé pour la sécurité et la traçabilité"
          subtitle="Une approche transparente, sans promesses excessives."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Card key={i.t} className="border-[#E9DDEA]">
              <CardContent className="flex items-start gap-3 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF2FB] text-[#943A9B]"><i.icon className="h-4 w-4" /></div>
                <div>
                  <div className="font-semibold">{i.t}</div>
                  <p className="mt-1 text-sm text-[#6F6478]">{i.d}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- USE CASES ---------------- */
function UseCases() {
  const cases = [
    { t: "PME préparant ISO 27001", d: "Structurez votre démarche, du diagnostic au rapport." },
    { t: "Équipe sécurité", d: "Suivez les preuves et la remédiation en un seul endroit." },
    { t: "Consultant en conformité", d: "Produisez un plan d'action clair pour vos clients." },
    { t: "Responsable conformité", d: "Obtenez un rapport lisible pour la direction." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Cas d'usage" title="Pour qui est Averonix" />
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cases.map((c) => (
          <Card key={c.t} className="border-[#E9DDEA] transition hover:-translate-y-0.5 hover:border-[#C560CC] hover:shadow-md">
            <CardContent className="p-6">
              <div className="font-semibold">{c.t}</div>
              <p className="mt-2 text-sm text-[#6F6478]">{c.d}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F1630] via-[#2A1A3F] to-[#943A9B] p-12 text-white shadow-[0_30px_80px_-30px_rgba(148,58,155,0.5)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#C560CC]/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Prêt à structurer votre préparation à la conformité ?</h2>
          <p className="mt-3 text-white/70">Démarrez avec une évaluation ISO 27001 guidée et obtenez votre premier plan d'action en quelques minutes.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/"><Button size="lg" className="bg-white text-[#1F1630] hover:bg-white/90">Explorer le tableau de bord</Button></Link>
            <Link to="/assessments/iso-27001">
              <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                Démarrer une évaluation ISO 27001 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E9DDEA] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-[#6F6478]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#C560CC] to-[#943A9B] text-white"><Shield className="h-3.5 w-3.5" /></div>
          <span className="font-semibold text-[#1F1630]">Averonix</span>
          <span className="ml-2">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link to="/" className="hover:text-[#C560CC]">Tableau de bord</Link>
          <Link to="/assessments/iso-27001" className="hover:text-[#C560CC]">Évaluation</Link>
          <Link to="/reports" className="hover:text-[#C560CC]">Rapports</Link>
          <Link to="/gaps" className="hover:text-[#C560CC]">Écarts</Link>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- SHARED PIECES ---------------- */
function SectionHeading({ eyebrow, title, subtitle, align = "center" }: { eyebrow?: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  const cls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`${cls} max-w-2xl`}>
      {eyebrow && <div className="text-xs font-semibold uppercase tracking-wider text-[#C560CC]">{eyebrow}</div>}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-[#6F6478]">{subtitle}</p>}
    </div>
  );
}

function BrowserMockup({ url = "averonix.app", children }: { url?: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E9DDEA] bg-white shadow-[0_30px_80px_-30px_rgba(31,22,48,0.25)]">
      <div className="flex items-center gap-2 border-b border-[#E9DDEA] bg-[#FCFBFE] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="mx-auto rounded-md bg-white px-3 py-1 text-xs text-[#6F6478] ring-1 ring-[#E9DDEA]">{url}</div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------------- REAL-DATA PREVIEWS ---------------- */
function DashboardOverviewPreview({ compact = false }: { compact?: boolean }) {
  const fw = frameworks[0];
  return (
    <div className={`bg-[#FCFBFE] ${compact ? "p-5" : "p-6"}`}>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#6F6478]">Vue d'ensemble</div>
          <div className="text-lg font-semibold">Préparation à la conformité</div>
        </div>
        <span className="rounded-md bg-[#F6E5F8] px-2 py-1 text-xs text-[#943A9B]">{fw.shortName}</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <MiniStat icon={Shield} label="Préparation" value={`${fw.readiness}%`} accent />
        <MiniStat icon={AlertTriangle} label="Écarts ouverts" value={gaps.length} />
        <MiniStat icon={FileCheck} label="Contrôles OK" value={fw.completed} />
        <Card className="border-[#E9DDEA]"><CardContent className="p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#6F6478]">Tendance</div>
          <div className="text-lg font-semibold text-[#C560CC]">+6%</div>
          <Sparkline data={[42, 45, 48, 50, 52, 55, fw.readiness]} />
        </CardContent></Card>
      </div>
      <Card className="mt-3 border-[#E9DDEA]"><CardContent className="p-4">
        <div className="flex items-center justify-between text-sm"><span className="font-medium">{fw.name}</span><span className="tabular-nums text-[#6F6478]">{fw.completed}/{fw.total}</span></div>
        <div className="mt-2"><ProgressBar value={fw.readiness} /></div>
      </CardContent></Card>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, accent }: any) {
  return (
    <Card className="border-[#E9DDEA]"><CardContent className="p-3">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#6F6478]"><Icon className="h-3 w-3" />{label}</div>
      <div className={`mt-1 text-xl font-semibold tabular-nums ${accent ? "text-[#C560CC]" : ""}`}>{value}</div>
    </CardContent></Card>
  );
}

function ControlsPreview() {
  const rows = controls.slice(0, 5);
  return (
    <div className="p-5">
      <div className="mb-3 text-sm font-semibold">Contrôles</div>
      <div className="divide-y divide-[#E9DDEA] rounded-lg border border-[#E9DDEA] bg-white text-sm">
        {rows.map((c, i) => (
          <div key={c.id} className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-2.5 ${i === 1 ? "bg-[#FAF2FB]" : ""}`}>
            <div className="truncate">
              <div className="truncate font-medium">{c.name}</div>
              <div className="text-xs text-[#6F6478]">{c.frameworks?.[0]?.toUpperCase()}</div>
            </div>
            <StatusBadge variant={severityVariant(c.risk)}>{c.risk}</StatusBadge>
            <span className="text-xs text-[#6F6478]">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GapsPreview() {
  const lanes = useMemo(() => ([
    { k: "Critique", v: evidenceGaps.critical, c: "bg-[#FEE2E2] text-[#991B1B]" },
    { k: "Élevé", v: evidenceGaps.high, c: "bg-[#FEF3C7] text-[#92400E]" },
    { k: "Moyen", v: evidenceGaps.medium, c: "bg-[#DBEAFE] text-[#1E40AF]" },
    { k: "Faible", v: evidenceGaps.low, c: "bg-[#DCFCE7] text-[#166534]" },
  ]), []);
  const samples = gaps.slice(0, 3);
  return (
    <div className="p-5">
      <div className="mb-3 text-sm font-semibold">Écarts de preuves</div>
      <div className="grid grid-cols-4 gap-2">
        {lanes.map((l) => (
          <div key={l.k} className={`rounded-md px-3 py-2 ${l.c}`}>
            <div className="text-[10px] uppercase tracking-wider opacity-80">{l.k}</div>
            <div className="text-lg font-semibold tabular-nums">{l.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {samples.map((g) => (
          <div key={g.id} className="rounded-md border border-[#E9DDEA] bg-white p-3 text-sm">
            <div className="flex items-center justify-between"><span className="truncate font-medium">{g.title}</span><StatusBadge variant={severityVariant(g.severity)}>{g.severity}</StatusBadge></div>
            <div className="mt-1.5"><ProgressBar value={g.progress} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RisksPreview() {
  const rows = risks.slice(0, 5);
  return (
    <div className="p-5">
      <div className="mb-3 text-sm font-semibold">Registre des risques</div>
      <div className="overflow-hidden rounded-lg border border-[#E9DDEA] bg-white text-sm">
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[#E9DDEA] bg-[#FCFBFE] px-3 py-2 text-[10px] uppercase tracking-wider text-[#6F6478]">
          <span>Risque</span><span>Sévérité</span><span>Score</span>
        </div>
        {rows.map((r, i) => (
          <div key={r.id} className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[#E9DDEA] px-3 py-2 last:border-0 ${i === 0 ? "bg-[#FAF2FB]" : ""}`}>
            <span className="truncate font-medium">{r.title}</span>
            <StatusBadge variant={severityVariant(r.severity)}>{r.severity}</StatusBadge>
            <span className="tabular-nums text-[#943A9B]">{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksPreview() {
  const rows = tasks.slice(0, 4);
  return (
    <div className="p-5">
      <div className="mb-3 text-sm font-semibold">Tâches de remédiation</div>
      <div className="space-y-2">
        {rows.map((t, i) => (
          <div key={t.id} className={`rounded-md border border-[#E9DDEA] bg-white p-3 ${i === 1 ? "ring-1 ring-[#C560CC]" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{t.title}</div>
                <div className="text-xs text-[#6F6478]">Responsable : {t.owner} · Échéance : {t.dueDate}</div>
              </div>
              <StatusBadge variant={severityVariant(t.priority)}>{t.priority}</StatusBadge>
            </div>
            <div className="mt-2"><ProgressBar value={t.progress} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsPreview() {
  const r = reports[0];
  return (
    <div className="p-5">
      <div className="mb-3 text-sm font-semibold">Rapports</div>
      <Card className="border-[#E9DDEA]"><CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-[#6F6478]">Généré : {r.generated} · {r.owner}</div>
          </div>
          <StatusBadge variant="success">Prêt</StatusBadge>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {r.sections.slice(0, 6).map((s) => (
            <div key={s} className="rounded-md border border-[#E9DDEA] bg-[#FCFBFE] px-3 py-2 text-[#1F1630]">{s}</div>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
}
