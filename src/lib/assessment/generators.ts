import type {
  GeneratedControl, GeneratedGap, GeneratedRisk, GeneratedTask,
  DomainSummary, CompanySector,
} from "./types";
import { RAW_DOMAINS, generateControlsForDomain } from "./transform";
import { DEFAULT_SECTOR } from "@/config/dataSource";

const TODAY = new Date("2026-05-24");

function addDays(d: Date, n: number): string {
  const x = new Date(d); x.setDate(x.getDate() + n);
  return x.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function shouldGenerateGap(c: GeneratedControl): boolean {
  const sev = c.severity;
  const ans = c.answer;
  const ev = c.evidenceStatus;
  if (!ans || ans === "not_applicable") return false;
  if (ans === "mostly_implemented" && (ev === "uploaded" || ev === "verified")) return false;
  if (c.score >= 75 && !(sev === "critical" && ev === "missing")) return false;
  if (sev === "low" && ans === "partially_implemented") return false;

  if (ev === "missing" && (sev === "high" || sev === "critical")) return true;
  if (ans === "not_implemented") return true;
  if (ans === "planned" && (sev === "high" || sev === "critical")) return true;
  if (ans === "partially_implemented" && (ev === "missing" || ev === "partial")) return true;
  if (sev === "critical" && c.score < 85) return true;
  return false;
}

function shouldGenerateRisk(c: GeneratedControl): boolean {
  if (c.status !== "Failed") return false;
  const strategic = /scop|asset|vendor|third|supplier|access|incident|compli|data|sensitive|fournisseur|tiers|accès|incident|conformité|donnée/i;
  if (c.severity === "critical") return true;
  if (c.severity === "high" && c.evidenceStatus === "missing" && strategic.test(c.title + " " + c.question)) return true;
  return false;
}

function gapStatus(c: GeneratedControl): GeneratedGap["status"] {
  if (c.answer === "not_implemented") return "Open";
  if (c.evidenceStatus === "missing") return "Awaiting evidence";
  if (c.answer === "planned") return "Blocked";
  return "In remediation";
}

function gapProgress(c: GeneratedControl): number {
  return Math.max(5, Math.min(90, c.score));
}

export interface GeneratedDataset {
  controls: GeneratedControl[];
  gaps: GeneratedGap[];
  risks: GeneratedRisk[];
  tasks: GeneratedTask[];
  domains: DomainSummary[];
  readiness: number;
}

export function generateDataset(sector: CompanySector = DEFAULT_SECTOR as CompanySector): GeneratedDataset {
  const allControls: GeneratedControl[] = [];
  const domains: DomainSummary[] = [];

  for (const raw of RAW_DOMAINS) {
    const ctrls = generateControlsForDomain(raw, sector);
    allControls.push(...ctrls);
    const completed = ctrls.filter((c) => c.status === "OK").length;
    const validScores = ctrls.filter((c) => c.answer && c.answer !== "not_applicable").map((c) => c.score);
    const readiness = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
    domains.push({
      id: raw.domain.id,
      code: raw.domain.code,
      name: raw.domain.name,
      shortName: raw.domain.shortName,
      description: raw.domain.description,
      controls: ctrls,
      readiness,
      completed,
      total: ctrls.length,
      openGaps: 0,
      linkedRisks: 0,
    });
  }

  // Gaps
  const gaps: GeneratedGap[] = [];
  let gi = 1;
  for (const c of allControls) {
    if (!shouldGenerateGap(c)) continue;
    const id = `G-${String(gi++).padStart(3, "0")}`;
    const reason =
      c.evidenceStatus === "missing"
        ? "No evidence has been collected for this control."
        : c.answer === "not_implemented"
        ? "Control is not implemented."
        : c.answer === "planned"
        ? "Control is planned but not in place."
        : "Implementation is partial and evidence is insufficient.";
    const due = addDays(TODAY, 14 + (c.severity === "critical" ? 0 : c.severity === "high" ? 7 : 21));
    gaps.push({
      id,
      title: `${c.title} — remediation needed`,
      framework: "ISO 27001",
      severity: c.riskLevel,
      progress: gapProgress(c),
      status: gapStatus(c),
      owner: c.owner,
      linkedControl: c.title,
      linkedControlId: c.id,
      dueDate: due,
      updated: addDays(TODAY, -Math.abs(hash(c.id) % 14)),
      reason,
      requiredEvidence: c.expectedEvidence,
      remediationSteps: [
        `Review ${c.title.toLowerCase()}`,
        "Implement the missing control activity",
        "Collect supporting evidence",
        "Verify with control owner",
      ],
      sourceType: "assessment",
      sourceDomainId: c.domainId,
      sourceQuestionId: c.controlCode,
      sourceControlCode: c.controlCode,
    });
    c.linkedGaps.push(id);
  }

  // Risks
  const risks: GeneratedRisk[] = [];
  let ri = 1;
  for (const c of allControls) {
    if (!shouldGenerateRisk(c)) continue;
    const id = `R-${String(ri++).padStart(3, "0")}`;
    const sev = c.riskLevel;
    risks.push({
      id,
      title: `${c.title} exposure`,
      category: c.domainShortName,
      severity: sev,
      score: sev === "Critical" ? 90 : sev === "High" ? 75 : sev === "Medium" ? 55 : 30,
      status: c.answer === "not_implemented" ? "Identified" : "In treatment",
      owner: c.owner,
      linkedControl: c.title,
      linkedControlId: c.id,
      lastReview: addDays(TODAY, -30),
      nextReview: addDays(TODAY, 30),
      reason: c.question,
      impact: sev === "Critical" ? "Severe business or regulatory exposure." : "Notable operational or compliance exposure.",
      likelihood: sev === "Critical" ? "High" : sev === "High" ? "Medium" : "Low",
      treatment: `Close gap on “${c.title}” and provide verified evidence.`,
      frameworks: ["iso-27001"],
      dueDate: addDays(TODAY, sev === "Critical" ? 14 : 30),
      sourceType: "assessment",
      sourceDomainId: c.domainId,
      sourceQuestionId: c.controlCode,
      sourceControlCode: c.controlCode,
    });
    c.linkedRisks.push(id);
  }

  // Tasks — group by domain; one task per domain that has gaps
  const tasks: GeneratedTask[] = [];
  let ti = 1;
  for (const d of domains) {
    const domainGaps = gaps.filter((g) => g.sourceDomainId === d.id);
    if (domainGaps.length === 0) continue;
    const id = `T-${String(ti++).padStart(3, "0")}`;
    const topSev = domainGaps.some((g) => g.severity === "Critical")
      ? "Critical"
      : domainGaps.some((g) => g.severity === "High") ? "High"
      : domainGaps.some((g) => g.severity === "Medium") ? "Medium" : "Low";
    const owner = domainGaps[0].owner;
    const checklist = domainGaps.slice(0, 6).map((g, i) => ({
      id: `c${i + 1}`,
      text: `Address ${g.linkedControl}`,
      done: g.progress > 75,
    }));
    if (checklist.length < domainGaps.length) {
      checklist.push({ id: "cN", text: `Resolve ${domainGaps.length - checklist.length} more linked gaps`, done: false });
    }
    const progress = Math.round(domainGaps.reduce((a, g) => a + g.progress, 0) / domainGaps.length);
    const status: GeneratedTask["status"] = progress >= 95 ? "Closed" : progress > 40 ? "In progress" : progress > 10 ? "Awaiting evidence" : "Open";
    const task: GeneratedTask = {
      id,
      title: `Close ${d.shortName} compliance gaps`,
      framework: "ISO 27001",
      priority: topSev as GeneratedTask["priority"],
      progress,
      status,
      owner,
      linkedControl: d.shortName,
      linkedControlId: domainGaps[0].linkedControlId,
      dueDate: addDays(TODAY, 21),
      updated: addDays(TODAY, -3),
      relatedGap: domainGaps[0].id,
      summary: `Coordinate remediation across ${domainGaps.length} open gap${domainGaps.length === 1 ? "" : "s"} in ${d.name}.`,
      checklist,
      sourceType: "assessment",
      sourceDomainId: d.id,
      sourceControlCode: domainGaps[0].sourceControlCode,
    };
    tasks.push(task);
    domainGaps.forEach((g) => {
      const c = allControls.find((x) => x.id === g.linkedControlId);
      c?.linkedTasks.push(id);
    });
  }

  // Domain summaries — backfill gap/risk counts
  for (const d of domains) {
    d.openGaps = gaps.filter((g) => g.sourceDomainId === d.id && g.status !== "Closed").length;
    d.linkedRisks = risks.filter((r) => r.sourceDomainId === d.id).length;
  }

  const validReadiness = domains.map((d) => d.readiness).filter((r) => r > 0);
  const readiness = validReadiness.length
    ? Math.round(validReadiness.reduce((a, b) => a + b, 0) / validReadiness.length)
    : 0;

  return { controls: allControls, gaps, risks, tasks, domains, readiness };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const DATASET = generateDataset();
