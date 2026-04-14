import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const DEMOLITION_QUESTIONS: ScopeQuestion[] = [
  {
    id: "demo_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Internal strip-out only", "Partial demolition (one section)", "Full house demolition", "Commercial demolition"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full house demolition", value: 2.0 },
      { type: "multiplier", matchAnswer: "Commercial demolition", value: 2.5 },
    ],
  },
  {
    id: "asbestos",
    label: "Asbestos Present",
    category: "Hazardous",
    options: ["No asbestos", "Suspected — needs testing", "Confirmed — requires licensed removal"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Suspected — needs testing", stage: { name: "Asbestos testing", description: "Collect samples and laboratory analysis", trade: "Asbestos", unitRate: 650, unitType: "allow", durationDays: 3, code: "Code of Practice (WorkSafe Vic)", order: 8, isFixed: true } },
      { type: "add_stage", matchAnswer: "Confirmed — requires licensed removal", stage: { name: "Licensed asbestos removal", description: "Licensed Class A/B asbestos removal, disposal to licensed facility", trade: "Asbestos Removal", unitRate: 5500, unitType: "allow", durationDays: 3, code: "Code of Practice (WorkSafe Vic)", order: 25, isFixed: true } },
    ],
  },
  {
    id: "salvage",
    label: "Salvage Requirements",
    category: "Demolition",
    options: ["No salvage — all to waste", "Salvage fixtures/fittings", "Heritage salvage (bricks, timber, features)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Salvage fixtures/fittings", value: 1.15 },
      { type: "multiplier", matchAnswer: "Heritage salvage (bricks, timber, features)", value: 1.4 },
    ],
  },
];

export const demolition: WorkCategory = {
  id: "demolition",
  label: "Demolition",
  description: "Partial demolition, full house demo, strip-out, hazmat removal",
  icon: "🏚️",
  trades: ["Site Prep", "Demolition", "Asbestos Removal", "Excavation", "Skip Bin", "Cleaning"],
  stages: [
    { name: "Site preparation & fencing", description: "Temporary fencing, signage, service disconnection", trade: "Site Prep", unitRate: 1200, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Service disconnections", description: "Disconnect water, gas, electricity, sewer", trade: "Site Prep", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 12, isFixed: true },
    { name: "Soft strip / internal demolition", description: "Remove fixtures, fittings, linings and services", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 3, code: "AS 2601", order: 30 },
    { name: "Structural demolition", description: "Demolish walls, roof, floor — controlled sequence", trade: "Demolition", unitRate: 85, unitType: "area", durationDays: 5, code: "AS 2601", order: 50 },
    { name: "Waste sorting & disposal", description: "Sort materials, load to bins, dispose to licensed facility", trade: "Skip Bin", unitRate: 55, unitType: "area", durationDays: 2, code: "EPA Vic", order: 80 },
    { name: "Site clearance & levelling", description: "Clear site, level, compact and make safe", trade: "Excavation", unitRate: 40, unitType: "area", durationDays: 2, code: "NCC 2022", order: 150 },
    { name: "Council notification", description: "Notify council of completion, submit documents", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "Building Act 1993", order: 220, isFixed: true },
    { name: "Final site clean", description: "Final clean, remove fencing", trade: "Cleaning", unitRate: 500, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...DEMOLITION_QUESTIONS],
};
