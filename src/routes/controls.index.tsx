import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { Donut } from "@/components/averonix/Charts";
import { controls, frameworks } from "@/mocks/data";
import { Plus, Search, MoreHorizontal, ChevronRight, X } from "lucide-react";

export const Route = createFileRoute("/controls/")({
  head: () => ({ meta: [{ title: "Controls · Averonix" }, { name: "description", content: "Manage security controls and implementation status." }] }),
  component: ControlsPage,
});

function ControlsPage() {
  const [selectedId, setSelectedId] = useState<string | null>("CT-001");
  const [q, setQ] = useState("");
  const filtered = controls.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()));
  const selected = controls.find((c) => c.id === selectedId);

  return (
    <>
      <PageHeader title="Controls" subtitle="Track implementation, ownership, and evidence across every control"
        actions={<>
          <Button variant="outline"><MoreHorizontal className="h-4 w-4" />More</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Add control</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-sm">Assignment</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-6">
              <Donut size={140} centerValue="62%" centerLabel="assigned" data={[
                { name: "Assigned", value: 79, color: "#C560CC" },
                { name: "Unassigned", value: 38, color: "#E9DDEA" },
                { name: "Needs reassignment", value: 8, color: "#D97706" },
              ]}/>
              <ul className="text-sm space-y-2">
                <Legend color="#C560CC" label="Assigned" value="79" />
                <Legend color="#E9DDEA" label="Unassigned" value="38" />
                <Legend color="#D97706" label="Needs reassignment" value="8" />
                <li className="text-xs text-muted-foreground pt-2 border-t border-border">Total controls: 125</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardTitle className="text-sm">Completion</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">48% <span className="text-sm font-normal text-muted-foreground">controls OK</span></div>
              <div className="text-xs text-muted-foreground mt-1">60 completed / 125 total</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MiniBar label="Tests" value={62} />
                <MiniBar label="Evidence" value={58} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3 border border-border rounded-lg bg-card">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search controls" className="pl-9 h-9 border-transparent bg-muted" />
          </div>
          <FilterChip label="Framework" /><FilterChip label="Owner" /><FilterChip label="Domain" />
          <FilterChip label="Source" /><FilterChip label="Status" /><FilterChip label="Risk" />
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setQ("")}><X className="h-3 w-3" />Clear all</Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5 text-left w-8"><Checkbox /></th>
                  <Th>ID</Th><Th>Control</Th><Th>Owner</Th><Th>Frameworks</Th><Th>Tests</Th><Th>Status</Th><Th>Risk</Th><Th></Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedId(c.id)}
                    className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === c.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                    <td className="px-3 py-3 font-medium">{c.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.owner}</td>
                    <td className="px-3 py-3 text-xs">{c.frameworks.map((id) => frameworks.find((f) => f.id === id)?.shortName).join(", ")}</td>
                    <td className="px-3 py-3 tabular-nums text-xs text-muted-foreground">{c.testsDone}/{c.testsTotal}</td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(c.status)}>{c.status}</StatusBadge></td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(c.risk)}>{c.risk}</StatusBadge></td>
                    <td className="px-3 py-3"><Link to="/controls/$id" params={{ id: c.id }}><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <Card className="border-border h-fit sticky top-4">
              <CardContent className="p-5">
                <div className="text-xs font-mono text-muted-foreground">{selected.id}</div>
                <h3 className="mt-1 font-semibold">{selected.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{selected.description}</p>
                <dl className="mt-5 space-y-2.5 text-sm">
                  <Row label="Owner" value={selected.owner} />
                  <Row label="Status" value={<StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>} />
                  <Row label="Risk" value={<StatusBadge variant={severityVariant(selected.risk)}>{selected.risk}</StatusBadge>} />
                  <Row label="Evidence" value={<StatusBadge variant={statusVariant(selected.evidence)}>{selected.evidence}</StatusBadge>} />
                  <Row label="Mapped monitors" value="4 monitors" />
                  <Row label="Mapped frameworks" value={selected.frameworks.length.toString()} />
                  <Row label="Not applicable" value="3" />
                  <Row label="Snoozed" value="1" />
                </dl>
                <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                  <Link to="/controls/$id" params={{ id: selected.id }}>View control details</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function Th({ children }: any) { return <th className="px-3 py-2.5 text-left font-medium">{children}</th>; }
function Row({ label, value }: any) { return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground text-xs">{label}</dt><dd className="text-right">{value}</dd></div>; }
function Legend({ color, label, value }: any) { return <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /><span className="flex-1">{label}</span><span className="font-medium tabular-nums">{value}</span></li>; }
function FilterChip({ label }: { label: string }) { return <Button variant="outline" size="sm" className="h-9 text-xs">{label}<ChevronRight className="h-3 w-3 rotate-90" /></Button>; }
function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}%</span></div>
      <div className="h-2 rounded-full bg-[var(--primary-ultra-soft)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
