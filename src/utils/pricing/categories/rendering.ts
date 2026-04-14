import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const RENDERING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "render_type",
    label: "Render / Cladding Type",
    category: "Materials",
    options: ["Cement render — sand finish", "Acrylic render — textured", "Bagged brickwork", "Weatherboard / timber cladding", "James Hardie fibre cement", "Foam panel render system (EPS)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Acrylic render — textured", value: 1.2 },
      { type: "multiplier", matchAnswer: "Weatherboard / timber cladding", value: 1.35 },
      { type: "multiplier", matchAnswer: "Foam panel render system (EPS)", value: 1.5 },
    ],
  },
  {
    id: "render_scope",
    label: "Render Scope",
    category: "Scope",
    options: ["Full house external render", "One elevation / wall only", "Patch repair / crack repair", "Re-render over existing"],
    costEffect: [
      { type: "multiplier", matchAnswer: "One elevation / wall only", value: 0.4 },
      { type: "multiplier", matchAnswer: "Patch repair / crack repair", value: 0.25 },
      { type: "multiplier", matchAnswer: "Re-render over existing", value: 1.15 },
    ],
  },
  {
    id: "render_existing",
    label: "Existing Surface",
    category: "Preparation",
    options: ["New plasterboard/blueboard", "Existing rendered surface", "Exposed brickwork", "Existing weatherboard (remove & re-clad)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Existing rendered surface", value: 1.1 },
      { type: "add_stage", matchAnswer: "Existing weatherboard (remove & re-clad)", stage: { name: "Remove existing weatherboards", description: "Remove existing weatherboard cladding and dispose", trade: "Demolition", unitRate: 25, unitType: "area", durationDays: 2, code: "AS 2601", order: 15 } },
    ],
  },
  {
    id: "render_colour",
    label: "Colour Finish",
    category: "Finishes",
    options: ["Paint over render (standard)", "Integral colour render (no painting)", "Multi-colour / feature bands"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Integral colour render (no painting)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Multi-colour / feature bands", value: 1.25 },
    ],
  },
];

export const rendering: WorkCategory = {
  id: "rendering",
  label: "Rendering & Cladding",
  description: "Cement render, acrylic render, weatherboard, fibre cement and external cladding",
  icon: "🔇",
  trades: ["Scaffolding", "Demolition", "Rendering", "Painting", "Cleaning"],
  stages: [
    { name: "Scaffold erection", description: "Scaffold erection for safe access to external walls", trade: "Scaffolding", unitRate: 28, unitType: "area", durationDays: 1, code: "AS/NZS 1576", order: 10 },
    { name: "Surface preparation", description: "Clean, key and prepare surface for render application — bonding agent", trade: "Rendering", unitRate: 12, unitType: "area", durationDays: 1, code: "AS 3700", order: 20 },
    { name: "Control joints & beading", description: "Install control joint beads, stop beads and corner beads", trade: "Rendering", unitRate: 8, unitType: "linear", durationDays: 1, code: "AS 3700", order: 25 },
    { name: "Render coat — scratch/base", description: "Apply scratch coat / base coat render — 10mm thickness", trade: "Rendering", unitRate: 35, unitType: "area", durationDays: 2, code: "AS 3700", order: 30 },
    { name: "Render coat — top/finish", description: "Apply finish coat render — sand, texture or bagged finish", trade: "Rendering", unitRate: 28, unitType: "area", durationDays: 2, code: "AS 3700", order: 40 },
    { name: "External painting", description: "External paint system — prime, undercoat and two top coats", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 60 },
    { name: "Scaffold dismantle", description: "Dismantle and remove scaffolding", trade: "Scaffolding", unitRate: 12, unitType: "area", durationDays: 1, code: "AS/NZS 1576", order: 220 },
    { name: "Builder's clean", description: "Builder's clean — render debris, scaffold marks and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...RENDERING_QUESTIONS],
};
