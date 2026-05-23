import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { OpsFiltersBar, ChartsRow } from "@/components/averonix/OpsBits";
import { tasks } from "@/mocks/data";
import { Plus, Download, Filter, ListTodo, Clock, Activity, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks/")({
  head: () => ({ meta: [{ title: "Tasks · Averonix" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("T-001");
  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  const selected = tasks.find((t) => t.id === selectedId) ?? tasks[0];

  return (
    <>
      <PageHeader title="Tasks" subtitle="Track remediation work, reviews, and compliance action items."
        actions={<>
          <Button variant="outline"><Filter className="h-4 w-4" />Filters</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Create task</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open tasks" value="84" icon={ListTodo} />
          <StatCard label="Overdue" value="12" icon={Clock} />
          <StatCard label="In progress" value="36" icon={Activity} />
          <StatCard label="Completed this quarter" value="28" icon={CheckCheck} accent />
        </div>

        <ChartsRow
          donut={[
            { name: "Critical", value: 12, color: "#DC2626" },
            { name: "High", value: 22, color: "#D97706" },
            { name: "Medium", value: 30, color: "#2563EB" },
            { name: "Low", value: 20, color: "#16A34A" },
          ]}
          trendLabel="Completion trend"
          trendData={[{ x: "Dec", v: 14 }, { x: "Jan", v: 18 }, { x: "Feb", v: 22 }, { x: "Mar", v: 25 }, { x: "Apr", v: 27 }, { x: "May", v: 28 }]}
        />

        <OpsFiltersBar q={q} setQ={setQ} placeholder="Search tasks" chips={["Priority", "Status", "Framework", "Owner", "Due date", "Sort: highest impact"]} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Task</Th><Th>Framework</Th><Th>Priority</Th><Th>Progress</Th><Th>Status</Th><Th>Owner</Th><Th>Linked control</Th><Th>Due</Th></tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} onClick={() => setSelectedId(t.id)} className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === t.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3 font-medium"><Link to="/tasks/$id" params={{ id: t.id }} className="hover:text-[var(--primary)]" onClick={(e) => e.stopPropagation()}>{t.title}</Link></td>
                    <td className="px-3 py-3 text-xs">{t.framework}</td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(t.priority)}>{t.priority}</StatusBadge></td>
                    <td className="px-3 py-3 min-w-[120px]"><div className="flex items-center gap-2"><ProgressBar value={t.progress} /><span className="text-xs tabular-nums w-8 text-right">{t.progress}%</span></div></td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(t.status)}>{t.status}</StatusBadge></td>
                    <td className="px-3 py-3 text-muted-foreground">{t.owner}</td>
                    <td className="px-3 py-3 text-xs">{t.linkedControl}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{t.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="border-border h-fit sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold">{selected.title}</h3>
              <div className="mt-2 flex items-center gap-2"><StatusBadge variant={severityVariant(selected.priority)}>{selected.priority}</StatusBadge><span className="text-sm text-muted-foreground">{selected.progress}%</span></div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Status" value={<StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>} />
                <Row label="Owner" value={selected.owner} />
                <Row label="Framework" value={selected.framework} />
                <Row label="Linked control" value={selected.linkedControl} />
                <Row label="Related gap" value={selected.relatedGap ?? "—"} />
                <Row label="Due date" value={selected.dueDate} />
              </dl>
              <div className="mt-4 pt-4 border-t border-border"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Summary</div><p className="text-sm">{selected.summary}</p></div>
              <div className="mt-3"><div className="text-xs font-medium text-muted-foreground uppercase mb-2">Checklist</div>
                <ul className="space-y-1.5 text-sm">{selected.checklist.map((c) => (
                  <li key={c.id} className="flex items-start gap-2"><Checkbox checked={c.done} className="mt-0.5" /><span className={c.done ? "line-through text-muted-foreground" : ""}>{c.text}</span></li>
                ))}</ul>
              </div>
              <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Link to="/tasks/$id" params={{ id: selected.id }}>View task details</Link>
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
