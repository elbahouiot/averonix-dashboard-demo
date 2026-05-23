import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { securityReviews } from "@/mocks/data";
import { Plus, Download, Settings2, Search, ClipboardList, AlertOctagon, Clock, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendors/reviews")({
  head: () => ({ meta: [{ title: "Security Reviews · Averonix" }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [tab, setTab] = useState("inprogress");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("rev-okta");
  const tabFilter = (r: any) =>
    tab === "inprogress" ? r.status === "In progress"
    : tab === "evidence" ? r.status === "Awaiting evidence"
    : tab === "overdue" ? r.status === "Overdue"
    : r.status === "Completed";
  const filtered = securityReviews.filter((r) => r.vendor.toLowerCase().includes(q.toLowerCase())).filter(tabFilter);
  const selected = securityReviews.find((r) => r.id === selectedId) ?? securityReviews[0];

  return (
    <>
      <PageHeader title="Security Reviews" subtitle="Track open vendor security assessments, ownership, and review progress."
        actions={<>
          <Button variant="outline"><Settings2 className="h-4 w-4" />Review settings</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />New review</Button>
        </>}
      />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open reviews" value="14" icon={ClipboardList} />
          <StatCard label="Overdue" value="3" icon={AlertOctagon} />
          <StatCard label="Awaiting evidence" value="5" icon={Clock} />
          <StatCard label="Completed this month" value="9" icon={CheckCheck} accent />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="inprogress">In progress</TabsTrigger>
            <TabsTrigger value="evidence">Awaiting evidence</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reviews" className="pl-9 h-9" />
          </div>
          <Chip>Owner</Chip><Chip>Risk level</Chip><Chip>Review status</Chip><Chip>Due date</Chip>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Vendor</Th><Th>Category</Th><Th>Owner</Th><Th>Risk</Th><Th>Status</Th><Th>Evidence</Th><Th>Due</Th><Th>Progress</Th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setSelectedId(r.id)} className={`border-t border-border cursor-pointer hover:bg-[var(--primary-ultra-soft)] ${selectedId === r.id ? "bg-[var(--primary-ultra-soft)]" : ""}`}>
                    <td className="px-3 py-3 font-medium"><Link to="/vendors/$id" params={{ id: r.vendorId }} className="hover:text-[var(--primary)]" onClick={(e) => e.stopPropagation()}>{r.vendor}</Link></td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{r.category}</td>
                    <td className="px-3 py-3 text-muted-foreground">{r.owner}</td>
                    <td className="px-3 py-3"><StatusBadge variant={severityVariant(r.risk)}>{r.risk}</StatusBadge></td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge></td>
                    <td className="px-3 py-3"><StatusBadge variant={statusVariant(r.evidence)}>{r.evidence}</StatusBadge></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{r.dueDate}</td>
                    <td className="px-3 py-3 min-w-[120px]"><div className="flex items-center gap-2"><ProgressBar value={r.progress} /><span className="text-xs tabular-nums w-8 text-right">{r.progress}%</span></div></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground text-sm">No reviews in this view.</td></tr>}
              </tbody>
            </table>
          </div>

          <Card className="border-border h-fit sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold">{selected.vendor}</h3>
              <p className="text-xs text-muted-foreground">{selected.category}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Risk" value={<StatusBadge variant={severityVariant(selected.risk)}>{selected.risk}</StatusBadge>} />
                <Row label="Review owner" value={selected.owner} />
                <Row label="Due date" value={selected.dueDate} />
                <Row label="Evidence" value={<StatusBadge variant={statusVariant(selected.evidence)}>{selected.evidence}</StatusBadge>} />
                <Row label="Questionnaire" value="In review" />
                <Row label="Overall progress" value={`${selected.progress}%`} />
              </dl>
              <Section title="Next actions">
                <ul className="text-sm space-y-1.5">
                  <Task>Upload latest security report</Task>
                  <Task>Confirm MFA enforcement</Task>
                  <Task>Review data processing terms</Task>
                  <Task>Finalize reviewer approval</Task>
                </ul>
              </Section>
              <Section title="Recent activity">
                <ActivityTimeline items={[
                  { id: "1", text: "Requested new evidence", time: "Today" },
                  { id: "2", text: "Vendor responded to questionnaire", time: "Yesterday" },
                  { id: "3", text: "Questionnaire shared with vendor", time: "3d ago" },
                  { id: "4", text: "Review created", time: "5d ago" },
                ]} />
              </Section>
              <Button asChild className="w-full mt-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Link to="/vendors/$id" params={{ id: selected.vendorId }}>Open vendor</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <HealthBar label="Avg. completion time" value={62} suffix="12 days" />
            <HealthBar label="Reviews with assigned owners" value={86} />
            <HealthBar label="Critical vendors reviewed on time" value={78} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Th({ children }: any) { return <th className="px-3 py-2.5 text-left font-medium">{children}</th>; }
function Row({ label, value }: any) { return <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground text-xs">{label}</dt><dd className="text-right text-sm">{value}</dd></div>; }
function Chip({ children }: any) { return <Button variant="outline" size="sm" className="h-9 text-xs">{children}</Button>; }
function Task({ children }: any) { return <li className="flex items-start gap-2"><Checkbox className="mt-0.5" />{children}</li>; }
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-4 pt-4 border-t border-border"><div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">{title}</div>{children}</div>;
}
function HealthBar({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return <div><div className="flex justify-between text-sm mb-2"><span>{label}</span><span className="font-semibold tabular-nums">{suffix ?? `${value}%`}</span></div><div className="h-2 rounded-full bg-[var(--primary-ultra-soft)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${value}%` }} /></div></div>;
}
