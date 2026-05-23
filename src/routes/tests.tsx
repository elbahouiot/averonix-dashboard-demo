import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/averonix/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/tests")({
  head: () => ({ meta: [{ title: "Tests · Averonix" }] }),
  component: () => (
    <>
      <PageHeader title="Tests" subtitle="Automated checks across your environment" />
      <div className="p-8">
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FlaskConical className="h-12 w-12 mx-auto text-[var(--primary)]" />
            <h3 className="mt-3 font-semibold">312 automated tests running</h3>
            <p className="text-sm text-muted-foreground mt-1">Continuous monitoring across cloud, identity, and code.</p>
          </CardContent>
        </Card>
      </div>
    </>
  ),
});
