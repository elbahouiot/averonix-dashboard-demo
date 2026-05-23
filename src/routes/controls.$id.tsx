import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { NotFoundState } from "@/components/averonix/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { controls, frameworks, gaps, risks, tasks } from "@/mocks/data";

export const Route = createFileRoute("/controls/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Control · Averonix` }] }),
  component: ControlDetail,
});

function ControlDetail() {
  const { id } = Route.useParams();
  const c = controls.find((x) => x.id === id);
  const [tab, setTab] = useState("overview");
  if (!c) return <NotFoundState label="Control not found" backTo="/controls" backLabel="Back to controls" />;

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Controls", to: "/controls" }, { label: c.id }]} title={c.name}
        subtitle={c.description}
        badge={<><StatusBadge variant={statusVariant(c.status)}>{c.status}</StatusBadge><StatusBadge variant={severityVariant(c.risk)} className="ml-2">{c.risk}</StatusBadge></>}
        actions={<Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">Update control</Button>}
      />
      <div className="p-8 space-y-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="evidence">Evidence</TabsTrigger><TabsTrigger value="tests">Tests</TabsTrigger><TabsTrigger value="linked">Linked items</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>

          <TabsContent value="overview" className="mt-5"><Card className="border-border"><CardContent className="p-6 grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <Row label="Control ID" value={c.id} /><Row label="Owner" value={c.owner} />
            <Row label="Status" value={<StatusBadge variant={statusVariant(c.status)}>{c.status}</StatusBadge>} />
            <Row label="Risk" value={<StatusBadge variant={severityVariant(c.risk)}>{c.risk}</StatusBadge>} />
            <Row label="Evidence" value={<StatusBadge variant={statusVariant(c.evidence)}>{c.evidence}</StatusBadge>} />
            <Row label="Frameworks" value={c.frameworks.map((id) => frameworks.find((f) => f.id === id)?.shortName).join(", ")} />
            <div className="col-span-2 mt-4 border-t border-border pt-4"><div className="text-xs font-medium uppercase text-muted-foreground mb-1">Description</div><p>{c.description}</p></div>
          </CardContent></Card></TabsContent>

          <TabsContent value="evidence" className="mt-5"><Card className="border-border"><CardContent className="p-6"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Evidence status</h3><p className="text-sm text-muted-foreground mt-1">Latest evidence snapshot for this control.</p></div><StatusBadge variant={statusVariant(c.evidence)}>{c.evidence}</StatusBadge></div><ul className="mt-4 space-y-2 text-sm">{["Quarterly screenshot", "Configuration export", "Reviewer sign-off"].map((e) => (<li key={e} className="flex items-center justify-between rounded-md border border-border p-3"><span>{e}</span><StatusBadge variant="success">Collected</StatusBadge></li>))}</ul></CardContent></Card></TabsContent>

          <TabsContent value="tests" className="mt-5"><Card className="border-border"><CardContent className="p-6"><h3 className="font-semibold">{c.testsDone} of {c.testsTotal} tests passing</h3><ul className="mt-4 space-y-2 text-sm">{["TLS version check", "Cipher strength", "Cert expiry", "HSTS enabled"].map((t, i) => (<li key={t} className="flex items-center justify-between rounded-md border border-border p-3"><span>{t}</span><StatusBadge variant={i === 3 ? "warning" : "success"}>{i === 3 ? "Failing" : "Passing"}</StatusBadge></li>))}</ul></CardContent></Card></TabsContent>

          <TabsContent value="linked" className="mt-5"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LinkedList title="Gaps" items={gaps.slice(0, 2).map((g) => ({ id: g.id, label: g.title, to: "/gaps/$id" as const, severity: g.severity }))} />
            <LinkedList title="Risks" items={risks.slice(0, 2).map((r) => ({ id: r.id, label: r.title, to: "/risks/$id" as const, severity: r.severity }))} />
            <LinkedList title="Tasks" items={tasks.slice(0, 2).map((t) => ({ id: t.id, label: t.title, to: "/tasks/$id" as const, severity: t.priority }))} />
          </div></TabsContent>

          <TabsContent value="activity" className="mt-5"><Card className="border-border"><CardContent className="p-6"><ActivityTimeline items={[
            { id: "1", text: "Control evidence refreshed", time: "1h ago" },
            { id: "2", text: `Owner assigned: ${c.owner}`, time: "Yesterday" },
            { id: "3", text: "Control created", time: "Last month" },
          ]} /></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Row({ label, value }: any) { return <div><div className="text-xs text-muted-foreground uppercase">{label}</div><div className="mt-0.5">{value}</div></div>; }
function LinkedList({ title, items }: { title: string; items: { id: string; label: string; to: any; severity: string }[] }) {
  return <Card className="border-border"><CardContent className="p-5"><h4 className="text-sm font-semibold mb-3">{title}</h4><ul className="space-y-2">{items.map((i) => (<li key={i.id}><Link to={i.to} params={{ id: i.id }} className="flex items-center gap-2 rounded-md border border-border p-2.5 hover:border-[var(--primary)] text-sm"><StatusBadge variant={severityVariant(i.severity)}>{i.severity}</StatusBadge><span className="flex-1 truncate">{i.label}</span></Link></li>))}</ul></CardContent></Card>;
}
