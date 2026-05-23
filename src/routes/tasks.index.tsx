import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { tasks } from "@/mocks/data";
import { Plus, Download, Filter, ListTodo, Clock, Activity, CheckCheck, LayoutGrid, List, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks/")({
  head: () => ({ meta: [{ title: "Tasks · Averonix" }] }),
  component: TasksPage,
});

type Lane = "To do" | "In progress" | "Waiting evidence" | "Done";
const lanes: { key: Lane; match: (s: string) => boolean; tint: string }[] = [
  { key: "To do", match: (s) => s === "Open", tint: "bg-[#F3F4F6] text-[#374151]" },
  { key: "In progress", match: (s) => s === "In progress", tint: "bg-[#DBEAFE] text-[#1D4ED8]" },
  { key: "Waiting evidence", match: (s) => s === "Awaiting evidence" || s === "Blocked", tint: "bg-[#FEF3C7] text-[#B45309]" },
  { key: "Done", match: (s) => s === "Closed", tint: "bg-[#DCFCE7] text-[#15803D]" },
];

function TasksPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <>
      <PageHeader title="Tasks" subtitle="Manage remediation work, assignments, and deadlines."
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

        {/* View toggle */}
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button onClick={() => setView("kanban")}
              className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                view === "kanban" ? "bg-[var(--primary)] text-white" : "text-muted-foreground hover:text-foreground")}>
              <LayoutGrid className="h-3.5 w-3.5" />Kanban
            </button>
            <button onClick={() => setView("list")}
              className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                view === "list" ? "bg-[var(--primary)] text-white" : "text-muted-foreground hover:text-foreground")}>
              <List className="h-3.5 w-3.5" />List
            </button>
          </div>
          <div className="text-xs text-muted-foreground">{tasks.length} tasks across {lanes.length} stages</div>
        </div>

        {view === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {lanes.map((lane) => {
              const items = tasks.filter((t) => lane.match(t.status));
              return (
                <div key={lane.key} className="flex flex-col rounded-lg border border-border bg-[var(--primary-ultra-soft)]/40 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", lane.tint)}>{lane.key}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">{items.length}</span>
                  </div>
                  <div className="space-y-2.5 min-h-[120px]">
                    {items.map((t) => (
                      <Link key={t.id} to="/tasks/$id" params={{ id: t.id }}
                        className="block rounded-lg bg-card border border-border p-3 hover:border-[var(--primary)] hover:shadow-sm transition">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-medium leading-snug">{t.title}</div>
                          <StatusBadge variant={severityVariant(t.priority)}>{t.priority}</StatusBadge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                          {t.relatedGap && <span className="rounded bg-[var(--primary-soft)] text-[var(--primary-dark)] px-1.5 py-0.5 font-mono">Gap {t.relatedGap}</span>}
                          <span className="rounded bg-muted text-muted-foreground px-1.5 py-0.5">{t.framework}</span>
                        </div>
                        <div className="mt-3">
                          <ProgressBar value={t.progress} className="h-1.5" />
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[9px] font-semibold">{t.owner.split(" ").map(p=>p[0]).join("").slice(0,2)}</span>{t.owner.split(" ")[0]}</span>
                          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{t.dueDate.replace(", 2025", "")}</span>
                        </div>
                      </Link>
                    ))}
                    {items.length === 0 && <div className="text-[11px] text-muted-foreground text-center py-6">No tasks</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                  <tr><Th>Task</Th><Th>Priority</Th><Th>Status</Th><Th>Linked</Th><Th>Owner</Th><Th>Progress</Th><Th>Due</Th></tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} className="border-t border-border hover:bg-[var(--primary-ultra-soft)]">
                      <td className="px-4 py-3 font-medium"><Link to="/tasks/$id" params={{ id: t.id }} className="hover:text-[var(--primary)]">{t.title}</Link></td>
                      <td className="px-4 py-3"><StatusBadge variant={severityVariant(t.priority)}>{t.priority}</StatusBadge></td>
                      <td className="px-4 py-3"><StatusBadge variant={statusVariant(t.status)}>{t.status}</StatusBadge></td>
                      <td className="px-4 py-3 text-xs font-mono">{t.relatedGap ?? "—"}</td>
                      <td className="px-4 py-3 text-xs">{t.owner}</td>
                      <td className="px-4 py-3 min-w-[140px]"><div className="flex items-center gap-2"><ProgressBar value={t.progress} /><span className="text-xs tabular-nums w-8 text-right">{t.progress}%</span></div></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{t.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-2.5 text-left font-medium">{children}</th>; }
