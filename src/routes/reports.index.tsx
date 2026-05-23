import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusVariant } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { reports } from "@/mocks/data";
import { scheduledReports } from "@/mocks/extras";
import { FileDown, RefreshCw, FileText, ChevronRight, Plus, CalendarClock, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/")({
  head: () => ({ meta: [{ title: "Reports · Averonix" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [selectedId, setSelectedId] = useState("rep-iso");
  const selected = reports.find((r) => r.id === selectedId) ?? reports[0];

  return (
    <>
      <PageHeader title="Reports" subtitle="Generate and export compliance-ready summaries."
        actions={<>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><FileDown className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Generate report</Button>
        </>}
      />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="border-border lg:col-span-2 h-fit">
          <CardHeader><CardTitle className="text-sm">Report library</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ul>
              {reports.map((r) => (
                <li key={r.id}>
                  <button onClick={() => setSelectedId(r.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-left border-t border-border first:border-0 hover:bg-[var(--primary-ultra-soft)] ${selectedId === r.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-dark)]"><FileText className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.type} · {r.generated}</div>
                    </div>
                    <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-5">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{selected.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>
                    <span>Generated {selected.generated}</span>
                    <span>·</span>
                    <span>Owner: {selected.owner}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.success("Regenerating…")}><RefreshCw className="h-4 w-4" />Regenerate</Button>
                  <Button asChild className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Link to="/reports/$id" params={{ id: selected.id }}>Open report</Link></Button>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Included sections</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selected.sections.map((s) => (
                    <li key={s} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm bg-[var(--primary-ultra-soft)]/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />{s}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="mt-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("PDF prepared for demo.")}><FileDown className="h-4 w-4" />Download PDF</Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border">
              <CardHeader><CardTitle className="text-sm">Recent exports</CardTitle></CardHeader>
              <CardContent><ActivityTimeline items={[
                { id: "1", text: "Executive Summary exported", time: "1h ago" },
                { id: "2", text: "Vendor Risk Summary generated", time: "Yesterday" },
                { id: "3", text: "Gap Report downloaded", time: "3d ago" },
              ]} /></CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CalendarClock className="h-4 w-4 text-[var(--primary)]" />Scheduled reports</CardTitle></CardHeader>
              <CardContent className="space-y-2.5">
                {scheduledReports.map((s) => (
                  <div key={s.id} className="rounded-md border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium">{s.name}</div>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{s.recipients}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.cadence}</div>
                    <div className="mt-1 text-[11px] text-[var(--primary-dark)]">Next: {s.next}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
