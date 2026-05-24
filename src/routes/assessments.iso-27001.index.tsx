import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DATASET } from "@/lib/assessment/generators";
import { ChevronRight, ShieldCheck, AlertTriangle, ListChecks, Target } from "lucide-react";

export const Route = createFileRoute("/assessments/iso-27001/")({
  head: () => ({ meta: [{ title: "ISO 27001 Assessment · Averonix" }] }),
  component: AssessmentLanding,
});

function AssessmentLanding() {
  const ds = DATASET;
  const answered = ds.controls.filter((c) => c.answer).length;
  return (
    <>
      <PageHeader
        title="ISO 27001 Assessment"
        subtitle="Evaluate your ISMS readiness across 9 domains"
      />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overall readiness" value={`${ds.readiness}%`} accent icon={Target} />
          <StatCard label="Controls" value={`${answered}/${ds.controls.length}`} hint="Answered" icon={ShieldCheck} />
          <StatCard label="Open gaps" value={String(ds.gaps.filter((g) => g.status !== "Closed").length)} icon={AlertTriangle} />
          <StatCard label="Recommended tasks" value={String(ds.tasks.length)} icon={ListChecks} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ds.domains.map((d) => (
            <Card key={d.id} className="border-border hover:border-[var(--primary)] hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-dark)] text-xs font-semibold">
                    {d.code}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground leading-tight">{d.shortName}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{d.description}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-semibold tabular-nums">{d.readiness}%</span>
                  </div>
                  <ProgressBar value={d.readiness} />
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{d.total} controls</span>
                  <span>{d.openGaps} open gaps</span>
                  <span>{d.linkedRisks} risks</span>
                </div>
                <Button asChild size="sm" variant="outline" className="mt-5 w-full">
                  <Link to="/assessments/iso-27001/$domainId" params={{ domainId: d.id }}>
                    {d.readiness > 0 ? "Continue" : "Start"} <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
