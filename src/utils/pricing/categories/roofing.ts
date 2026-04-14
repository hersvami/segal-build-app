import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const ROOFING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "roof_scope",
    label: "Roof Work Scope",
    category: "Roofing",
    options: ["Repairs & patching", "Partial re-roof (one section)", "Full re-roof", "New roof (extension)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full re-roof", value: 1.3 },
      { type: "multiplier", matchAnswer: "Partial re-roof (one section)", value: 1.1 },
      { type: "multiplier", matchAnswer: "New roof (extension)", value: 1.4 },
    ],
  },
  {
    id: "roof_material",
    label: "Roofing Material",
    category: "Roofing",
    options: ["Colorbond steel", "Concrete tiles", "Terracotta tiles", "Slate"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Terracotta tiles", value: 1.2 },
      { type: "multiplier", matchAnswer: "Slate", value: 1.5 },
    ],
  },
  {
    id: "guttering_scope",
    label: "Guttering & Downpipes",
    category: "Roofing",
    options: ["Not required", "Replace guttering only", "Full gutter & downpipe replacement"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Replace guttering only", stage: { name: "Gutter replacement", description: "Remove and replace guttering", trade: "Guttering", unitRate: 35, unitType: "area", durationDays: 1, code: "AS/NZS 3500.3", order: 155 } },
      { type: "add_stage", matchAnswer: "Full gutter & downpipe replacement", stage: { name: "Gutter & downpipe replacement", description: "Full gutter and downpipe removal and replacement", trade: "Guttering", unitRate: 55, unitType: "area", durationDays: 2, code: "AS/NZS 3500.3", order: 155 } },
    ],
  },
];

export const roofing: WorkCategory = {
  id: "roofing",
  label: "Roofing",
  description: "Roof repairs, re-roofing, guttering, fascia, insulation",
  icon: "🏠",
  trades: ["Site Prep", "Scaffolding", "Roofing", "Guttering", "Carpentry", "Insulation", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Site setup, ground protection", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Scaffolding", description: "Scaffolding erect, hire and dismantle", trade: "Scaffolding", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 12, isFixed: true },
    { name: "Strip existing roofing", description: "Remove existing roof sheets/tiles, battens and sarking", trade: "Roofing", unitRate: 35, unitType: "area", durationDays: 2, code: "AS 1562", order: 20 },
    { name: "Fascia & barge board", description: "Replace or repair fascia and barge boards", trade: "Carpentry", unitRate: 30, unitType: "area", durationDays: 1, code: "AS 1684", order: 50 },
    { name: "Insulation & sarking", description: "Roof insulation and sarking to NCC requirements", trade: "Insulation", unitRate: 30, unitType: "area", durationDays: 1, code: "NCC 2022 Vol 2 Part 3.12", order: 60 },
    { name: "New roof sheeting / tiles", description: "Roof sheeting or tile supply and install including flashings", trade: "Roofing", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1562", order: 100 },
    { name: "Guttering & downpipes", description: "Gutter and downpipe supply and install", trade: "Guttering", unitRate: 45, unitType: "area", durationDays: 1, code: "AS/NZS 3500.3", order: 150 },
    { name: "Builder's clean", description: "Builder's clean — remove debris from site and roof", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...ROOFING_QUESTIONS],
};
