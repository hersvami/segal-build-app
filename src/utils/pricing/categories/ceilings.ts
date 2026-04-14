import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const CEILING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "ceiling_type",
    label: "Ceiling Type",
    category: "Structure",
    options: ["Flat plasterboard ceiling", "Raking / cathedral ceiling", "Bulkhead / drop ceiling", "Exposed timber / feature ceiling"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Raking / cathedral ceiling", value: 1.35 },
      { type: "multiplier", matchAnswer: "Bulkhead / drop ceiling", value: 1.2 },
      { type: "multiplier", matchAnswer: "Exposed timber / feature ceiling", value: 1.5 },
    ],
  },
  {
    id: "ceiling_existing_condition",
    label: "Existing Ceiling Condition",
    category: "Demolition",
    options: ["Patch & repair only", "Overlay existing", "Full removal & replace"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full removal & replace", value: 1.3 },
      { type: "add_stage", matchAnswer: "Full removal & replace", stage: { name: "Ceiling demolition & removal", description: "Remove existing ceiling lining, battens and dispose", trade: "Demolition", unitRate: 25, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 } },
    ],
  },
  {
    id: "ceiling_insulation",
    label: "Ceiling Insulation",
    category: "Insulation",
    options: ["Existing — adequate", "R3.5 batts", "R4.0 batts", "R5.0 batts (high performance)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "R3.5 batts", stage: { name: "Ceiling insulation — R3.5", description: "R3.5 ceiling insulation batts supply and install", trade: "Insulation", unitRate: 12, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 55 } },
      { type: "add_stage", matchAnswer: "R4.0 batts", stage: { name: "Ceiling insulation — R4.0", description: "R4.0 ceiling insulation batts supply and install", trade: "Insulation", unitRate: 16, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 55 } },
      { type: "add_stage", matchAnswer: "R5.0 batts (high performance)", stage: { name: "Ceiling insulation — R5.0", description: "R5.0 high-performance ceiling insulation batts supply and install", trade: "Insulation", unitRate: 22, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 55 } },
    ],
  },
  {
    id: "ceiling_cornice",
    label: "Cornice / Cove",
    category: "Finishes",
    options: ["No cornice", "Standard 55mm cove", "90mm decorative cornice", "Custom profile cornice"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard 55mm cove", stage: { name: "Cornice — standard 55mm cove", description: "55mm plaster cove cornice supply, install and finish", trade: "Plastering", unitRate: 12, unitType: "linear", durationDays: 1, code: "AS/NZS 2589", order: 75 } },
      { type: "add_stage", matchAnswer: "90mm decorative cornice", stage: { name: "Cornice — 90mm decorative", description: "90mm decorative plaster cornice supply, install and finish", trade: "Plastering", unitRate: 18, unitType: "linear", durationDays: 1, code: "AS/NZS 2589", order: 75 } },
      { type: "add_stage", matchAnswer: "Custom profile cornice", stage: { name: "Cornice — custom profile", description: "Custom profile cornice — measure, supply, install and finish", trade: "Plastering", unitRate: 35, unitType: "linear", durationDays: 2, code: "AS/NZS 2589", order: 75 } },
    ],
  },
  {
    id: "ceiling_lighting",
    label: "Lighting Provision",
    category: "Electrical",
    options: ["No lighting changes", "Downlight installation", "Feature pendant / chandelier prep", "LED strip / indirect lighting"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Downlight installation", stage: { name: "Downlight rough-in", description: "Cut holes, cable and install downlight fittings", trade: "Electrical Fit-Off", unitRate: 85, unitType: "item", durationDays: 1, code: "AS/NZS 3000", order: 180 } },
      { type: "add_stage", matchAnswer: "Feature pendant / chandelier prep", stage: { name: "Feature lighting provision", description: "Structural support and electrical provision for pendant/chandelier", trade: "Electrical Fit-Off", unitRate: 350, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "LED strip / indirect lighting", stage: { name: "LED strip indirect lighting", description: "LED strip lighting with driver, dimmer and shadow-line install", trade: "Electrical Fit-Off", unitRate: 65, unitType: "linear", durationDays: 1, code: "AS/NZS 3000", order: 180 } },
    ],
  },
];

export const ceilings: WorkCategory = {
  id: "ceilings",
  label: "Ceilings & Cornices",
  description: "Plasterboard ceilings, bulkheads, raking ceilings, cornices and ceiling repairs",
  icon: "🏠",
  trades: ["Site Prep", "Demolition", "Carpentry", "Insulation", "Plastering", "Electrical Fit-Off", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Floor protection, dust barriers, furniture covering", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Ceiling battens / framing", description: "Install ceiling battens or furring channels to receive plasterboard", trade: "Carpentry", unitRate: 28, unitType: "area", durationDays: 1, code: "AS 1684", order: 50 },
    { name: "Plasterboard ceiling lining", description: "Plasterboard ceiling lining — fix, set, stop and finish to Level 4", trade: "Plastering", unitRate: 48, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 70 },
    { name: "Painting — ceiling", description: "Prep, prime and two-coat ceiling white paint system", trade: "Painting", unitRate: 18, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean — dust removal and surface wipe", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...CEILING_QUESTIONS],
};
