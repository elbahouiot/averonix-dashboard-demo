import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { OpsFiltersBar, ChartsRow } from "@/components/averonix/OpsBits";
import { risks } from "@/mocks/data";
import { Plus, Download, Filter, AlertTriangle, Flame, Activity, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/risks/")({
  head: () => ({ meta: [{ title: "Risks · Averonix" }] }),
  component: RisksPage,
});

function RisksPage() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("R-001");
  const filtered = risks.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  const selected = risks.find((r) => r.id === selectedId) ?? risks[0];

  return (
    <>
      <PageHeader title="Risks" subtitle="Track risk exposure, ownership, and remediation progress."
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
          <StatCard label="Mitigated this quarter" value="26" icon={ShieldCheck} accent />
        </div>

        <ChartsRow
          donut={[
            { name: "Critical", value: 18, color: "#DC2626" },
            { name: "High", value: 34, color: "#D97706" },
            { name: "Medium", value: 56, color: "#2563EB" },
            { name: "Low", value: 40, color: "#16A34A" },
          ]}
          trendLabel="Risk trend (last 6 months)"
          trendData={[{ x: "Dec", v: 162 }, { x: "Jan", v: 158 }, { x: "Feb", v: 154 }, { x: "Mar", v: 152 }, { x: "Apr", v: 150 }, { x: "May", v: 148 }]}
        />

        <OpsFiltersBar q={q} setQ={setQ} placeholder="Search risks" chips={["Severity", "Status", "Category", "Owner", "Review due", "Sort: newest"]} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Risk</Th><Th>Category</Th><Th>Severity</Th><Th>Score</Th><Th>Status</Th><Th>Owner</Th><Th>Linked control</Th><Th>Next</Th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setSelectedId(r.id)} className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === r.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3 font-medium"><Link to="/risks/$id" params={{ id: r.id }} className="hover:text-[var(--primary)]" onClick={(e) => e.stopPropagation()}>{r.title}</Link></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{r.category}</td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(r.severity)}>{r.severity}</StatusBadge></td>
                    <td className="px-3 py-3 font-semibold tabular-nums">{r.score}</td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge></td>
                    <td className="px-3 py-3 text-muted-foreground">{r.owner}</td>
                    <td className="px-3 py-3 text-xs">{r.linkedControl}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.nextReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="border-border h-fit sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold">{selected.title}</h3>
              <div className="mt-2 flex items-center gap-2"><StatusBadge variant={severityVariant(selected.severity)}>{selected.severity}</StatusBadge><span className="font-semibold tabular-nums">{selected.score}</span></div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Status" value={<StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>} />
                <Row label="Owner" value={selected.owner} />
                <Row label="Linked control" value={selected.linkedControl} />
                <Row label="Frameworks" value={selected.frameworks.join(", ").toUpperCase()} />
                <Row label="Due date" value={selected.dueDate} />
                <Row label="Review date" value={selected.nextReview} />
              </dl>
              <div className="mt-4 pt-4 border-t border-border"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Risk reason</div><p className="text-sm">{selected.reason}</p></div>
              <div className="mt-3"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Next action</div><p className="text-sm">{selected.treatment}</p></div>
              <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Link to="/risks/$id" params={{ id: selected.id }}>View risk details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
function Th({ children }: any) { return <th className="px-3 py-2.5 text-left font-medium">{children}</th>; }
function Row({ label, value }: any) { return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground text-xs">{label}</dt><dd className="text-right text-sm">{value}</dd></div>; }
