import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const BRICKWORK_QUESTIONS: ScopeQuestion[] = [
  {
    id: "brick_scope",
    label: "Brickwork Scope",
    category: "Masonry",
    options: ["Brick repair / repointing", "New brick wall", "Block wall construction", "Stone cladding / veneer"],
    costEffect: [
      { type: "multiplier", matchAnswer: "New brick wall", value: 1.3 },
      { type: "multiplier", matchAnswer: "Stone cladding / veneer", value: 1.6 },
    ],
  },
  {
    id: "brick_type",
    label: "Brick/Block Type",
    category: "Masonry",
    options: ["Standard clay brick", "Recycled / second-hand brick", "Besser block", "Hebel block", "Natural stone"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Recycled / second-hand brick", value: 1.15 },
      { type: "multiplier", matchAnswer: "Hebel block", value: 1.1 },
      { type: "multiplier", matchAnswer: "Natural stone", value: 1.8 },
    ],
  },
  {
    id: "render_finish",
    label: "Render / Finish",
    category: "Finishes",
    options: ["Face brick (no render)", "Cement render", "Acrylic render", "Bagged finish"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Cement render", stage: { name: "Cement render", description: "Cement render to brick/block walls — scratch coat and finish coat", trade: "Rendering", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 3700", order: 140 } },
      { type: "add_stage", matchAnswer: "Acrylic render", stage: { name: "Acrylic render", description: "Acrylic textured render system to walls", trade: "Rendering", unitRate: 70, unitType: "area", durationDays: 2, code: "AS 3700", order: 140 } },
      { type: "add_stage", matchAnswer: "Bagged finish", stage: { name: "Bagged brick finish", description: "Bag and paint brickwork", trade: "Rendering", unitRate: 40, unitType: "area", durationDays: 1, code: "NCC 2022", order: 140 } },
    ],
  },
];

export const brickwork: WorkCategory = {
  id: "brickwork",
  label: "Brickwork & Masonry",
  description: "Brick repair, repointing, block walls, stone cladding, rendering",
  icon: "🧱",
  trades: ["Site Prep", "Excavation", "Concrete", "Bricklaying", "Rendering", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Site setup, scaffold/access, protect surrounds", trade: "Site Prep", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Excavation & footings", description: "Excavate for footings, form and pour", trade: "Excavation", unitRate: 120, unitType: "area", durationDays: 2, code: "AS 3600", order: 20 },
    { name: "Concrete footings", description: "Concrete footings with reinforcement mesh", trade: "Concrete", unitRate: 180, unitType: "area", durationDays: 2, code: "AS 3600", order: 30 },
    { name: "Bricklaying / blockwork", description: "Lay bricks or blocks — mortar, ties and lintels as required", trade: "Bricklaying", unitRate: 150, unitType: "area", durationDays: 4, code: "AS 3700", order: 60 },
    { name: "Lintels & structural elements", description: "Supply and install steel lintels over openings", trade: "Bricklaying", unitRate: 350, unitType: "allow", durationDays: 1, code: "AS 3700", order: 70, isFixed: true },
    { name: "Clean & finish", description: "Clean mortar joints, acid wash and finish", trade: "Bricklaying", unitRate: 20, unitType: "area", durationDays: 1, code: "AS 3700", order: 180 },
    { name: "Builder's clean", description: "Remove debris and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...BRICKWORK_QUESTIONS],
};
