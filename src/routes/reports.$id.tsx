import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { NotFoundState } from "@/components/averonix/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, statusVariant } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { reports } from "@/mocks/data";
import { FileDown, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Report · Averonix` }] }),
  component: () => {
    const { id } = Route.useParams();
    const r = reports.find((x) => x.id === id);
    if (!r) return <NotFoundState label="Report not found" backTo="/reports" backLabel="Back to reports" />;
    return (
      <>
        <PageHeader breadcrumbs={[{ label: "Reports", to: "/reports" }, { label: r.name }]} title={r.name}
          subtitle={`${r.type} report · generated ${r.generated} · owner ${r.owner}`}
          badge={<StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge>}
          actions={<>
            <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Share2 className="h-4 w-4" />Export</Button>
            <Button variant="outline" onClick={() => toast.success("Regenerating…")}><RefreshCw className="h-4 w-4" />Regenerate</Button>
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("PDF prepared for demo.")}><FileDown className="h-4 w-4" />Download PDF</Button>
          </>}
        />
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="border-border lg:col-span-2"><CardContent className="p-6"><h3 className="font-semibold mb-3">Preview summary</h3><div className="space-y-3 text-sm">{r.sections.map((s) => (
            <div key={s} className="rounded-md border border-border p-4"><div className="font-medium">{s}</div><p className="mt-1 text-muted-foreground text-xs">Auto-generated summary for {s.toLowerCase()} based on current workspace data.</p></div>
          ))}</div></CardContent></Card>
          <Card className="border-border h-fit"><CardContent className="p-5"><h4 className="text-sm font-semibold mb-3">Recent export activity</h4><ActivityTimeline items={[
            { id: "1", text: "Exported to PDF", time: "2h ago" },
            { id: "2", text: "Shared with executives", time: "Yesterday" },
            { id: "3", text: "Generated", time: r.generated },
          ]} /></CardContent></Card>
        </div>
      </>
    );
  },
});
