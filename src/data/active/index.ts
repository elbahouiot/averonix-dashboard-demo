// Active dashboard data — sourced from the assessment engine in "assessment" mode.
import { DATASET } from "@/lib/assessment/generators";
import { DATA_SOURCE } from "@/config/dataSource";
import type {
  Framework, Control, Vendor, DiscoveredVendor, SecurityReview,
  Risk, Gap, Task, Report, Integration, Activity, Owner,
} from "@/mocks/types";

export const isAssessmentMode = DATA_SOURCE === "assessment";

const ds = DATASET;

// Frameworks — only ISO 27001 is computed from real assessment data
export const frameworks: Framework[] = [
  {
    id: "iso-27001",
    name: "ISO 27001:2022",
    shortName: "ISO 27001",
    description: "International standard for information security management systems.",
    readiness: ds.readiness,
    completed: ds.controls.filter((c) => c.status === "OK").length,
    total: ds.controls.length,
    status: "Continue",
    category: "All",
  },
];

// Controls — full assessment-generated controls cast to dashboard shape
export const controls: Control[] = ds.controls.map((c) => ({
  id: c.id,
  name: c.title,
  description: c.question,
  owner: c.owner,
  frameworks: c.frameworks,
  testsDone: c.testsDone,
  testsTotal: c.testsTotal,
  status: c.status === "OK" ? "OK" : c.status === "Not assigned" ? "Not assigned" : "Needs attention",
  risk: c.riskLevel,
  evidence: c.evidence,
}));

export const risks: Risk[] = ds.risks.map((r) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  severity: r.severity,
  score: r.score,
  status: r.status,
  owner: r.owner,
  linkedControl: r.linkedControl,
  lastReview: r.lastReview,
  nextReview: r.nextReview,
  reason: r.reason,
  impact: r.impact,
  likelihood: r.likelihood,
  treatment: r.treatment,
  frameworks: r.frameworks,
  dueDate: r.dueDate,
}));

export const gaps: Gap[] = ds.gaps.map((g) => ({
  id: g.id,
  title: g.title,
  framework: g.framework,
  severity: g.severity,
  progress: g.progress,
  status: g.status,
  owner: g.owner,
  linkedControl: g.linkedControl,
  dueDate: g.dueDate,
  updated: g.updated,
  reason: g.reason,
  requiredEvidence: g.requiredEvidence,
  remediationSteps: g.remediationSteps,
}));

export const tasks: Task[] = ds.tasks.map((t) => ({
  id: t.id,
  title: t.title,
  framework: t.framework,
  priority: t.priority,
  progress: t.progress,
  status: t.status,
  owner: t.owner,
  linkedControl: t.linkedControl,
  dueDate: t.dueDate,
  updated: t.updated,
  relatedGap: t.relatedGap,
  summary: t.summary,
  checklist: t.checklist,
}));

// Empty data sets — these features are not connected in assessment mode
export const vendors: Vendor[] = [];
export const discoveredVendors: DiscoveredVendor[] = [];
export const securityReviews: SecurityReview[] = [];

// Integrations are shown as available product capabilities only, never connected
export const integrations: Integration[] = [
  { id: "google-workspace", name: "Google Workspace", category: "Identity providers", status: "Available", capabilities: ["Access", "Discovery", "Users"] },
  { id: "github", name: "GitHub", category: "Version control", status: "Available", capabilities: ["Code", "Security", "Repository controls"] },
  { id: "aws", name: "AWS", category: "Cloud providers", status: "Available", capabilities: ["Cloud inventory", "IAM", "Encryption checks"] },
  { id: "microsoft-365", name: "Microsoft 365", category: "Productivity", status: "Available", capabilities: ["Identity", "Email", "Productivity"] },
  { id: "slack", name: "Slack", category: "Communication", status: "Available", capabilities: ["Communication", "Vendor discovery"] },
  { id: "cloudflare", name: "Cloudflare", category: "Security tools", status: "Available", capabilities: ["DNS", "WAF", "Edge security"] },
];

export const reports: Report[] = [
  {
    id: "rep-iso",
    name: "ISO 27001 Readiness Report",
    type: "Framework",
    status: "Ready",
    generated: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    owner: "Security Team",
    sections: ["Overall readiness", "Domain scores", "Completed controls", "Open gaps", "Critical risks", "Recommended tasks"],
  },
];

// Activity is derived from generated items
export const activities: Activity[] = [
  ...ds.gaps.slice(0, 3).map((g, i) => ({ id: `ag-${i}`, text: `Gap opened: ${g.title}`, time: `${i + 1}d ago` })),
  ...ds.risks.slice(0, 2).map((r, i) => ({ id: `ar-${i}`, text: `Risk identified: ${r.title}`, time: `${i + 4}d ago` })),
].slice(0, 5);

export const evidenceGaps = {
  critical: ds.gaps.filter((g) => g.severity === "Critical").length,
  high: ds.gaps.filter((g) => g.severity === "High").length,
  medium: ds.gaps.filter((g) => g.severity === "Medium").length,
  low: ds.gaps.filter((g) => g.severity === "Low").length,
};

export const workspace = { name: "Averonix Corp." };
export const currentUser = { name: "Averonix Admin", initials: "AC" };
export const owners: Owner[] = [
  { id: "sarah-chen", name: "Sarah Chen", initials: "SC" },
  { id: "michael-lee", name: "Michael Lee", initials: "ML" },
  { id: "priya-nair", name: "Priya Nair", initials: "PN" },
  { id: "laura-patel", name: "Laura Patel", initials: "LP" },
  { id: "david-kim", name: "David Kim", initials: "DK" },
  { id: "james-wilson", name: "James Wilson", initials: "JW" },
  { id: "tom-black", name: "Tom Black", initials: "TB" },
  { id: "rachel-green", name: "Rachel Green", initials: "RG" },
];
