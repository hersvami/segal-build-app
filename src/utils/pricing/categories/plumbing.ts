import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const PLUMBING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "plumbing_scope",
    label: "Plumbing Work Type",
    category: "Plumbing",
    options: ["Hot water system replacement", "Sewer/drain repair", "Stormwater drainage", "Gas line install/repair", "Full re-pipe"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full re-pipe", value: 1.5 },
      { type: "multiplier", matchAnswer: "Stormwater drainage", value: 1.2 },
    ],
  },
  {
    id: "hot_water_type",
    label: "Hot Water System",
    category: "Plumbing",
    options: ["Not required", "Electric storage", "Gas instantaneous", "Heat pump", "Solar hot water"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Electric storage", stage: { name: "Electric hot water system", description: "Supply and install electric storage hot water system", trade: "Plumbing", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 100, isFixed: true } },
      { type: "add_stage", matchAnswer: "Gas instantaneous", stage: { name: "Gas instantaneous hot water", description: "Supply and install gas instantaneous hot water system", trade: "Plumbing", unitRate: 2400, unitType: "allow", durationDays: 1, code: "AS/NZS 5601", order: 100, isFixed: true } },
      { type: "add_stage", matchAnswer: "Heat pump", stage: { name: "Heat pump hot water system", description: "Supply and install heat pump hot water system", trade: "Plumbing", unitRate: 3800, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 100, isFixed: true } },
      { type: "add_stage", matchAnswer: "Solar hot water", stage: { name: "Solar hot water system", description: "Supply and install solar hot water system with panels and storage", trade: "Plumbing", unitRate: 5500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 100, isFixed: true } },
    ],
  },
  {
    id: "drain_camera",
    label: "CCTV Drain Inspection",
    category: "Plumbing",
    options: ["Not required", "CCTV drain inspection"],
    costEffect: [
      { type: "add_stage", matchAnswer: "CCTV drain inspection", stage: { name: "CCTV drain inspection", description: "CCTV camera inspection of drains with report", trade: "Plumbing", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 12, isFixed: true } },
    ],
  },
];

export const plumbing: WorkCategory = {
  id: "plumbing",
  label: "Plumbing & Drainage",
  description: "Hot water, sewer, stormwater, gas, re-piping",
  icon: "🔧",
  trades: ["Site Prep", "Plumbing", "Excavation", "Concrete", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Site setup, locate services, isolation", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Locate & mark services", description: "Dial Before You Dig, locate existing services", trade: "Plumbing", unitRate: 350, unitType: "allow", durationDays: 1, code: "DBYD", order: 15, isFixed: true },
    { name: "Excavation & trenching", description: "Excavate trenches for new pipe runs", trade: "Excavation", unitRate: 85, unitType: "area", durationDays: 2, code: "AS/NZS 3500", order: 20 },
    { name: "Pipe installation", description: "New pipework — supply, lay and connect (copper/PEX/PVC)", trade: "Plumbing", unitRate: 120, unitType: "area", durationDays: 3, code: "AS/NZS 3500", order: 50 },
    { name: "Testing & commissioning", description: "Pressure test, flow test and commission new pipework", trade: "Plumbing", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 150, isFixed: true },
    { name: "Backfill & reinstatement", description: "Backfill trenches, compact and reinstate surfaces", trade: "Excavation", unitRate: 45, unitType: "area", durationDays: 1, code: "NCC 2022", order: 170 },
    { name: "Compliance certificate", description: "Issue plumbing compliance certificate", trade: "Plumbing", unitRate: 200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 220, isFixed: true },
    { name: "Builder's clean", description: "Clean up and site tidy", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...PLUMBING_QUESTIONS],
};
