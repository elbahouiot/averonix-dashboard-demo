import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { NotFoundState } from "@/components/averonix/NotFoundState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge, severityVariant, statusVariant } from "@/components/averonix/StatusBadge";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { vendors, securityReviews } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/vendors/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Vendor · Averonix` }] }),
  component: VendorDetail,
});

function VendorDetail() {
  const { id } = Route.useParams();
  const v = vendors.find((x) => x.id === id);
  const [tab, setTab] = useState("overview");
  if (!v) return <NotFoundState label="Vendor not found" backTo="/vendors/all" backLabel="Back to vendors" />;
  const review = securityReviews.find((r) => r.vendorId === v.id);

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Vendors", to: "/vendors" }, { label: "All", to: "/vendors/all" }, { label: v.name }]}
        title={v.name} subtitle={v.category}
        badge={<StatusBadge variant={severityVariant(v.risk)}>{v.risk} risk</StatusBadge>}
        actions={<Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("Review started")}>Start review</Button>}
      />
      <div className="p-8 space-y-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="risk">Risk profile</TabsTrigger><TabsTrigger value="review">Security review</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>

          <TabsContent value="overview" className="mt-5"><Card className="border-border"><CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
            <R label="Category" v={v.category} /><R label="Risk" v={<StatusBadge variant={severityVariant(v.risk)}>{v.risk}</StatusBadge>} />
            <R label="Score" v={<span className="font-semibold text-base">{v.score}</span>} />
            <R label="Review owner" v={v.reviewOwner} /><R label="Review status" v={<StatusBadge variant={statusVariant(v.reviewStatus)}>{v.reviewStatus}</StatusBadge>} />
            <R label="Data agreement" v={<StatusBadge variant={statusVariant(v.dataAgreement)}>{v.dataAgreement}</StatusBadge>} />
            <R label="Last review" v={v.lastReview} /><R label="Next review" v={v.nextReview} />
            <div className="col-span-full mt-4 pt-4 border-t border-border"><div className="text-xs font-medium uppercase text-muted-foreground mb-1">Risk reason</div><p>{v.riskReason}</p></div>
            <div className="col-span-full"><div className="text-xs font-medium uppercase text-muted-foreground mb-1">Next action</div><p>{v.nextAction}</p></div>
          </CardContent></Card></TabsContent>

          <TabsContent value="risk" className="mt-5"><Card className="border-border"><CardContent className="p-6 space-y-4"><div className="flex items-center gap-4"><div className="text-4xl font-semibold text-[var(--primary)]">{v.score}</div><div><div className="text-sm font-medium">Inherent risk score</div><StatusBadge variant={severityVariant(v.risk)}>{v.risk}</StatusBadge></div></div><div className="grid grid-cols-2 gap-4 mt-4"><Factor label="Data sensitivity" value={85} /><Factor label="Access scope" value={70} /><Factor label="Business criticality" value={92} /><Factor label="Vendor maturity" value={60} /></div></CardContent></Card></TabsContent>

          <TabsContent value="review" className="mt-5"><Card className="border-border"><CardContent className="p-6 space-y-4">
            <div><div className="flex justify-between text-sm mb-1.5"><span className="font-medium">Review progress</span><span className="font-semibold">{review?.progress ?? 45}%</span></div><ProgressBar value={review?.progress ?? 45} /></div>
            <div className="grid grid-cols-3 gap-3"><Mini label="Evidence" value={<StatusBadge variant={statusVariant(review?.evidence ?? "Partial")}>{review?.evidence ?? "Partial"}</StatusBadge>} /><Mini label="Questionnaire" value={<StatusBadge variant="info">In review</StatusBadge>} /><Mini label="Decision" value={<StatusBadge variant="muted">Pending</StatusBadge>} /></div>
            <div><h4 className="text-sm font-semibold mb-2">Review checklist</h4><ul className="space-y-1.5 text-sm">{["Receive SOC 2 report", "Confirm encryption practices", "Confirm MFA enforcement", "Sign data processing addendum", "Reviewer approval"].map((t, i) => (<li key={t} className="flex items-start gap-2"><Checkbox className="mt-0.5" checked={i < 2} />{t}</li>))}</ul></div>
            <div><h4 className="text-sm font-semibold mb-1">Reviewer notes</h4><p className="text-sm text-muted-foreground">Vendor responsive; awaiting latest pen-test report before final sign-off.</p></div>
          </CardContent></Card></TabsContent>

          <TabsContent value="activity" className="mt-5"><Card className="border-border"><CardContent className="p-6"><ActivityTimeline items={[
            { id: "1", text: "Review status updated", time: "1h ago" },
            { id: "2", text: "Evidence requested", time: "Yesterday" },
            { id: "3", text: "Vendor added to inventory", time: "Last month" },
          ]} /></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </>
  );
}
function R({ label, v }: any) { return <div><div className="text-xs text-muted-foreground uppercase">{label}</div><div className="mt-0.5">{v}</div></div>; }
function Mini({ label, value }: any) { return <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1">{value}</div></div>; }
function Factor({ label, value }: { label: string; value: number }) {
  return <div><div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="font-semibold">{value}</span></div><ProgressBar value={value} /></div>;
}
