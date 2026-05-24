import type { AnswerValue, EvidenceValue, AnswerOption, EvidenceOption, ControlStatus, Severity } from "./types";

export const ANSWER_OPTIONS: AnswerOption[] = [
  { value: "implemented", label: "Implemented", score: 100 },
  { value: "mostly_implemented", label: "Mostly implemented", score: 75 },
  { value: "partially_implemented", label: "Partially implemented", score: 50 },
  { value: "planned", label: "Planned", score: 25 },
  { value: "not_implemented", label: "Not implemented", score: 0 },
  { value: "not_applicable", label: "Not applicable", score: -1 },
];

export const EVIDENCE_OPTIONS: EvidenceOption[] = [
  { value: "verified", label: "Verified", score: 100 },
  { value: "uploaded", label: "Uploaded", score: 80 },
  { value: "partial", label: "Partial", score: 50 },
  { value: "missing", label: "Missing", score: 0 },
];

export function implementationScore(a?: AnswerValue): number | null {
  if (!a || a === "not_applicable") return null;
  return ANSWER_OPTIONS.find((o) => o.value === a)?.score ?? 0;
}

export function evidenceScore(e: EvidenceValue): number {
  return EVIDENCE_OPTIONS.find((o) => o.value === e)?.score ?? 0;
}

export function computeControlScore(answer: AnswerValue | undefined, evidence: EvidenceValue): number {
  const impl = implementationScore(answer);
  if (impl === null) return 0;
  return Math.round(impl * 0.7 + evidenceScore(evidence) * 0.3);
}

export function controlStatus(score: number, answer: AnswerValue | undefined, severity: Severity): ControlStatus {
  if (!answer) return "Not assigned";
  if (severity === "critical" && answer === "not_implemented") return "Failed";
  if (score >= 85) return "OK";
  if (score >= 60) return "Needs attention";
  if (score >= 35) return "In progress";
  return "Failed";
}

export function severityToRiskLevel(s: Severity): "Critical" | "High" | "Medium" | "Low" {
  return s === "critical" ? "Critical" : s === "high" ? "High" : s === "medium" ? "Medium" : "Low";
}

export function evidenceToLegacy(e: EvidenceValue): "Verified" | "Ready" | "Partial" | "Missing" {
  return e === "verified" ? "Verified" : e === "uploaded" ? "Ready" : e === "partial" ? "Partial" : "Missing";
}
