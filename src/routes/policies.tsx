import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/policies")({
  head: () => ({ meta: [{ title: "Policies · Averonix" }] }),
  component: () => (
    <>
      <PageHeader title="Policies" subtitle="Manage and publish your security policies" />
      <div className="p-8">
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <ScrollText className="h-12 w-12 mx-auto text-[var(--primary)]" />
            <h3 className="mt-3 font-semibold">24 policies published</h3>
            <p className="text-sm text-muted-foreground mt-1">Versioned, approved, and shared across the workspace.</p>
          </CardContent>
        </Card>
      </div>
    </>
  ),
});
