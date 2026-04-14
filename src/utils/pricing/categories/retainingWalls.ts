import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const RETAINING_WALL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "retaining_type",
    label: "Retaining Wall Type",
    category: "Structure",
    options: ["Timber sleeper wall", "Concrete block (Besser)", "Reinforced concrete", "Rock / stone wall", "Gabion basket wall"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Reinforced concrete", value: 1.4 },
      { type: "multiplier", matchAnswer: "Rock / stone wall", value: 1.5 },
      { type: "multiplier", matchAnswer: "Gabion basket wall", value: 1.2 },
    ],
  },
  {
    id: "retaining_height",
    label: "Wall Height",
    category: "Dimensions",
    options: ["Under 600mm", "600mm to 1.0m", "1.0m to 1.5m", "Over 1.5m (engineer required)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Under 600mm", value: 0.6 },
      { type: "multiplier", matchAnswer: "1.0m to 1.5m", value: 1.3 },
      { type: "multiplier", matchAnswer: "Over 1.5m (engineer required)", value: 1.6 },
      { type: "add_stage", matchAnswer: "Over 1.5m (engineer required)", stage: { name: "Structural engineering — retaining wall", description: "Structural engineer design and certification for retaining wall over 1.5m", trade: "Engineering", unitRate: 2800, unitType: "allow", durationDays: 3, code: "AS 4678", order: 5, isFixed: true } },
    ],
  },
  {
    id: "retaining_drainage",
    label: "Drainage Behind Wall",
    category: "Drainage",
    options: ["Standard ag-drain", "No drainage required", "Complex drainage — stormwater connection"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Complex drainage — stormwater connection", stage: { name: "Stormwater drainage connection", description: "Connect retaining wall drainage to stormwater system including pits", trade: "Plumbing", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500.3", order: 55, isFixed: true } },
    ],
  },
  {
    id: "retaining_existing_removal",
    label: "Existing Wall Removal",
    category: "Demolition",
    options: ["No existing wall", "Remove existing timber wall", "Remove existing concrete/masonry wall"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Remove existing timber wall", stage: { name: "Demolish existing timber retaining wall", description: "Remove and dispose existing timber sleeper retaining wall", trade: "Demolition", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS 2601", order: 15 } },
      { type: "add_stage", matchAnswer: "Remove existing concrete/masonry wall", stage: { name: "Demolish existing masonry retaining wall", description: "Remove and dispose existing concrete/masonry retaining wall — saw cut and machine removal", trade: "Demolition", unitRate: 120, unitType: "linear", durationDays: 2, code: "AS 2601", order: 15 } },
    ],
  },
];

export const retainingWalls: WorkCategory = {
  id: "retaining_walls",
  label: "Retaining Walls",
  description: "Timber, concrete, block and stone retaining walls including drainage",
  icon: "🧱",
  trades: ["Engineering", "Excavation", "Concrete", "Carpentry", "Plumbing", "Cleaning"],
  stages: [
    { name: "Site setup & set-out", description: "Site setup, survey set-out and excavation marking", trade: "Excavation", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Excavation for footing", description: "Excavate footing trench for retaining wall base", trade: "Excavation", unitRate: 65, unitType: "linear", durationDays: 1, code: "AS 4678", order: 20 },
    { name: "Compaction & base prep", description: "Compact trench base and lay compacted road base", trade: "Excavation", unitRate: 25, unitType: "linear", durationDays: 1, code: "AS 3798", order: 25 },
    { name: "Formwork to footing", description: "Formwork to retaining wall strip footing", trade: "Concrete", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS 3600", order: 30 },
    { name: "Steel reinforcement", description: "Steel reinforcement to footing and wall per engineer detail", trade: "Concrete", unitRate: 55, unitType: "linear", durationDays: 1, code: "AS 3600", order: 35 },
    { name: "Concrete pour — footing", description: "Concrete supply and pour to strip footing — 25MPa min", trade: "Concrete", unitRate: 85, unitType: "linear", durationDays: 1, code: "AS 3600", order: 40 },
    { name: "Wall construction", description: "Retaining wall construction — sleepers/blocks/concrete per specification", trade: "Concrete", unitRate: 180, unitType: "linear", durationDays: 2, code: "AS 3700", order: 50 },
    { name: "Ag-drain & geofabric", description: "Agricultural drain and geotextile fabric behind wall for drainage", trade: "Plumbing", unitRate: 35, unitType: "linear", durationDays: 1, code: "AS/NZS 3500.3", order: 55 },
    { name: "Backfill & compaction", description: "Backfill behind wall with free-draining gravel and compact", trade: "Excavation", unitRate: 40, unitType: "linear", durationDays: 1, code: "AS 3798", order: 60 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...RETAINING_WALL_QUESTIONS],
};
