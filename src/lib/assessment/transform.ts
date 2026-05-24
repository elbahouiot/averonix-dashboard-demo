import type { RawDomain, RawQuestion, CompanySector, AnswerValue, EvidenceValue, GeneratedControl } from "./types";
import { ANSWER_OPTIONS, EVIDENCE_OPTIONS, computeControlScore, controlStatus, severityToRiskLevel, evidenceToLegacy } from "./scoring";

import d1 from "@/data/assessments/raw/d1.json";
import d2 from "@/data/assessments/raw/d2.json";
import d3 from "@/data/assessments/raw/d3.json";
import d4 from "@/data/assessments/raw/d4.json";
import d5 from "@/data/assessments/raw/d5.json";
import d6 from "@/data/assessments/raw/d6.json";
import d7 from "@/data/assessments/raw/d7.json";
import d8 from "@/data/assessments/raw/d8.json";
import d9 from "@/data/assessments/raw/d9.json";

export const RAW_DOMAINS: RawDomain[] = [d1, d2, d3, d4, d5, d6, d7, d8, d9] as unknown as RawDomain[];

const OWNERS = [
  "Sarah Chen", "Michael Lee", "Priya Nair", "Laura Patel",
  "David Kim", "James Wilson", "Rachel Green", "Tom Black",
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h | 0);
}
function mix(h: number, salt: number): number {
  let x = (h ^ salt) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return Math.abs(x | 0);
}

export function selectQuestions(domain: RawDomain, sector: CompanySector): RawQuestion[] {
  const core = domain.coreQuestions ?? [];
  const sectorQs = (domain.sectorQuestions ?? []).filter(
    (q) => Array.isArray(q.appliesTo) && (q.appliesTo as string[]).includes(sector),
  );
  return [...core, ...sectorQs];
}

// Heuristic to turn raw question (often FR) into a short professional title.
function deriveTitle(q: RawQuestion): string {
  const stems = [
    /^Votre organisation a[- ]t[- ]elle\s+/i,
    /^L'organisation\s+/i,
    /^Le SMSI\s+/i,
    /^Les /i,
    /^Est[- ]ce que\s+/i,
    /^Y a[- ]t[- ]il\s+/i,
  ];
  let t = q.question.replace(/[?]+$/, "").trim();
  for (const s of stems) t = t.replace(s, "");
  t = t.charAt(0).toUpperCase() + t.slice(1);
  // Cut at first comma or 70 chars
  const comma = t.indexOf(",");
  if (comma > 20 && comma < 80) t = t.slice(0, comma);
  if (t.length > 70) t = t.slice(0, 67).trim() + "…";
  return t;
}

// Deterministic seed answer for an in-progress assessment (no fake business data —
// these mirror typical compliance posture so the dashboard surfaces meaningful gaps).
function seedAnswer(q: RawQuestion): { answer?: AnswerValue; evidence: EvidenceValue } {
  const h = hash(q.id);
  const r = mix(h, 1) % 100;
  // 22% unanswered to show realistic progress
  if (r < 22) return { evidence: "missing" };
  const ar = mix(h, 2) % 100;
  let answer: AnswerValue;
  if (ar < 22) answer = "implemented";
  else if (ar < 47) answer = "mostly_implemented";
  else if (ar < 67) answer = "partially_implemented";
  else if (ar < 82) answer = "planned";
  else if (ar < 97) answer = "not_implemented";
  else answer = "not_applicable";

  const er = mix(h, 3) % 100;
  let evidence: EvidenceValue;
  if (answer === "implemented") {
    evidence = er < 55 ? "verified" : er < 85 ? "uploaded" : "partial";
  } else if (answer === "mostly_implemented") {
    evidence = er < 25 ? "verified" : er < 65 ? "uploaded" : er < 88 ? "partial" : "missing";
  } else if (answer === "partially_implemented") {
    evidence = er < 12 ? "uploaded" : er < 45 ? "partial" : "missing";
  } else if (answer === "planned") {
    evidence = er < 20 ? "partial" : "missing";
  } else {
    evidence = "missing";
  }
  return { answer, evidence };
}

export function generateControlsForDomain(domain: RawDomain, sector: CompanySector): GeneratedControl[] {
  const questions = selectQuestions(domain, sector);
  return questions.map((q, i): GeneratedControl => {
    const seed = seedAnswer(q);
    const score = computeControlScore(seed.answer, seed.evidence);
    const status = controlStatus(score, seed.answer, q.severity);
    const owner = OWNERS[hash(q.controlCode) % OWNERS.length];
    const title = deriveTitle(q);
    return {
      id: `ct-${q.controlCode}`,
      controlCode: q.controlCode,
      title,
      name: title,
      question: q.question,
      description: q.helpText ?? q.question,
      domainId: q.domainId,
      domainName: q.domainName,
      domainShortName: domain.domain.shortName,
      frameworkId: "iso-27001",
      frameworkName: "ISO 27001:2022",
      category: domain.domain.shortName,
      owner,
      severity: q.severity,
      riskLevel: severityToRiskLevel(q.severity),
      risk: severityToRiskLevel(q.severity),
      weight: q.weight,
      source: q.source ?? "assessment",
      appliesTo: q.appliesTo,
      expectedEvidence: q.expectedEvidence ?? [],
      evidenceRequirements: q.expectedEvidence ?? [],
      answerOptions: ANSWER_OPTIONS,
      evidenceOptions: EVIDENCE_OPTIONS,
      answer: seed.answer,
      evidenceStatus: seed.evidence,
      score,
      status,
      linkedGaps: [],
      linkedRisks: [],
      linkedTasks: [],
      frameworks: ["iso-27001"],
      testsDone: Math.round((score / 100) * 12),
      testsTotal: 12,
      evidence: evidenceToLegacy(seed.evidence),
    };
  });
}
