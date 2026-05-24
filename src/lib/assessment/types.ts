// ISO 27001 assessment engine — types

export type AnswerValue =
  | "implemented"
  | "mostly_implemented"
  | "partially_implemented"
  | "planned"
  | "not_implemented"
  | "not_applicable";

export type EvidenceValue = "verified" | "uploaded" | "partial" | "missing";

export type Severity = "low" | "medium" | "high" | "critical";

export type ControlStatus = "OK" | "Needs attention" | "In progress" | "Failed" | "Not assigned";

export type CompanySector =
  | "saas" | "fintech" | "healthcare" | "ecommerce"
  | "education" | "telecom" | "professional_services" | "general_sme";

export interface RawQuestion {
  id: string;
  domainId: string;
  domainName: string;
  controlCode: string;
  question: string;
  helpText?: string;
  expectedEvidence?: string[];
  severity: Severity;
  weight: number;
  appliesTo: "all" | CompanySector[];
  source?: string;
}

export interface RawDomain {
  domain: {
    id: string;
    code: string;
    name: string;
    shortName: string;
    description: string;
    weight: number;
  };
  coreQuestions: RawQuestion[];
  sectorQuestions: RawQuestion[];
}

export interface AnswerOption { value: AnswerValue; label: string; score: number; }
export interface EvidenceOption { value: EvidenceValue; label: string; score: number; }

export interface GeneratedControl {
  id: string;            // ct-D1-C01
  controlCode: string;   // D1-C01
  title: string;
  question: string;
  description: string;   // helpText
  domainId: string;
  domainName: string;
  domainShortName: string;
  frameworkId: "iso-27001";
  frameworkName: "ISO 27001:2022";
  category: string;
  owner: string;
  severity: Severity;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  weight: number;
  source: string;
  appliesTo: "all" | CompanySector[];
  expectedEvidence: string[];
  evidenceRequirements: string[];
  answerOptions: AnswerOption[];
  evidenceOptions: EvidenceOption[];
  answer?: AnswerValue;
  evidenceStatus: EvidenceValue;
  score: number;                      // 0-100
  status: ControlStatus;
  linkedGaps: string[];
  linkedRisks: string[];
  linkedTasks: string[];
  // legacy compat fields used by existing dashboard components
  name: string;
  frameworks: string[];
  testsDone: number;
  testsTotal: number;
  evidence: "Verified" | "Ready" | "Partial" | "Missing";
  risk: "Critical" | "High" | "Medium" | "Low";
}

export interface GeneratedGap {
  id: string;
  title: string;
  framework: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  progress: number;
  status: "Open" | "In remediation" | "Awaiting evidence" | "Blocked" | "Closed";
  owner: string;
  linkedControl: string;
  linkedControlId: string;
  dueDate: string;
  updated: string;
  reason: string;
  requiredEvidence: string[];
  remediationSteps: string[];
  sourceType: "assessment";
  sourceDomainId: string;
  sourceQuestionId: string;
  sourceControlCode: string;
}

export interface GeneratedRisk {
  id: string;
  title: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  score: number;
  status: "Identified" | "In treatment" | "Monitoring" | "Closed";
  owner: string;
  linkedControl: string;
  linkedControlId: string;
  lastReview: string;
  nextReview: string;
  reason: string;
  impact: string;
  likelihood: "Low" | "Medium" | "High";
  treatment: string;
  frameworks: string[];
  dueDate: string;
  sourceType: "assessment";
  sourceDomainId: string;
  sourceQuestionId: string;
  sourceControlCode: string;
}

export interface GeneratedTask {
  id: string;
  title: string;
  framework: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  progress: number;
  status: "Open" | "In progress" | "Awaiting evidence" | "Blocked" | "Closed";
  owner: string;
  linkedControl: string;
  linkedControlId: string;
  dueDate: string;
  updated: string;
  relatedGap?: string;
  summary: string;
  checklist: { id: string; text: string; done: boolean }[];
  sourceType: "assessment";
  sourceDomainId: string;
  sourceControlCode: string;
}

export interface DomainSummary {
  id: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  controls: GeneratedControl[];
  readiness: number;
  completed: number;
  total: number;
  openGaps: number;
  linkedRisks: number;
}
