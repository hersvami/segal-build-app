import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const CONCRETING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "concrete_type",
    label: "Concrete Work Type",
    category: "Structure",
    options: ["Slab on ground", "Driveway / crossover", "Footpath / garden path", "Shed slab", "Pool surrounds"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Driveway / crossover", value: 1.15 },
      { type: "multiplier", matchAnswer: "Pool surrounds", value: 1.2 },
    ],
  },
  {
    id: "concrete_finish",
    label: "Concrete Finish",
    category: "Finishes",
    options: ["Standard broom finish", "Exposed aggregate", "Honed / polished", "Coloured concrete", "Stencilled / stamped"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Exposed aggregate", value: 1.3 },
      { type: "multiplier", matchAnswer: "Honed / polished", value: 1.5 },
      { type: "multiplier", matchAnswer: "Coloured concrete", value: 1.2 },
      { type: "multiplier", matchAnswer: "Stencilled / stamped", value: 1.35 },
    ],
  },
  {
    id: "concrete_thickness",
    label: "Slab Thickness",
    category: "Structure",
    options: ["75mm (paths)", "100mm (standard)", "125mm (vehicle traffic)", "150mm+ (heavy duty)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "75mm (paths)", value: 0.85 },
      { type: "multiplier", matchAnswer: "125mm (vehicle traffic)", value: 1.15 },
      { type: "multiplier", matchAnswer: "150mm+ (heavy duty)", value: 1.3 },
    ],
  },
  {
    id: "concrete_reinforcement",
    label: "Reinforcement",
    category: "Structure",
    options: ["SL72 mesh (standard)", "SL82 mesh (medium)", "SL92 mesh (heavy)", "Reo bar per engineer spec"],
    costEffect: [
      { type: "multiplier", matchAnswer: "SL82 mesh (medium)", value: 1.08 },
      { type: "multiplier", matchAnswer: "SL92 mesh (heavy)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Reo bar per engineer spec", value: 1.25 },
    ],
  },
  {
    id: "concrete_existing",
    label: "Existing Concrete Removal",
    category: "Demolition",
    options: ["No existing concrete", "Remove existing concrete — thin (under 100mm)", "Remove existing concrete — thick (100mm+)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Remove existing concrete — thin (under 100mm)", stage: { name: "Concrete demolition — thin", description: "Remove existing thin concrete, break up and dispose to tip", trade: "Demolition", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 2601", order: 12 } },
      { type: "add_stage", matchAnswer: "Remove existing concrete — thick (100mm+)", stage: { name: "Concrete demolition — thick", description: "Saw cut, remove existing thick concrete slab, break up and dispose", trade: "Demolition", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 2601", order: 12 } },
    ],
  },
];

export const concreting: WorkCategory = {
  id: "concreting",
  label: "Concreting",
  description: "Concrete slabs, paths, footings, driveways and crossovers",
  icon: "🧱",
  trades: ["Site Prep", "Excavation", "Concrete", "Cleaning"],
  stages: [
    { name: "Site preparation & set-out", description: "Mark out concrete area, establish levels, falls and string lines", trade: "Site Prep", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Excavation & base prep", description: "Excavate to design depth, compact subgrade and install road base", trade: "Excavation", unitRate: 28, unitType: "area", durationDays: 1, code: "AS 3798", order: 15 },
    { name: "Formwork", description: "Timber or steel formwork to edges, construction joints and step-downs", trade: "Concrete", unitRate: 25, unitType: "linear", durationDays: 1, code: "AS 3600", order: 20 },
    { name: "Vapour barrier", description: "200um polyethylene vapour barrier under slab", trade: "Concrete", unitRate: 5, unitType: "area", durationDays: 1, code: "AS 2870", order: 25 },
    { name: "Steel mesh reinforcement", description: "Steel reinforcement mesh — supply, cut, tie and place on chairs", trade: "Concrete", unitRate: 15, unitType: "area", durationDays: 1, code: "AS 3600", order: 30 },
    { name: "Concrete supply & pour", description: "Concrete supply, pump (if required), pour, screed and finish — 25MPa", trade: "Concrete", unitRate: 55, unitType: "area", durationDays: 1, code: "AS 3600", order: 40 },
    { name: "Control joints", description: "Saw cut or tooled control joints at specified centres", trade: "Concrete", unitRate: 8, unitType: "linear", durationDays: 1, code: "AS 3600", order: 50 },
    { name: "Curing", description: "Apply curing compound or water cure for minimum 7 days", trade: "Concrete", unitRate: 5, unitType: "area", durationDays: 1, code: "AS 3600", order: 55 },
    { name: "Formwork strip & clean", description: "Strip formwork, backfill edges and clean up", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...CONCRETING_QUESTIONS],
};
