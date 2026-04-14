import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const PAVING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "paving_type",
    label: "Paving Type",
    category: "Materials",
    options: ["Clay pavers", "Concrete pavers", "Natural stone pavers", "Bluestone pavers", "Porcelain outdoor tiles"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Natural stone pavers", value: 1.5 },
      { type: "multiplier", matchAnswer: "Bluestone pavers", value: 1.6 },
      { type: "multiplier", matchAnswer: "Porcelain outdoor tiles", value: 1.35 },
    ],
  },
  {
    id: "paving_base",
    label: "Base Preparation",
    category: "Earthworks",
    options: ["Existing base — relay pavers", "Light base prep — scrape and compact", "Full excavation and new base"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Existing base — relay pavers", value: 0.7 },
      { type: "multiplier", matchAnswer: "Full excavation and new base", value: 1.2 },
    ],
  },
  {
    id: "paving_pattern",
    label: "Laying Pattern",
    category: "Finishes",
    options: ["Stretcher bond (standard)", "Herringbone", "Basket weave", "Random / mixed pattern"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Herringbone", value: 1.15 },
      { type: "multiplier", matchAnswer: "Random / mixed pattern", value: 1.2 },
    ],
  },
  {
    id: "paving_edging",
    label: "Edge Restraint",
    category: "Structure",
    options: ["Concealed edge restraint", "Concrete edge kerb", "Raised garden edge", "No edging required"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Concrete edge kerb", stage: { name: "Concrete edge kerb", description: "Concrete edge kerbing to paved area perimeter", trade: "Concrete", unitRate: 35, unitType: "linear", durationDays: 1, code: "AS 3727", order: 25 } },
    ],
  },
  {
    id: "paving_drainage",
    label: "Drainage",
    category: "Drainage",
    options: ["Surface fall only — no drain", "Strip drain / channel drain", "Ag-drain system"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Strip drain / channel drain", stage: { name: "Channel drain installation", description: "Stainless steel or poly channel drain — supply, install and connect to stormwater", trade: "Plumbing", unitRate: 85, unitType: "linear", durationDays: 1, code: "AS/NZS 3500.3", order: 30 } },
      { type: "add_stage", matchAnswer: "Ag-drain system", stage: { name: "Agricultural drain system", description: "Ag-drain with geofabric sock, gravel bed and connection to stormwater", trade: "Plumbing", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS/NZS 3500.3", order: 30 } },
    ],
  },
];

export const paving: WorkCategory = {
  id: "paving",
  label: "Paving & Driveways",
  description: "Clay, concrete, stone and porcelain paving for paths, patios and driveways",
  icon: "🧱",
  trades: ["Site Prep", "Excavation", "Concrete", "Paving", "Plumbing", "Cleaning"],
  stages: [
    { name: "Site preparation & set-out", description: "Mark out paving area, establish levels and falls", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Excavation & disposal", description: "Excavate to design depth and dispose of spoil", trade: "Excavation", unitRate: 25, unitType: "area", durationDays: 1, code: "AS 3798", order: 15 },
    { name: "Base preparation — road base", description: "Supply, spread and compact crushed rock road base — 100mm depth", trade: "Excavation", unitRate: 22, unitType: "area", durationDays: 1, code: "AS 3798", order: 20 },
    { name: "Sand bed", description: "Screeded sand bedding layer — 30mm depth", trade: "Paving", unitRate: 12, unitType: "area", durationDays: 1, code: "AS 3727", order: 30 },
    { name: "Paver laying", description: "Paver supply and laying in specified pattern", trade: "Paving", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 3727", order: 40 },
    { name: "Edge restraint", description: "Concealed plastic edge restraint with stakes", trade: "Paving", unitRate: 12, unitType: "linear", durationDays: 1, code: "AS 3727", order: 45 },
    { name: "Joint sand & compaction", description: "Sweep joint sand, compact with plate compactor and final sweep", trade: "Paving", unitRate: 8, unitType: "area", durationDays: 1, code: "AS 3727", order: 50 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...PAVING_QUESTIONS],
};
