import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { OpsFiltersBar, ChartsRow } from "@/components/averonix/OpsBits";
import { gaps } from "@/mocks/data";
import { Plus, Download, Filter, AlertOctagon, Flame, Wrench, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/gaps/")({
  head: () => ({ meta: [{ title: "Gaps · Averonix" }] }),
  component: GapsPage,
});

function GapsPage() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("G-001");
  const filtered = gaps.filter((g) => g.title.toLowerCase().includes(q.toLowerCase()));
  const selected = gaps.find((g) => g.id === selectedId) ?? gaps[0];

  return (
    <>
      <PageHeader title="Gaps" subtitle="Track compliance gaps, missing evidence, and remediation progress."
        actions={<>
          <Button variant="outline"><Filter className="h-4 w-4" />Filters</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Create gap</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open gaps" value="96" icon={AlertOctagon} />
          <StatCard label="Critical gaps" value="14" icon={Flame} />
          <StatCard label="In remediation" value="41" icon={Wrench} />
          <StatCard label="Closed this quarter" value="22" icon={CheckCircle2} accent />
        </div>

        <ChartsRow
          donut={[
            { name: "Critical", value: 14, color: "#DC2626" },
            { name: "High", value: 28, color: "#D97706" },
            { name: "Medium", value: 36, color: "#2563EB" },
            { name: "Low", value: 18, color: "#16A34A" },
          ]}
          trendLabel="Remediation trend"
          trendData={[{ x: "Dec", v: 110 }, { x: "Jan", v: 108 }, { x: "Feb", v: 104 }, { x: "Mar", v: 100 }, { x: "Apr", v: 98 }, { x: "May", v: 96 }]}
        />

        <OpsFiltersBar q={q} setQ={setQ} placeholder="Search gaps" chips={["Severity", "Status", "Framework", "Owner", "Due date", "Sort: highest impact"]} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Gap</Th><Th>Framework</Th><Th>Severity</Th><Th>Progress</Th><Th>Status</Th><Th>Owner</Th><Th>Linked control</Th><Th>Due</Th></tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} onClick={() => setSelectedId(g.id)} className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === g.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3 font-medium"><Link to="/gaps/$id" params={{ id: g.id }} className="hover:text-[var(--primary)]" onClick={(e) => e.stopPropagation()}>{g.title}</Link></td>
                    <td className="px-3 py-3 text-xs">{g.framework}</td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(g.severity)}>{g.severity}</StatusBadge></td>
                    <td className="px-3 py-3 min-w-[120px]"><div className="flex items-center gap-2"><ProgressBar value={g.progress} /><span className="text-xs tabular-nums w-8 text-right">{g.progress}%</span></div></td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(g.status)}>{g.status}</StatusBadge></td>
                    <td className="px-3 py-3 text-muted-foreground">{g.owner}</td>
                    <td className="px-3 py-3 text-xs">{g.linkedControl}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{g.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="border-border h-fit sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold">{selected.title}</h3>
              <div className="mt-2 flex items-center gap-2"><StatusBadge variant={severityVariant(selected.severity)}>{selected.severity}</StatusBadge><span className="text-sm text-muted-foreground">{selected.progress}% remediated</span></div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Status" value={<StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>} />
                <Row label="Owner" value={selected.owner} />
                <Row label="Framework" value={selected.framework} />
                <Row label="Linked control" value={selected.linkedControl} />
                <Row label="Due date" value={selected.dueDate} />
                <Row label="Updated" value={selected.updated} />
              </dl>
              <div className="mt-4 pt-4 border-t border-border"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Gap reason</div><p className="text-sm">{selected.reason}</p></div>
              <div className="mt-3"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Next action</div><p className="text-sm">{selected.remediationSteps[0]}</p></div>
              <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Link to="/gaps/$id" params={{ id: selected.id }}>View gap details</Link>
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
