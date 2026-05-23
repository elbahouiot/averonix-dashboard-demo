import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { StatCard } from "@/components/averonix/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, statusVariant } from "@/components/averonix/StatusBadge";
import { tests } from "@/mocks/extras";
import { FlaskConical, CheckCircle2, XCircle, Clock, Fingerprint, Cloud, Lock, KeyRound, Bug } from "lucide-react";

export const Route = createFileRoute("/tests")({
  head: () => ({ meta: [{ title: "Tests · Averonix" }] }),
  component: TestsPage,
});

const categories = [
  { name: "Identity", icon: Fingerprint, count: 86 },
  { name: "Cloud", icon: Cloud, count: 102 },
  { name: "Encryption", icon: Lock, count: 44 },
  { name: "Access", icon: KeyRound, count: 38 },
  { name: "Vulnerabilities", icon: Bug, count: 42 },
];

function TestsPage() {
  return (
    <>
      <PageHeader title="Tests" subtitle="Automated checks across cloud, identity, and code." />
      <div className="p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Running tests" value="312" icon={FlaskConical} />
          <StatCard label="Passing" value="248" icon={CheckCircle2} accent />
          <StatCard label="Failing" value="42" icon={XCircle} />
          <StatCard label="Upcoming" value="22" icon={Clock} />
        </div>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm">Test categories</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.name} className="rounded-lg border border-border p-4 hover:border-[var(--primary)] transition">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-dark)]"><Icon className="h-4 w-4" /></div>
                    <div className="mt-3 text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.count} tests</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm">All tests</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[var(--primary-ultra-soft)] text-xs uppercase tracking-wide text-muted-foreground">
                <tr><Th>Test</Th><Th>Source</Th><Th>Framework</Th><Th>Status</Th><Th>Last run</Th><Th>Linked control</Th></tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-[var(--primary-ultra-soft)]">
                    <td className="px-4 py-3 font-medium">{t.name}<div className="text-[11px] text-muted-foreground mt-0.5">{t.id}</div></td>
                    <td className="px-4 py-3 text-xs">{t.source}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{t.framework}</td>
                    <td className="px-4 py-3"><StatusBadge variant={t.status === "Passing" ? "success" : t.status === "Failing" ? "danger" : "warning"}>{t.status}</StatusBadge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{t.lastRun}</td>
                    <td className="px-4 py-3 text-xs">{t.linkedControl}</td>
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
