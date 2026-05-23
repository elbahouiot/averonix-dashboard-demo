import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, severityVariant } from "@/components/averonix/StatusBadge";
import { discoveredVendors } from "@/mocks/data";
import { Play, Upload, Download, ScanSearch, AlertOctagon, Link2, Ban } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendors/discovery")({
  head: () => ({ meta: [{ title: "Discovery · Averonix" }] }),
  component: DiscoveryPage,
});

function DiscoveryPage() {
  const [tab, setTab] = useState("needs");
  const [selectedId, setSelectedId] = useState("mongodb");
  const map = { needs: "Needs review", linked: "Linked", ignored: "Ignored" } as const;
  const filtered = discoveredVendors.filter((d) => d.state === map[tab as keyof typeof map]);
  const selected = discoveredVendors.find((d) => d.id === selectedId) ?? discoveredVendors[0];

  return (
    <>
      <PageHeader title="Discovery" subtitle="Review detected third-party tools and decide whether to add, link, or ignore them."
        actions={<>
          <Button variant="outline" onClick={() => toast.success("Sample imported")}><Upload className="h-4 w-4" />Import sample</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("Discovery scan started")}><Play className="h-4 w-4" />Run discovery</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Discovered vendors" value="18" icon={ScanSearch} />
          <StatCard label="Needs review" value="9" icon={AlertOctagon} accent />
          <StatCard label="Linked to existing" value="5" icon={Link2} />
          <StatCard label="Ignored" value="4" icon={Ban} />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="needs">Needs review</TabsTrigger>
            <TabsTrigger value="linked">Linked</TabsTrigger>
            <TabsTrigger value="ignored">Ignored</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-3 py-2.5 w-8"><Checkbox /></th>
                  <Th>Vendor</Th><Th>Category</Th><Th>Source</Th><Th>Accounts</Th><Th>Suggested risk</Th><Th>Discovered</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} onClick={() => setSelectedId(d.id)} className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === d.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                    <td className="px-3 py-3 font-medium">{d.name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{d.category}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{d.source}</td>
                    <td className="px-3 py-3 tabular-nums">{d.accounts}</td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(d.suggestedRisk)}>{d.suggestedRisk}</StatusBadge></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{d.date}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">Add · Link · Ignore</td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground text-sm">No discovered vendors in this view.</td></tr>}
              </tbody>
            </table>
          </div>

          <Card className="border-border h-fit sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold">{selected.name}</h3>
              <p className="text-xs text-muted-foreground">{selected.category}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Risk" value={<StatusBadge variant={severityVariant(selected.suggestedRisk)}>{selected.suggestedRisk}</StatusBadge>} />
                <Row label="Source" value={selected.source} />
                <Row label="Accounts detected" value={selected.accounts.toString()} />
              </dl>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button size="sm" className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("Vendor added")}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Linked")}>Link</Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Ignored")}>Ignore</Button>
              </div>
              <Section title="Detected accounts">
                <ul className="space-y-1 text-xs font-mono text-muted-foreground">
                  <li>alex.j***@example.com</li>
                  <li>sara.k***@example.com</li>
                  <li>michael.t***@example.com</li>
                </ul>
              </Section>
              <Section title="Discovery signals">
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li>Detected via {selected.source} login</li>
                  <li>Appears in {selected.accounts} employee accounts</li>
                  <li>No matching vendor currently in inventory</li>
                </ul>
              </Section>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <HealthBar label="Coverage" value={82} />
            <HealthBar label="Auto-linked" value={61} />
            <HealthBar label="False positives" value={8} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Th({ children }: any) { return <th className="px-3 py-2.5 text-left font-medium">{children}</th>; }
function Row({ label, value }: any) { return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground text-xs">{label}</dt><dd className="text-right">{value}</dd></div>; }
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-4 pt-4 border-t border-border"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">{title}</div>{children}</div>;
}
function HealthBar({ label, value }: { label: string; value: number }) {
  return <div><div className="flex justify-between text-sm mb-2"><span>{label}</span><span className="font-semibold tabular-nums">{value}%</span></div><div className="h-2 rounded-full bg-[var(--primary-ultra-soft)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${value}%` }} /></div></div>;
}
