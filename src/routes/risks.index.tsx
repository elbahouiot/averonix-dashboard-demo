import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { risks } from "@/mocks/data";
import { riskMatrix, riskDrivers } from "@/mocks/extras";
import { Plus, Download, Filter, AlertTriangle, Flame, Activity, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risks/")({
  head: () => ({ meta: [{ title: "Risks · Averonix" }] }),
  component: RisksPage,
});

const impactLabels = ["Insignificant", "Minor", "Moderate", "Major", "Severe"];
const likelihoodLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost certain"];

function cellColor(impactIdx: number, likelihoodIdx: number) {
  const score = (impactIdx + 1) * (likelihoodIdx + 1);
  if (score >= 16) return "bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#FECACA]";
  if (score >= 10) return "bg-[#FFEDD5] text-[#B45309] hover:bg-[#FED7AA]";
  if (score >= 5) return "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A]";
  return "bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0]";
}

function RisksPage() {
  const [hover, setHover] = useState<{ i: number; l: number } | null>(null);

  return (
    <>
      <PageHeader title="Risks" subtitle="Analyze risk exposure, impact, likelihood, and treatment status."
        actions={<>
          <Button variant="outline"><Filter className="h-4 w-4" />Filters</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Create risk</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total risks" value="148" icon={AlertTriangle} />
          <StatCard label="Critical" value="18" icon={Flame} />
          <StatCard label="In treatment" value="62" icon={Activity} />
          <StatCard label="Accepted risks" value="12" icon={ShieldCheck} accent />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Risk matrix */}
          <Card className="border-border xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Risk matrix</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Impact × Likelihood. Cells show the number of risks in that quadrant.</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#DCFCE7]" />Low</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#FEF3C7]" />Med</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#FFEDD5]" />High</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#FEE2E2]" />Critical</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {/* Y-axis label */}
                <div className="flex items-center">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground -rotate-90 whitespace-nowrap">Impact →</div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-1.5">
                    {/* header row */}
                    <div />
                    {likelihoodLabels.map((l) => (
                      <div key={l} className="text-[10px] text-center text-muted-foreground uppercase tracking-wide truncate">{l}</div>
                    ))}
                    {/* rows from severe→insignificant (top→bottom) */}
                    {[4, 3, 2, 1, 0].map((i) => (
                      <>
                        <div key={`lbl-${i}`} className="text-[10px] text-right text-muted-foreground uppercase tracking-wide self-center pr-1">{impactLabels[i]}</div>
                        {[0, 1, 2, 3, 4].map((l) => {
                          const v = riskMatrix[i][l];
                          const active = hover && hover.i === i && hover.l === l;
                          return (
                            <button key={`${i}-${l}`}
                              onMouseEnter={() => setHover({ i, l })}
                              onMouseLeave={() => setHover(null)}
                              className={cn("aspect-square rounded-md flex items-center justify-center text-lg font-semibold transition-all", cellColor(i, l), active && "ring-2 ring-[var(--primary)] scale-[1.03]")}>
                              {v}
                            </button>
                          );
                        })}
                      </>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground text-center">Likelihood →</div>
                </div>
              </div>
              {hover && (
                <div className="mt-4 rounded-md border border-border bg-[var(--primary-ultra-soft)] px-3 py-2 text-xs">
                  <span className="font-semibold">{riskMatrix[hover.i][hover.l]} risks</span> · {impactLabels[hover.i]} impact · {likelihoodLabels[hover.l]} likelihood
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top drivers */}
          <Card className="border-border">
            <CardHeader><CardTitle className="text-sm">Top risk drivers</CardTitle></CardHeader>
            <CardContent className="space-y-2.5">
              {riskDrivers.map((d) => (
                <div key={d.label} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusBadge variant={severityVariant(d.level)}>{d.level}</StatusBadge>
                    <span className="text-sm truncate">{d.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{d.count}</span>
                </div>
              ))}
              <div className="pt-2 text-[11px] text-muted-foreground">Top categories contributing the most exposure across your register.</div>
            </CardContent>
          </Card>
        </div>

        {/* Register */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm">Risk register</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Risk</Th><Th>Category</Th><Th>Impact</Th><Th>Likelihood</Th><Th>Score</Th><Th>Treatment</Th><Th>Owner</Th><Th>Due</Th></tr>
              </thead>
              <tbody>
                {risks.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-[var(--primary-ultra-soft)]">
                    <td className="px-4 py-3 font-medium">
                      <Link to="/risks/$id" params={{ id: r.id }} className="hover:text-[var(--primary)]">{r.title}</Link>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{r.id}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.category}</td>
                    <td className="px-4 py-3"><StatusBadge variant={severityVariant(r.severity)}>{r.severity}</StatusBadge></td>
                    <td className="px-4 py-3 text-xs">{r.likelihood}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{r.score}</td>
                    <td className="px-4 py-3"><StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{r.owner}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-2.5 text-left font-medium">{children}</th>; }
