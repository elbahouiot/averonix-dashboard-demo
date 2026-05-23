import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Donut } from "@/components/averonix/Charts";
import { StatusBadge, severityVariant } from "@/components/averonix/StatusBadge";
import { ActivityTimeline } from "@/components/averonix/ActivityTimeline";
import { Plus, Upload, Download, Building2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { vendors } from "@/mocks/data";

export const Route = createFileRoute("/vendors/")({
  head: () => ({ meta: [{ title: "Vendors · Averonix" }] }),
  component: VendorsOverview,
});

const reviewsDue = [
  { vendor: "AWS", id: "aws", risk: "Critical", when: "Due today" },
  { vendor: "Okta", id: "okta", risk: "High", when: "Due in 2 days" },
  { vendor: "Google Workspace", id: "google-workspace", risk: "High", when: "Due in 4 days" },
  { vendor: "Cloudflare", id: "cloudflare", risk: "Medium", when: "Due next week" },
];

const recentActivity = [
  { id: "v1", text: "Security review completed for Atlassian", time: "2h ago" },
  { id: "v2", text: "Vendor added: Notion", time: "Yesterday" },
  { id: "v3", text: "Risk level updated for GitHub", time: "2d ago" },
  { id: "v4", text: "AWS review assigned to Security team", time: "3d ago" },
  { id: "v5", text: "DPA missing for Stripe", time: "4d ago" },
];

function VendorsOverview() {
  return (
    <>
      <PageHeader title="Vendors" subtitle="Overview of your third-party risk posture"
        actions={<>
          <Button variant="outline" onClick={() => toast.success("Sample imported")}><Upload className="h-4 w-4" />Import sample</Button>
          <Button variant="outline" onClick={() => toast.success("Export prepared for demo.")}><Download className="h-4 w-4" />Export</Button>
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"><Plus className="h-4 w-4" />Add vendor</Button>
        </>}
      />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total vendors" value="42" icon={Building2} />
          <StatCard label="Critical vendors" value="6" icon={AlertCircle} />
          <StatCard label="Under review" value="8" icon={Clock} />
          <StatCard label="Approved" value="17" icon={ShieldCheck} accent />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-sm">Vendor risk distribution</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-6">
              <Donut size={160} centerValue="42" centerLabel="vendors" data={[
                { name: "Critical", value: 6, color: "#DC2626" },
                { name: "High", value: 11, color: "#D97706" },
                { name: "Medium", value: 15, color: "#2563EB" },
                { name: "Low", value: 10, color: "#16A34A" },
              ]}/>
              <ul className="text-sm space-y-2 flex-1">
                <RLeg color="#DC2626" label="Critical" v="6" pct="14%" />
                <RLeg color="#D97706" label="High" v="11" pct="26%" />
                <RLeg color="#2563EB" label="Medium" v="15" pct="36%" />
                <RLeg color="#16A34A" label="Low" v="10" pct="24%" />
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border lg:col-span-2">
            <CardHeader><CardTitle className="text-sm">Reviews due</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {reviewsDue.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-md border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary-dark)]">{r.vendor.slice(0, 2).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{r.vendor}</div>
                    <div className="text-xs text-muted-foreground">{r.when}</div>
                  </div>
                  <StatusBadge variant={severityVariant(r.risk)}>{r.risk}</StatusBadge>
                  <Button asChild size="sm" className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                    <Link to="/vendors/$id" params={{ id: r.id }}>Review</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-border lg:col-span-2">
            <CardHeader><CardTitle className="text-sm">Top risky vendors</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground bg-[var(--primary-ultra-soft)]">
                  <tr><th className="px-4 py-2.5 text-left">Vendor</th><th className="px-4 py-2.5 text-left">Category</th><th className="px-4 py-2.5 text-left">Score</th><th className="px-4 py-2.5 text-left">Risk</th></tr>
                </thead>
                <tbody>
                  {vendors.slice(0, 5).map((v) => (
                    <tr key={v.id} className="border-t border-border hover:bg-[var(--primary-ultra-soft)]">
                      <td className="px-4 py-3 font-medium"><Link to="/vendors/$id" params={{ id: v.id }} className="hover:text-[var(--primary)]">{v.name}</Link></td>
                      <td className="px-4 py-3 text-muted-foreground">{v.category}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{v.score}</td>
                      <td className="px-4 py-3"><StatusBadge variant={severityVariant(v.risk)}>{v.risk}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardTitle className="text-sm">Recent vendor activity</CardTitle></CardHeader>
            <CardContent><ActivityTimeline items={recentActivity} /></CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm">Program health</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HealthBar label="Inventory coverage" value={86} />
            <HealthBar label="Review completion" value={71} />
            <HealthBar label="Evidence quality" value={63} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function RLeg({ color, label, v, pct }: any) { return <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /><span className="flex-1">{label}</span><span className="font-medium tabular-nums">{v}</span><span className="text-muted-foreground text-xs tabular-nums">{pct}</span></li>; }
function HealthBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2"><span>{label}</span><span className="font-semibold tabular-nums">{value}%</span></div>
      <div className="h-2 rounded-full bg-[var(--primary-ultra-soft)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
