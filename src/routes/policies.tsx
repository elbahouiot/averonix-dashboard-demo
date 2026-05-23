import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/averonix/StatusBadge";
import { policies } from "@/mocks/extras";
import { ScrollText, FileCheck2, Clock, Plus } from "lucide-react";

export const Route = createFileRoute("/policies")({
  head: () => ({ meta: [{ title: "Policies · Averonix" }] }),
  component: PoliciesPage,
});

function PoliciesPage() {
  return (
    <>
      <PageHeader title="Policies" subtitle="Manage and publish security policies."
        actions={<Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />New policy</Button>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Published policies" value="24" icon={ScrollText} />
          <StatCard label="Pending review" value="4" icon={Clock} />
          <StatCard label="Acknowledgement rate" value="86%" icon={FileCheck2} accent />
        </div>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm">Policy library</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Policy</Th><Th>Owner</Th><Th>Version</Th><Th>Status</Th><Th>Last updated</Th></tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-[var(--primary-ultra-soft)]">
                    <td className="px-4 py-3 font-medium">{p.name}<div className="text-[11px] text-muted-foreground mt-0.5">{p.id}</div></td>
                    <td className="px-4 py-3 text-xs">{p.owner}</td>
                    <td className="px-4 py-3 text-xs font-mono">{p.version}</td>
                    <td className="px-4 py-3"><StatusBadge variant={p.status === "Published" ? "success" : p.status === "In review" ? "warning" : "muted"}>{p.status}</StatusBadge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-2.5 text-left font-medium">{children}</th>; }
