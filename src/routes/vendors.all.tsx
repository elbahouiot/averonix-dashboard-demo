import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { vendors } from "@/mocks/data";
import { Plus, Download, Layers, Search, Building2, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendors/all")({
  head: () => ({ meta: [{ title: "All Vendors · Averonix" }] }),
  component: AllVendorsPage,
});

function AllVendorsPage() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("aws");
  const [innerTab, setInnerTab] = useState("overview");
  const filtered = vendors.filter((v) => v.name.toLowerCase().includes(q.toLowerCase()));
  const selected = vendors.find((v) => v.id === selectedId) ?? vendors[0];

  return (
    <>
      <PageHeader title="All Vendors" subtitle="Manage your full third-party inventory, ownership, and review posture."
        actions={<>
          <Button variant="outline"><Layers className="h-4 w-4" />Bulk actions</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Add vendor</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total vendors" value="128" icon={Building2} />
          <StatCard label="Critical risk" value="18" icon={AlertCircle} />
          <StatCard label="Under review" value="32" icon={Clock} />
          <StatCard label="Up to date" value="78" icon={CheckCircle2} accent />
        </div>

        <Tabs defaultValue="active">
          <TabsList><TabsTrigger value="active">Active</TabsTrigger><TabsTrigger value="archived">Archived</TabsTrigger></TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search vendors" className="pl-9 h-9" />
          </div>
          <Chip>Risk level</Chip><Chip>Status</Chip><Chip>Category</Chip><Chip>Review owner</Chip><Chip>Review due</Chip>
          <Chip>Sort: Name A-Z</Chip>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Vendor</Th><Th>Category</Th><Th>Risk</Th><Th>Score</Th><Th>Review status</Th><Th>Owner</Th><Th>DPA</Th><Th>Last</Th><Th>Next</Th></tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} onClick={() => setSelectedId(v.id)} className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === v.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3 font-medium"><Link to="/vendors/$id" params={{ id: v.id }} className="hover:text-[var(--primary)]" onClick={(e) => e.stopPropagation()}>{v.name}</Link></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{v.category}</td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(v.risk)}>{v.risk}</StatusBadge></td>
                    <td className="px-3 py-3 font-semibold tabular-nums">{v.score}</td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(v.reviewStatus)}>{v.reviewStatus}</StatusBadge></td>
                    <td className="px-3 py-3 text-muted-foreground">{v.reviewOwner}</td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(v.dataAgreement)}>{v.dataAgreement}</StatusBadge></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{v.lastReview}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{v.nextReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="border-border h-fit sticky top-4">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-dark)] font-semibold">{selected.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3 className="font-semibold">{selected.name}</h3>
                  <StatusBadge variant={severityVariant(selected.risk)}>{selected.risk} risk</StatusBadge>
                </div>
              </div>
              <Tabs value={innerTab} onValueChange={setInnerTab} className="mt-4">
                <TabsList className="w-full"><TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger><TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger></TabsList>
              </Tabs>
              {innerTab === "overview" ? (
                <dl className="mt-4 space-y-2 text-sm">
                  <Row label="Category" value={selected.category} />
                  <Row label="Review owner" value={selected.reviewOwner} />
                  <Row label="Score" value={<span className="font-semibold tabular-nums">{selected.score}</span>} />
                  <Row label="Review status" value={<StatusBadge variant={statusVariant(selected.reviewStatus)}>{selected.reviewStatus}</StatusBadge>} />
                  <Row label="Data agreement" value={<StatusBadge variant={statusVariant(selected.dataAgreement)}>{selected.dataAgreement}</StatusBadge>} />
                  <Row label="Next review" value={selected.nextReview} />
                  <div className="pt-3 border-t border-border"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Risk reason</div><p className="text-sm">{selected.riskReason}</p></div>
                  <div className="pt-3"><div className="text-xs font-medium text-muted-foreground uppercase mb-1">Next action</div><p className="text-sm">{selected.nextAction}</p></div>
                </dl>
              ) : (
                <div className="mt-4"><ActivityTimeline items={[
                  { id: "a", text: `Review assigned to ${selected.reviewOwner}`, time: "2d ago" },
                  { id: "b", text: "Risk score updated", time: "1w ago" },
                  { id: "c", text: "Added to inventory", time: "3w ago" },
                ]} /></div>
              )}
              <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Link to="/vendors/$id" params={{ id: selected.id }}>View vendor details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Th({ children }: any) { return <th className="px-3 py-2.5 text-left font-medium">{children}</th>; }
function Row({ label, value }: any) { return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground text-xs">{label}</dt><dd className="text-right text-sm">{value}</dd></div>; }
function Chip({ children }: any) { return <Button variant="outline" size="sm" className="h-9 text-xs">{children}</Button>; }
