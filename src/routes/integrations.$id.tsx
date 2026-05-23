import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { NotFoundState } from "@/components/averonix/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { StatusBadge, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { integrations } from "@/mocks/data";
import { Plug, RefreshCw, Settings2, Unplug } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/integrations/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Integration · Averonix` }] }),
  component: () => {
    const { id } = Route.useParams();
    const i = integrations.find((x) => x.id === id);
    if (!i) return <NotFoundState label="Integration not found" backTo="/integrations" backLabel="Back to integrations" />;
    const connected = i.status === "Connected";
    return (
      <>
        <PageHeader breadcrumbs={[{ label: "Integrations", to: "/integrations" }, { label: i.name }]} title={i.name}
          subtitle={i.category}
          badge={<StatusBadge variant={statusVariant(i.status)}>{i.status}</StatusBadge>}
          actions={<>
            {connected ? <>
              <Button variant="outline" onClick={() => toast.success("Sync started")}><RefreshCw className="h-4 w-4" />Run mock sync</Button>
              <Button variant="outline" onClick={() => toast.success("Disconnected")}><Unplug className="h-4 w-4" />Disconnect</Button>
            </> : <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("Connected")}><Plug className="h-4 w-4" />Connect</Button>}
          </>}
        />
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="border-border lg:col-span-2"><CardContent className="p-6 space-y-5">
            <div><h3 className="font-semibold mb-2">Capabilities</h3><div className="flex flex-wrap gap-2">{i.capabilities.map((c) => <span key={c} className="text-xs rounded-md bg-[var(--primary-ultra-soft)] text-[var(--primary-dark)] px-2.5 py-1">{c}</span>)}</div></div>
            {connected && <div className="grid grid-cols-2 gap-4 text-sm"><div><div className="text-xs text-muted-foreground uppercase">Connected workspace</div><div className="mt-0.5 font-medium">{i.workspace}</div></div><div><div className="text-xs text-muted-foreground uppercase">Last sync</div><div className="mt-0.5 font-medium">{i.lastSync}</div></div></div>}
            <div><h4 className="text-sm font-semibold mb-2">Sync health</h4><div className="grid grid-cols-3 gap-3"><Health label="Success rate" v={98} /><Health label="Coverage" v={82} /><Health label="Latency" v={64} /></div></div>
          </CardContent></Card>
          <Card className="border-border h-fit"><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><h4 className="text-sm font-semibold">Scope configuration</h4><Settings2 className="h-4 w-4 text-muted-foreground" /></div><div className="space-y-3 text-sm">{["Read users & groups", "Read activity logs", "Read application catalog", "Manage policies"].map((s, idx) => (<div key={s} className="flex items-center justify-between"><span>{s}</span><Switch defaultChecked={idx < 3} /></div>))}</div></CardContent></Card>
        </div>
      </>
    );
  },
});
function Health({ label, v }: { label: string; v: number }) {
  return <div><div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="font-semibold">{v}%</span></div><ProgressBar value={v} /></div>;
}
