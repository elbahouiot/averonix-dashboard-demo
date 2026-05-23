import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { workspace, owners } from "@/mocks/data";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Averonix" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Workspace, scoring, vendors, notifications and appearance" />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl">
        <Section title="Workspace">
          <Field label="Workspace name" defaultValue={workspace.name} />
          <Field label="Default region" defaultValue="EU-West" />
          <Field label="Time zone" defaultValue="UTC+01:00 Casablanca" />
        </Section>

        <Section title="Users and roles">
          <div className="space-y-2">
            {owners.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white text-xs font-semibold">{o.initials}</div>
                <div className="flex-1 text-sm font-medium">{o.name}</div>
                <span className="text-xs text-muted-foreground">Member</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Scoring configuration">
          <Row label="Control implementation weight" value="70%" />
          <Row label="Evidence confidence weight" value="30%" />
          <Row label="Critical failure override" value={<span className="text-[var(--success)] font-medium">Enabled</span>} />
        </Section>

        <Section title="Vendor risk settings">
          <Row label="Data sensitivity" value="High" />
          <Row label="Access level" value="Production" />
          <Row label="Business criticality" value="Tier 1" />
          <Row label="Evidence status" value="Verified" />
          <Row label="Review status" value="Annual" />
        </Section>

        <Section title="Notification preferences">
          <ToggleRow label="Email weekly digest" defaultChecked />
          <ToggleRow label="Critical alert push" defaultChecked />
          <ToggleRow label="Slack notifications" />
          <ToggleRow label="Vendor review reminders" defaultChecked />
        </Section>

        <Section title="Appearance">
          <div className="rounded-lg border border-border p-4">
            <div className="text-sm font-medium">Theme</div>
            <div className="text-xs text-muted-foreground mt-1">Averonix Purple</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "#C560CC" }} />
              <code className="text-xs font-mono">#C560CC</code>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border">
      <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}
function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return <div><Label className="text-xs text-muted-foreground">{label}</Label><Input defaultValue={defaultValue} className="mt-1" /></div>;
}
function Row({ label, value }: any) { return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>; }
function ToggleRow({ label, defaultChecked }: any) { return <div className="flex items-center justify-between"><span className="text-sm">{label}</span><Switch defaultChecked={defaultChecked} /></div>; }
