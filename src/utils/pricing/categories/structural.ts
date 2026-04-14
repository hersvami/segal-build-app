import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const STRUCTURAL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "structural_type",
    label: "Structural Work Type",
    category: "Structural",
    options: ["Load-bearing wall removal", "New opening / lintel", "Underpinning", "Retaining wall", "Extension footings"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Underpinning", value: 1.5 },
      { type: "multiplier", matchAnswer: "Extension footings", value: 1.3 },
    ],
  },
  {
    id: "concrete_type",
    label: "Concrete / Slab Work",
    category: "Structural",
    options: ["Not required", "New concrete slab", "Slab repair / levelling", "Concrete stumps"],
    costEffect: [
      { type: "add_stage", matchAnswer: "New concrete slab", stage: { name: "Concrete slab — new pour", description: "New concrete slab including formwork, mesh and pour", trade: "Concrete", unitRate: 220, unitType: "area", durationDays: 3, code: "AS 3600", order: 45 } },
      { type: "add_stage", matchAnswer: "Slab repair / levelling", stage: { name: "Slab repair & levelling", description: "Concrete slab repair and levelling compound", trade: "Concrete", unitRate: 80, unitType: "area", durationDays: 2, code: "AS 3600", order: 45 } },
    ],
  },
  {
    id: "permit_required",
    label: "Building Permit",
    category: "Compliance",
    options: ["Not required", "Building permit required", "Planning permit required"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Building permit required", stage: { name: "Building permit application", description: "Prepare and lodge building permit application with RBS", trade: "Administration", unitRate: 1800, unitType: "allow", durationDays: 5, code: "Building Act 1993 (Vic)", order: 5, isFixed: true } },
      { type: "add_stage", matchAnswer: "Planning permit required", stage: { name: "Planning permit application", description: "Prepare and lodge planning permit with local council", trade: "Administration", unitRate: 3500, unitType: "allow", durationDays: 10, code: "Planning & Environment Act 1987", order: 3, isFixed: true } },
    ],
  },
];

export const structural: WorkCategory = {
  id: "structural",
  label: "Structural",
  description: "Wall removal, underpinning, retaining walls, extensions, slabs",
  icon: "🏗️",
  trades: ["Site Prep", "Engineering", "Demolition", "Concrete", "Structural", "Carpentry", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Site setup, propping, temporary support and protection", trade: "Site Prep", unitRate: 650, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Structural engineering", description: "Structural engineer engagement — design, calculations and certification", trade: "Engineering", unitRate: 2500, unitType: "allow", durationDays: 2, code: "AS 1170", order: 15, isFixed: true },
    { name: "Demolition & removal", description: "Controlled demolition, propping, removal and disposal", trade: "Demolition", unitRate: 75, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
    { name: "Concrete & footings", description: "Concrete works — footings, piers or slab as required", trade: "Concrete", unitRate: 180, unitType: "area", durationDays: 3, code: "AS 3600", order: 40 },
    { name: "Steel / timber beam install", description: "Structural beam supply and install — steel or LVL", trade: "Structural", unitRate: 220, unitType: "area", durationDays: 3, code: "AS 1684 / AS 4100", order: 50 },
    { name: "Framing & carpentry", description: "Wall framing, ceiling joists, noggings and bracing", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 3, code: "AS 1684", order: 60 },
    { name: "Plasterboard & finishing", description: "Plasterboard lining, set, stop and finish", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 70 },
    { name: "Painting", description: "Prep, prime and two-coat paint system", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean and practical completion", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...STRUCTURAL_QUESTIONS],
};
