import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const GUTTERS_QUESTIONS: ScopeQuestion[] = [
  {
    id: "gutter_scope",
    label: "Work Scope",
    category: "Roofing",
    options: ["Gutter replacement only", "Fascia replacement only", "Gutter + fascia replacement", "Gutter + fascia + downpipes", "Full roof drainage system"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Fascia replacement only", value: 0.75 },
      { type: "multiplier", matchAnswer: "Gutter + fascia replacement", value: 1.3 },
      { type: "multiplier", matchAnswer: "Gutter + fascia + downpipes", value: 1.5 },
      { type: "multiplier", matchAnswer: "Full roof drainage system", value: 1.8 },
    ],
  },
  {
    id: "gutter_profile",
    label: "Gutter Profile",
    category: "Materials",
    options: ["Quad gutter (standard)", "Half-round gutter", "OG gutter (heritage profile)", "Box gutter (concealed)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Half-round gutter", value: 1.1 },
      { type: "multiplier", matchAnswer: "OG gutter (heritage profile)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Box gutter (concealed)", value: 1.4 },
    ],
  },
  {
    id: "gutter_material",
    label: "Material",
    category: "Materials",
    options: ["Colorbond steel", "Zincalume", "Copper", "Stainless steel"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Copper", value: 2.5 },
      { type: "multiplier", matchAnswer: "Stainless steel", value: 1.8 },
    ],
  },
  {
    id: "gutter_guard",
    label: "Gutter Guard",
    category: "Accessories",
    options: ["No gutter guard", "Standard mesh guard", "Premium leaf guard system"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard mesh guard", stage: { name: "Gutter guard — standard mesh", description: "Standard gutter mesh guard — supply and install", trade: "Roofing", unitRate: 22, unitType: "linear", durationDays: 1, code: "NCC 2022", order: 55 } },
      { type: "add_stage", matchAnswer: "Premium leaf guard system", stage: { name: "Gutter guard — premium", description: "Premium leaf guard system (Leafbusters/similar) — supply and install", trade: "Roofing", unitRate: 45, unitType: "linear", durationDays: 1, code: "NCC 2022", order: 55 } },
    ],
  },
];

export const guttersFascia: WorkCategory = {
  id: "gutters_fascia",
  label: "Gutters & Fascia",
  description: "Gutter replacement, fascia boards, downpipes and roof drainage",
  icon: "🏠",
  trades: ["Scaffolding", "Demolition", "Carpentry", "Roofing", "Plumbing", "Painting", "Cleaning"],
  stages: [
    { name: "Scaffold / safe access setup", description: "Scaffold or ladder access setup for safe working at height", trade: "Scaffolding", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 10, isFixed: true },
    { name: "Remove existing gutters & fascia", description: "Remove and dispose existing gutters, fascia boards and downpipes", trade: "Demolition", unitRate: 18, unitType: "linear", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Fascia board replacement", description: "New fascia boards — supply and fix (timber or fibre cement)", trade: "Carpentry", unitRate: 35, unitType: "linear", durationDays: 1, code: "NCC 2022", order: 30 },
    { name: "Gutter installation", description: "New gutter — supply, install and join with appropriate brackets", trade: "Roofing", unitRate: 42, unitType: "linear", durationDays: 1, code: "AS/NZS 3500.3", order: 40 },
    { name: "Downpipe installation", description: "New downpipes — supply and install connected to stormwater", trade: "Plumbing", unitRate: 85, unitType: "item", durationDays: 1, code: "AS/NZS 3500.3", order: 45 },
    { name: "Painting — fascia & trim", description: "Paint new fascia boards and trim — prep, prime and two coats", trade: "Painting", unitRate: 18, unitType: "linear", durationDays: 1, code: "AS/NZS 2311", order: 50 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...GUTTERS_QUESTIONS],
};
