import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const FLOORING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "flooring_type",
    label: "Flooring Material",
    category: "Flooring",
    options: ["Hybrid / LVP", "Engineered timber", "Solid hardwood", "Carpet", "Tiles"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Solid hardwood", value: 1.4 },
      { type: "multiplier", matchAnswer: "Engineered timber", value: 1.15 },
    ],
  },
  {
    id: "subfloor_prep",
    label: "Subfloor Preparation",
    category: "Flooring",
    options: ["None required", "Levelling compound", "Plywood overlay", "Full subfloor replacement"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Levelling compound", stage: { name: "Floor levelling compound", description: "Self-levelling compound application", trade: "Screed", unitRate: 40, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 72 } },
      { type: "add_stage", matchAnswer: "Plywood overlay", stage: { name: "Plywood overlay", description: "Plywood overlay to existing subfloor", trade: "Carpentry", unitRate: 45, unitType: "area", durationDays: 1, code: "AS 1684", order: 72 } },
      { type: "multiplier", matchAnswer: "Full subfloor replacement", value: 1.5 },
    ],
  },
  {
    id: "skirting",
    label: "Skirting Boards",
    category: "Finishes",
    options: ["Not required", "Replace skirting boards", "New skirting + architraves"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Replace skirting boards", stage: { name: "Skirting board replacement", description: "Remove and replace skirting boards", trade: "Skirting", unitRate: 22, unitType: "area", durationDays: 1, code: "NCC 2022", order: 220 } },
      { type: "add_stage", matchAnswer: "New skirting + architraves", stage: { name: "Skirting & architraves", description: "New skirting boards and architraves — supply and install", trade: "Skirting", unitRate: 35, unitType: "area", durationDays: 1, code: "NCC 2022", order: 220 } },
    ],
  },
];

export const flooring: WorkCategory = {
  id: "flooring",
  label: "Flooring",
  description: "Timber, hybrid, tile, carpet — supply and install",
  icon: "🪵",
  trades: ["Site Prep", "Demolition", "Screed", "Carpentry", "Flooring", "Skirting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Furniture removal, floor protection, dust barriers", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Remove existing floor covering", description: "Strip existing carpet, vinyl or tiles and dispose", trade: "Demolition", unitRate: 20, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Subfloor inspection & prep", description: "Inspect subfloor condition, repair and prepare", trade: "Carpentry", unitRate: 20, unitType: "area", durationDays: 1, code: "AS 1684", order: 40 },
    { name: "Floor covering supply & install", description: "Floor covering — supply, acclimatise and install", trade: "Flooring", unitRate: 95, unitType: "area", durationDays: 2, code: "NCC 2022", order: 100 },
    { name: "Transition strips & thresholds", description: "Transition strips at doorways and material changes", trade: "Flooring", unitRate: 180, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 150, isFixed: true },
    { name: "Builder's clean", description: "Builder's clean — vacuum, wipe and handover", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...FLOORING_QUESTIONS],
};
