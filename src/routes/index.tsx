import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { Sparkline } from "@/components/averonix/Charts";
import { StatusBadge } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { frameworks, activities, evidenceGaps } from "@/mocks/data";
import { ChevronRight, Play, FileDown, Plus, Shield, AlertTriangle, FileCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Overview · Averonix" }, { name: "description", content: "Your compliance command center." }] }),
  component: Overview,
});

function Overview() {
  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Your compliance command center"
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Assessment started")}><Play className="h-4 w-4" />Run assessment</Button>
            <Button variant="outline" onClick={() => toast.success("Report queued")}><FileDown className="h-4 w-4" />Generate report</Button>
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Add framework</Button>
          </>
        }
      />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overall readiness" value="58%" hint="+4% vs last month" accent icon={Shield} />
          <StatCard label="Open gaps" value="42" hint="14 critical" icon={AlertTriangle} />
          <StatCard label="Evidence coverage" value="63%" hint="of mapped controls" icon={FileCheck} />
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Readiness trend</div>
              <div className="mt-2 text-3xl font-semibold text-[var(--primary)]">+6%</div>
              <Sparkline data={[42, 45, 48, 50, 52, 55, 58]} />
            </CardContent>
          </Card>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Framework readiness</h2>
            <Link to="/frameworks" className="text-sm text-[var(--primary)] hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {frameworks.map((f) => (
              <Link key={f.id} to="/frameworks/$id" params={{ id: f.id }}>
                <Card className="border-border transition hover:border-[var(--primary)] hover:shadow-md group cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-dark)] text-xs font-semibold">{f.shortName.slice(0, 3).toUpperCase()}</div>
                        <div>
                          <div className="font-medium text-sm">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{f.completed} / {f.total} controls</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--primary)]" />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Readiness</span>
                      <span className="font-semibold tabular-nums">{f.readiness}%</span>
                    </div>
                    <ProgressBar value={f.readiness} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Evidence Gaps</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <GapTile label="Critical" value={evidenceGaps.critical} variant="danger" />
              <GapTile label="High" value={evidenceGaps.high} variant="warning" />
              <GapTile label="Medium" value={evidenceGaps.medium} variant="info" />
              <GapTile label="Low" value={evidenceGaps.low} variant="success" />
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
            <CardContent><ActivityTimeline items={activities.slice(0, 5)} /></CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function GapTile({ label, value, variant }: { label: string; value: number; variant: any }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <StatusBadge variant={variant}>{label}</StatusBadge>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
