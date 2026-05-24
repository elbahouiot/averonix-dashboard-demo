// In assessment mode this module re-exports active dashboard data sourced from
// the ISO 27001 assessment engine. The previous static mocks are retained in
// src/data/mock/legacy.ts and are not used while DATA_SOURCE === "assessment".
export {
  workspace, currentUser, owners,
  frameworks, controls,
  vendors, discoveredVendors, securityReviews,
  risks, gaps, tasks,
  reports, integrations, activities, evidenceGaps,
} from "@/data/active";
