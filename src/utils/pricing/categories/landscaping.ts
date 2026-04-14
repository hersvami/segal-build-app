import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const LANDSCAPING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "landscape_scope",
    label: "Landscaping Scope",
    category: "Landscaping",
    options: ["Garden beds & planting", "Full landscape design & install", "Paving / paths", "Driveway", "Retaining walls"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full landscape design & install", value: 1.5 },
      { type: "multiplier", matchAnswer: "Driveway", value: 1.3 },
    ],
  },
  {
    id: "paving_type",
    label: "Paving Material",
    category: "Paving",
    options: ["Not required", "Concrete pavers", "Natural stone", "Exposed aggregate concrete", "Asphalt"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Natural stone", value: 1.5 },
      { type: "multiplier", matchAnswer: "Exposed aggregate concrete", value: 1.2 },
    ],
  },
  {
    id: "retaining_type",
    label: "Retaining Wall Type",
    category: "Structural",
    options: ["Not required", "Timber sleeper wall", "Concrete block wall", "Stone wall", "Concrete crib wall"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Timber sleeper wall", stage: { name: "Timber sleeper retaining wall", description: "Hardwood sleeper retaining wall with drainage", trade: "Landscaping", unitRate: 280, unitType: "area", durationDays: 3, code: "AS 4678", order: 55 } },
      { type: "add_stage", matchAnswer: "Concrete block wall", stage: { name: "Concrete block retaining wall", description: "Concrete block retaining wall with reinforcement and drainage", trade: "Concrete", unitRate: 350, unitType: "area", durationDays: 4, code: "AS 4678", order: 55 } },
      { type: "add_stage", matchAnswer: "Stone wall", stage: { name: "Stone retaining wall", description: "Natural stone retaining wall with drainage", trade: "Stone/Masonry", unitRate: 480, unitType: "area", durationDays: 5, code: "AS 4678", order: 55 } },
    ],
  },
  {
    id: "irrigation",
    label: "Irrigation System",
    category: "Landscaping",
    options: ["Not required", "Basic drip irrigation", "Full automatic irrigation system"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Basic drip irrigation", stage: { name: "Drip irrigation", description: "Drip irrigation system — supply and install", trade: "Plumbing", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 175, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full automatic irrigation system", stage: { name: "Automatic irrigation system", description: "Full automatic irrigation with controller, valves and sprinklers", trade: "Plumbing", unitRate: 2800, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 175, isFixed: true } },
    ],
  },
];

export const landscaping: WorkCategory = {
  id: "landscaping",
  label: "Landscaping & Earthworks",
  description: "Gardens, paving, driveways, retaining walls, turf, drainage",
  icon: "🌿",
  trades: ["Site Prep", "Excavation", "Concrete", "Landscaping", "Plumbing", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Site clearance, tree protection, set out", trade: "Site Prep", unitRate: 500, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Earthworks & excavation", description: "Cut, fill, level and compact", trade: "Excavation", unitRate: 55, unitType: "area", durationDays: 3, code: "NCC 2022", order: 20 },
    { name: "Drainage & stormwater", description: "Ag drains, stormwater pits, connections", trade: "Plumbing", unitRate: 65, unitType: "area", durationDays: 2, code: "AS/NZS 3500.3", order: 35 },
    { name: "Subbase preparation", description: "Crushed rock subbase — spread, level and compact", trade: "Excavation", unitRate: 35, unitType: "area", durationDays: 2, code: "NCC 2022", order: 50 },
    { name: "Paving / concrete works", description: "Paving, paths or concrete flatwork", trade: "Concrete", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 3600", order: 80 },
    { name: "Garden beds & planting", description: "Prepare beds, supply and install plants, mulch", trade: "Landscaping", unitRate: 65, unitType: "area", durationDays: 2, code: "NCC 2022", order: 120 },
    { name: "Turf supply & install", description: "Supply and install turf — prep, lay and water", trade: "Landscaping", unitRate: 25, unitType: "area", durationDays: 1, code: "NCC 2022", order: 150 },
    { name: "Lighting & features", description: "Garden lighting, edging and landscape features", trade: "Electrical", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
    { name: "Builder's clean", description: "Site clean up, remove excess material", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...LANDSCAPING_QUESTIONS],
};
