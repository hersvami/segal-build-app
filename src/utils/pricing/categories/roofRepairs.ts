import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const ROOF_REPAIR_QUESTIONS: ScopeQuestion[] = [
  {
    id: "roof_repair_type",
    label: "Repair Type",
    category: "Roofing",
    options: ["Leak repair — localised", "Ridge capping replacement", "Valley replacement", "Flashing repair/replacement", "Tile replacement (broken/cracked)", "Gutter / downpipe repair"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Valley replacement", value: 1.3 },
      { type: "multiplier", matchAnswer: "Ridge capping replacement", value: 0.9 },
      { type: "multiplier", matchAnswer: "Tile replacement (broken/cracked)", value: 0.7 },
      { type: "multiplier", matchAnswer: "Gutter / downpipe repair", value: 0.6 },
    ],
  },
  {
    id: "roof_repair_access",
    label: "Roof Access",
    category: "Access",
    options: ["Single storey — easy access", "Double storey — scaffold required", "Steep pitch — safety rail required"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Double storey — scaffold required", stage: { name: "Scaffold erection — roof access", description: "Scaffold erection for safe roof access — double storey", trade: "Scaffolding", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 8, isFixed: true } },
      { type: "add_stage", matchAnswer: "Steep pitch — safety rail required", stage: { name: "Roof safety rail system", description: "Temporary roof safety rail system for steep pitch roof work", trade: "Scaffolding", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 8, isFixed: true } },
    ],
  },
  {
    id: "roof_repair_material",
    label: "Roof Material",
    category: "Materials",
    options: ["Concrete tile", "Terracotta tile", "Colorbond / metal sheet", "Slate", "Asbestos cement (pre-1990)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Terracotta tile", value: 1.15 },
      { type: "multiplier", matchAnswer: "Slate", value: 1.5 },
      { type: "add_stage", matchAnswer: "Asbestos cement (pre-1990)", stage: { name: "Asbestos roof assessment", description: "Licensed asbestos assessment and safe handling plan for roof material", trade: "Asbestos Removal", unitRate: 2500, unitType: "allow", durationDays: 2, code: "Code of Practice (WorkSafe Vic)", order: 5, isFixed: true } },
    ],
  },
  {
    id: "roof_repair_ceiling_damage",
    label: "Ceiling Damage (from leak)",
    category: "Internal",
    options: ["No ceiling damage", "Minor stain — paint repair", "Plasterboard replacement required"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Minor stain — paint repair", stage: { name: "Ceiling stain repair", description: "Seal stain, patch and repaint affected ceiling area", trade: "Painting", unitRate: 350, unitType: "allow", durationDays: 1, code: "AS/NZS 2311", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Plasterboard replacement required", stage: { name: "Ceiling plasterboard repair", description: "Remove damaged plasterboard, replace, set, stop and repaint", trade: "Plastering", unitRate: 850, unitType: "allow", durationDays: 2, code: "AS/NZS 2589", order: 180, isFixed: true } },
    ],
  },
];

export const roofRepairs: WorkCategory = {
  id: "roof_repairs",
  label: "Roofing — Repairs",
  description: "Roof leak repair, flashing, ridge capping, valley and tile replacement",
  icon: "🏠",
  trades: ["Scaffolding", "Roofing", "Plumbing", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Roof inspection & assessment", description: "Thorough roof inspection, identify leak source and document repair scope", trade: "Roofing", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Temporary weatherproofing", description: "Temporary tarp or sealant to prevent further water ingress", trade: "Roofing", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 15, isFixed: true },
    { name: "Flashing repair / replacement", description: "Remove old flashing, supply and install new lead or Colorbond flashing", trade: "Roofing", unitRate: 85, unitType: "linear", durationDays: 1, code: "AS 1562.1", order: 30 },
    { name: "Tile / sheet replacement", description: "Remove damaged tiles/sheets, supply and install matching replacements", trade: "Roofing", unitRate: 65, unitType: "area", durationDays: 1, code: "AS 1562.1", order: 40 },
    { name: "Ridge capping re-bed & re-point", description: "Re-bed and re-point ridge capping with flexible pointing compound", trade: "Roofing", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS 1562.1", order: 50 },
    { name: "Sealant & silicone application", description: "Apply roof sealant and silicone to penetrations and joints", trade: "Roofing", unitRate: 150, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 55, isFixed: true },
    { name: "Builder's clean", description: "Builder's clean — roof debris removal and gutter clean", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...ROOF_REPAIR_QUESTIONS],
};
