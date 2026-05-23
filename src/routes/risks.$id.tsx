import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { NotFoundState } from "@/components/averonix/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { risks } from "@/mocks/data";

export const Route = createFileRoute("/risks/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Risk · Averonix` }] }),
  component: () => {
    const { id } = Route.useParams();
    const r = risks.find((x) => x.id === id);
    const [tab, setTab] = useState("overview");
    if (!r) return <NotFoundState label="Risk not found" backTo="/risks" backLabel="Back to risks" />;
    return (
      <>
        <PageHeader breadcrumbs={[{ label: "Risks", to: "/risks" }, { label: r.id }]} title={r.title}
          subtitle={r.reason}
          badge={<><StatusBadge variant={severityVariant(r.severity)}>{r.severity}</StatusBadge><StatusBadge variant={statusVariant(r.status)} className="ml-2">{r.status}</StatusBadge></>}
          actions={<Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Update treatment</Button>}
        />
        <div className="p-8 space-y-5">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="treatment">Treatment plan</TabsTrigger><TabsTrigger value="controls">Linked controls</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>

            <TabsContent value="overview" className="mt-5"><Card className="border-border"><CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
              <Row label="Score" value={<span className="text-xl font-semibold text-[var(--primary)]">{r.score}</span>} />
              <Row label="Category" value={r.category} /><Row label="Owner" value={r.owner} />
              <Row label="Impact" value={r.impact} /><Row label="Likelihood" value={r.likelihood} />
              <Row label="Due" value={r.dueDate} /><Row label="Review" value={r.nextReview} />
              <Row label="Linked control" value={r.linkedControl} /><Row label="Frameworks" value={r.frameworks.join(", ").toUpperCase()} />
            </CardContent></Card></TabsContent>

            <TabsContent value="treatment" className="mt-5"><Card className="border-border"><CardContent className="p-6"><h3 className="font-semibold">Treatment plan</h3><p className="text-sm text-muted-foreground mt-1">{r.treatment}</p><ul className="mt-4 space-y-2 text-sm">{["Define controls", "Assign owner", "Implement & verify", "Monitor"].map((s, i) => (<li key={s} className="flex items-center gap-3 rounded-md border border-border p-3"><div className="h-6 w-6 rounded-full bg-[var(--primary-soft)] text-[var(--primary-dark)] flex items-center justify-center text-xs font-semibold">{i + 1}</div>{s}</li>))}</ul></CardContent></Card></TabsContent>

            <TabsContent value="controls" className="mt-5"><Card className="border-border"><CardContent className="p-6"><div className="rounded-md border border-border p-4"><div className="text-xs text-muted-foreground uppercase">Primary linked control</div><div className="mt-1 font-medium">{r.linkedControl}</div></div></CardContent></Card></TabsContent>

            <TabsContent value="activity" className="mt-5"><Card className="border-border"><CardContent className="p-6"><ActivityTimeline items={[{ id: "1", text: "Risk reassessed", time: "1d ago" }, { id: "2", text: "Treatment plan updated", time: "3d ago" }, { id: "3", text: "Risk identified", time: "Last month" }]} /></CardContent></Card></TabsContent>
          </Tabs>
        </div>
      </>
    );
  },
});
function Row({ label, value }: any) { return <div><div className="text-xs text-muted-foreground uppercase">{label}</div><div className="mt-0.5">{value}</div></div>; }
