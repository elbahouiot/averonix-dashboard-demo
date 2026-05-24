import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/averonix/PageHeader";
import { ProgressBar } from "@/components/averonix/ProgressBar";
import { StatusBadge } from "@/components/averonix/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronLeft, FileText, ShieldAlert } from "lucide-react";
import { RAW_DOMAINS, generateControlsForDomain } from "@/lib/assessment/transform";
import { ANSWER_OPTIONS, EVIDENCE_OPTIONS, computeControlScore, controlStatus } from "@/lib/assessment/scoring";
import type { AnswerValue, EvidenceValue, CompanySector } from "@/lib/assessment/types";
import { toast } from "sonner";

const SECTORS: { value: CompanySector; label: string }[] = [
  { value: "saas", label: "SaaS Provider" },
  { value: "fintech", label: "Fintech" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "education", label: "Education" },
  { value: "telecom", label: "Telecom" },
  { value: "professional_services", label: "Professional Services" },
  { value: "general_sme", label: "General SME" },
];

export const Route = createFileRoute("/assessments/iso-27001/$domainId")({
  head: () => ({ meta: [{ title: "Assessment domain · Averonix" }] }),
  component: AssessmentDomain,
});

interface AnswerState { answer?: AnswerValue; evidence: EvidenceValue; }

function AssessmentDomain() {
  const { domainId } = Route.useParams();
  const [sector, setSector] = useState<CompanySector>("saas");
  const raw = RAW_DOMAINS.find((d) => d.domain.id === domainId);
  const initial = useMemo(() => raw ? generateControlsForDomain(raw, sector) : [], [raw, sector]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});

  if (!raw) {
    return (
      <div className="p-8">
        <p className="text-sm">Domain not found.</p>
        <Button asChild className="mt-4"><Link to="/assessments/iso-27001">Back</Link></Button>
      </div>
    );
  }

  const merged = initial.map((c) => {
    const a = answers[c.id];
    if (!a) return c;
    const score = computeControlScore(a.answer, a.evidence);
    const status = controlStatus(score, a.answer, c.severity);
    return { ...c, answer: a.answer, evidenceStatus: a.evidence, score, status };
  });

  const answered = merged.filter((c) => c.answer).length;
  const validScores = merged.filter((c) => c.answer && c.answer !== "not_applicable").map((c) => c.score);
  const readiness = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  const progress = Math.round((answered / merged.length) * 100);

  const update = (id: string, patch: Partial<AnswerState>) =>
    setAnswers((prev) => ({ ...prev, [id]: { evidence: "missing", ...(prev[id] ?? {}), ...patch } as AnswerState }));

  return (
    <>
      <PageHeader
        title={raw.domain.shortName}
        subtitle={raw.domain.description}
        actions={
          <>
            <Button asChild variant="outline"><Link to="/assessments/iso-27001"><ChevronLeft className="h-4 w-4" />All domains</Link></Button>
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white" onClick={() => toast.success("Assessment saved locally")}>
              Finish assessment
            </Button>
          </>
        }
      />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="border-border mb-4">
            <CardContent className="p-4 flex flex-wrap items-center gap-4">
              <div className="min-w-[200px]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Company sector</div>
                <Select value={sector} onValueChange={(v) => setSector(v as CompanySector)}>
                  <SelectTrigger className="mt-1 h-8 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold tabular-nums">{answered}/{merged.length}</span>
                </div>
                <ProgressBar value={progress} />
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Live readiness</span>
                  <span className="font-semibold tabular-nums text-[var(--primary)]">{readiness}%</span>
                </div>
                <ProgressBar value={readiness} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "65vh" }}>
            {merged.map((c, idx) => (
              <Card key={c.id} className="border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-semibold tabular-nums">#{idx + 1}</span>
                        <span>·</span>
                        <span>{c.controlCode}</span>
                        <StatusBadge variant={c.severity === "critical" ? "danger" : c.severity === "high" ? "warning" : "info"}>
                          {c.severity}
                        </StatusBadge>
                      </div>
                      <div className="mt-1 text-sm font-medium leading-snug">{c.question}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                      <div className="text-lg font-semibold tabular-nums">{c.score}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Implementation</div>
                      <Select value={c.answer ?? ""} onValueChange={(v) => update(c.id, { answer: v as AnswerValue })}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {ANSWER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Evidence</div>
                      <Select value={c.evidenceStatus} onValueChange={(v) => update(c.id, { evidence: v as EvidenceValue })}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {EVIDENCE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {c.description && (
                      <Collapsible>
                        <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-accent">
                          <FileText className="h-3 w-3" />Show guidance<ChevronDown className="h-3 w-3" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 w-full rounded-md bg-muted p-3 text-muted-foreground">
                          {c.description}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    {c.expectedEvidence.length > 0 && (
                      <Collapsible>
                        <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-accent">
                          <ShieldAlert className="h-3 w-3" />Show expected evidence ({c.expectedEvidence.length})<ChevronDown className="h-3 w-3" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 w-full rounded-md bg-muted p-3">
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                            {c.expectedEvidence.map((e) => <li key={e}>{e}</li>)}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-border h-fit">
          <CardContent className="p-5 space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Live preview</div>
              <div className="text-3xl font-semibold text-[var(--primary)] tabular-nums">{readiness}%</div>
              <div className="text-xs text-muted-foreground">Domain readiness</div>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Controls answered" value={`${answered}/${merged.length}`} />
              <Row label="Controls OK" value={String(merged.filter((c) => c.status === "OK").length)} />
              <Row label="Needs attention" value={String(merged.filter((c) => c.status === "Needs attention").length)} />
              <Row label="Failed" value={String(merged.filter((c) => c.status === "Failed").length)} />
            </div>
            <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
              Gaps and risks generate automatically from your answers and appear in the dashboard.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
