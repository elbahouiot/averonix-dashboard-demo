import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { gaps, frameworks } from "@/mocks/data";
import { Plus, Download, Filter, AlertOctagon, FileX, Ban, CheckCircle2, FileText, FileCheck2, FileSearch, FileWarning } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gaps/")({
  head: () => ({ meta: [{ title: "Gaps · Averonix" }] }),
  component: GapsPage,
});

interface EvidenceItem { id: string; label: string; framework: string; gapId: string; lane: "Missing" | "Requested" | "Collected" | "Verified"; }
const evidenceBoard: EvidenceItem[] = [
  { id: "e1", label: "MFA enrollment screenshot", framework: "ISO 27001", gapId: "G-001", lane: "Missing" },
  { id: "e2", label: "Identity provider config export", framework: "ISO 27001", gapId: "G-001", lane: "Missing" },
  { id: "e3", label: "Retention schedule document", framework: "ISO 27001", gapId: "G-005", lane: "Missing" },
  { id: "e4", label: "AWS SOC 2 Type II", framework: "NIST CSF", gapId: "G-002", lane: "Requested" },
  { id: "e5", label: "Service review notes", framework: "NIST CSF", gapId: "G-002", lane: "Requested" },
  { id: "e6", label: "Restore test log", framework: "NIST CSF", gapId: "G-006", lane: "Requested" },
  { id: "e7", label: "Reviewer attestations", framework: "NIST CSF", gapId: "G-004", lane: "Collected" },
  { id: "e8", label: "Signed IR plan", framework: "ISO 27001", gapId: "G-003", lane: "Collected" },
  { id: "e9", label: "Inventory export", framework: "NIST CSF", gapId: "G-007", lane: "Verified" },
  { id: "e10", label: "Encryption-in-transit audit", framework: "SOC 2", gapId: "G-007", lane: "Verified" },
];

const lanes: { key: EvidenceItem["lane"]; icon: any; tint: string }[] = [
  { key: "Missing", icon: FileX, tint: "text-[#B91C1C] bg-[#FEE2E2]" },
  { key: "Requested", icon: FileSearch, tint: "text-[#B45309] bg-[#FEF3C7]" },
  { key: "Collected", icon: FileText, tint: "text-[#1D4ED8] bg-[#DBEAFE]" },
  { key: "Verified", icon: FileCheck2, tint: "text-[#15803D] bg-[#DCFCE7]" },
];

function GapsPage() {
  const [selectedId, setSelectedId] = useState("G-001");
  const selected = gaps.find((g) => g.id === selectedId) ?? gaps[0];

  // remediation by framework: avg progress
  const byFramework = frameworks.map((f) => {
    const list = gaps.filter((g) => g.framework.toLowerCase().includes(f.shortName.toLowerCase().split(" ")[0]));
    const avg = list.length ? Math.round(list.reduce((s, g) => s + g.progress, 0) / list.length) : 0;
    return { name: f.shortName, count: list.length, progress: avg };
  }).filter((f) => f.count > 0).slice(0, 6);

  return (
    <>
      <PageHeader title="Gaps" subtitle="Track missing evidence, incomplete requirements, and remediation progress."
        actions={<>
          <Button variant="outline"><Filter className="h-4 w-4" />Filters</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Create gap</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open gaps" value="96" icon={AlertOctagon} />
          <StatCard label="Missing evidence" value="38" icon={FileWarning} />
          <StatCard label="Blocked gaps" value="12" icon={Ban} />
          <StatCard label="Closed this quarter" value="22" icon={CheckCircle2} accent />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_320px] gap-5">
          {/* Left: gap inbox */}
          <Card className="border-border h-fit">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Gap inbox</CardTitle></CardHeader>
            <CardContent className="p-0 max-h-[640px] overflow-y-auto">
              <ul>
                {gaps.map((g) => (
                  <li key={g.id}>
                    <button onClick={() => setSelectedId(g.id)}
                      className={cn("w-full text-left px-4 py-3 border-t border-border first:border-0 hover:bg-[var(--primary-ultra-soft)] block",
                        selectedId === g.id && "bg-[var(--primary-ultra-soft)] border-l-2 border-l-[var(--primary)]")}>
                      <div className="flex items-start gap-2">
                        <StatusBadge variant={severityVariant(g.severity)}>{g.severity}</StatusBadge>
                        <span className="text-sm font-medium leading-snug flex-1">{g.title}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{g.framework}</span>·<span>{g.owner}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar value={g.progress} className="h-1.5" />
                        <span className="text-[10px] tabular-nums w-7 text-right text-muted-foreground">{g.progress}%</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Center: evidence board */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Evidence requirements board</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Track evidence from missing to verified across all active gaps.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {lanes.map((lane) => {
                  const items = evidenceBoard.filter((e) => e.lane === lane.key);
                  const Icon = lane.icon;
                  return (
                    <div key={lane.key} className="rounded-lg bg-[var(--primary-ultra-soft)]/50 border border-border p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                          <span className={cn("h-6 w-6 rounded-md flex items-center justify-center", lane.tint)}><Icon className="h-3.5 w-3.5" /></span>
                          {lane.key}
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{items.length}</span>
                      </div>
                      <div className="space-y-2 flex-1">
                        {items.map((e) => (
                          <Link key={e.id} to="/gaps/$id" params={{ id: e.gapId }}
                            className="block rounded-md bg-card border border-border p-2.5 hover:border-[var(--primary)] transition">
                            <div className="text-xs font-medium leading-snug">{e.label}</div>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>{e.framework}</span><span className="font-mono">{e.gapId}</span>
                            </div>
                          </Link>
                        ))}
                        {items.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-4">No items</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right: selected gap card */}
          <Card className="border-border h-fit sticky top-4">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Selected gap</CardTitle></CardHeader>
            <CardContent>
              <h3 className="font-semibold leading-snug">{selected.title}</h3>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge variant={severityVariant(selected.severity)}>{selected.severity}</StatusBadge>
                <StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <Field label="Linked control" value={selected.linkedControl} />
                <Field label="Framework" value={selected.framework} />
                <Field label="Owner" value={selected.owner} />
                <Field label="Due" value={selected.dueDate} />
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Gap reason</div>
                <p className="text-sm mt-1">{selected.reason}</p>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Required evidence</div>
                <ul className="mt-1 space-y-1">
                  {selected.requiredEvidence.map((e) => (
                    <li key={e} className="text-xs flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />{e}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Next action</div>
                <p className="text-sm mt-1">{selected.remediationSteps[0]}</p>
              </div>
              <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Link to="/gaps/$id" params={{ id: selected.id }}>View gap details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Remediation by framework */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm">Remediation progress by framework</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {byFramework.map((f) => (
                <div key={f.name}>
                  <div className="flex justify-between text-xs mb-1.5"><span className="font-medium">{f.name}</span><span className="text-muted-foreground tabular-nums">{f.progress}% · {f.count} gaps</span></div>
                  <ProgressBar value={f.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between gap-3"><span className="text-xs text-muted-foreground">{label}</span><span className="text-right text-sm">{value}</span></div>;
}
