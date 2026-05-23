import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, statusVariant } from "@/components/averonix/StatusBadge";
import { integrations } from "@/mocks/data";
import { Plug } from "lucide-react";

export const Route = createFileRoute("/integrations/")({
  head: () => ({ meta: [{ title: "Integrations · Averonix" }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const [tab, setTab] = useState("connected");
  const filtered = integrations.filter((i) => tab === "connected" ? i.status === "Connected" : i.status === "Available");
  const categories = Array.from(new Set(filtered.map((i) => i.category)));

  return (
    <>
      <PageHeader title="Integrations" subtitle="Connect tools to improve evidence collection and discovery." />
      <div className="p-8 space-y-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList><TabsTrigger value="connected">Connected</TabsTrigger><TabsTrigger value="available">Available</TabsTrigger></TabsList>
        </Tabs>

        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.filter((i) => i.category === cat).map((i) => (
                <Card key={i.id} className="border-border hover:border-[var(--primary)] hover:shadow-md transition">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-dark)] font-semibold text-xs">{i.name.slice(0, 2).toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{i.name}</h3>
                          <StatusBadge variant={statusVariant(i.status)}>{i.status}</StatusBadge>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {i.capabilities.map((c) => <span key={c} className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{c}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-2">
                      <Button asChild variant={i.status === "Connected" ? "outline" : "default"} size="sm" className={i.status !== "Connected" ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" : ""}>
                        <Link to="/integrations/$id" params={{ id: i.id }}>
                          <Plug className="h-3.5 w-3.5" />{i.status === "Connected" ? "Manage" : "Connect"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
