import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const UNDERPINNING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "underpin_type",
    label: "Foundation Work Type",
    category: "Structure",
    options: ["Underpinning — mass concrete", "Underpinning — resin injection", "Restumping — timber to steel", "Slab repair / crack injection"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Underpinning — resin injection", value: 0.7 },
      { type: "multiplier", matchAnswer: "Restumping — timber to steel", value: 0.85 },
      { type: "multiplier", matchAnswer: "Slab repair / crack injection", value: 0.6 },
    ],
  },
  {
    id: "underpin_extent",
    label: "Extent of Underpinning",
    category: "Structure",
    options: ["Localised — 1-3 piers", "Partial — one wall/side", "Full perimeter underpinning"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Localised — 1-3 piers", value: 0.4 },
      { type: "multiplier", matchAnswer: "Partial — one wall/side", value: 0.65 },
    ],
  },
  {
    id: "underpin_access",
    label: "Sub-Floor Access",
    category: "Access",
    options: ["Good access — 600mm+ clearance", "Limited access — 300-600mm", "Very restricted — under 300mm (robotic bore)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Limited access — 300-600mm", value: 1.2 },
      { type: "multiplier", matchAnswer: "Very restricted — under 300mm (robotic bore)", value: 1.5 },
    ],
  },
  {
    id: "underpin_engineering",
    label: "Geotechnical Report",
    category: "Engineering",
    options: ["Not yet obtained", "Already have geotech report", "Engineer to specify"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Not yet obtained", stage: { name: "Geotechnical investigation", description: "Geotechnical soil investigation, bore holes and report", trade: "Engineering", unitRate: 3500, unitType: "allow", durationDays: 3, code: "AS 1726", order: 5, isFixed: true } },
    ],
  },
  {
    id: "underpin_internal_damage",
    label: "Internal Damage Repairs",
    category: "Repairs",
    options: ["No internal damage", "Minor crack repair (cosmetic)", "Significant crack repair (structural)", "Wall/ceiling replastering required"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Minor crack repair (cosmetic)", stage: { name: "Cosmetic crack repair", description: "Fill and patch cosmetic cracks to walls and ceilings", trade: "Plastering", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 2589", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Significant crack repair (structural)", stage: { name: "Structural crack repair", description: "Structural crack stitching, epoxy injection and repair per engineer specification", trade: "Concrete", unitRate: 2500, unitType: "allow", durationDays: 2, code: "AS 3600", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Wall/ceiling replastering required", stage: { name: "Wall & ceiling replastering", description: "Strip damaged plaster, re-line, set, stop and finish", trade: "Plastering", unitRate: 55, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 185 } },
    ],
  },
];

export const underpinning: WorkCategory = {
  id: "underpinning",
  label: "Underpinning & Foundations",
  description: "Underpinning, restumping, foundation repair, slab crack repair",
  icon: "🏠",
  trades: ["Engineering", "Excavation", "Concrete", "Carpentry", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Engineering design & certification", description: "Structural engineer design, specification and certification for underpinning works", trade: "Engineering", unitRate: 3500, unitType: "allow", durationDays: 5, code: "AS 2159", order: 5, isFixed: true },
    { name: "Site setup & excavation protection", description: "Site setup, temporary propping, excavation safety barriers", trade: "Excavation", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS 4678", order: 10, isFixed: true },
    { name: "Excavation for underpinning piers", description: "Hand or machine excavation to underpin pier depth per engineer spec", trade: "Excavation", unitRate: 850, unitType: "item", durationDays: 1, code: "AS 4678", order: 20 },
    { name: "Formwork to piers", description: "Formwork construction to underpinning piers", trade: "Concrete", unitRate: 350, unitType: "item", durationDays: 1, code: "AS 3600", order: 30 },
    { name: "Steel reinforcement", description: "Steel reinforcement cage fabrication and placement per engineer detail", trade: "Concrete", unitRate: 280, unitType: "item", durationDays: 1, code: "AS 3600", order: 40 },
    { name: "Concrete pour — underpinning piers", description: "Concrete supply and pour to underpinning piers — 32MPa min", trade: "Concrete", unitRate: 650, unitType: "item", durationDays: 1, code: "AS 3600", order: 50 },
    { name: "Backfill & compaction", description: "Backfill excavations with clean fill, compact to 95% MDD", trade: "Excavation", unitRate: 250, unitType: "item", durationDays: 1, code: "AS 3798", order: 60 },
    { name: "Engineer inspection & certification", description: "Structural engineer site inspection and compliance certification", trade: "Engineering", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 2159", order: 150, isFixed: true },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...UNDERPINNING_QUESTIONS],
};
