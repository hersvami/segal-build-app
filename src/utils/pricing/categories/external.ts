import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const EXTERNAL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "deck_material",
    label: "Decking Material",
    category: "Carpentry",
    options: ["Merbau hardwood", "Treated pine", "Composite (ModWood etc.)", "Spotted gum"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Composite (ModWood etc.)", value: 1.25 },
      { type: "multiplier", matchAnswer: "Spotted gum", value: 1.3 },
    ],
  },
  {
    id: "balustrade",
    label: "Balustrade / Railing",
    category: "Carpentry",
    options: ["Not required", "Timber balustrade", "Glass balustrade", "Wire balustrade"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Timber balustrade", stage: { name: "Timber balustrade", description: "Timber balustrade supply and install to AS 1170", trade: "Carpentry", unitRate: 320, unitType: "allow", durationDays: 1, code: "AS 1170", order: 160, isFixed: true } },
      { type: "add_stage", matchAnswer: "Glass balustrade", stage: { name: "Glass balustrade", description: "Toughened glass balustrade supply and install", trade: "Glazing", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS 1288", order: 160, isFixed: true } },
      { type: "add_stage", matchAnswer: "Wire balustrade", stage: { name: "Wire balustrade", description: "Stainless wire balustrade supply and install", trade: "Carpentry", unitRate: 480, unitType: "allow", durationDays: 1, code: "AS 1170", order: 160, isFixed: true } },
    ],
  },
  {
    id: "pergola_type",
    label: "Pergola / Shade Structure",
    category: "Carpentry",
    options: ["Not required", "Timber pergola — open", "Insulated patio roof", "Retractable awning"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Timber pergola — open", stage: { name: "Timber pergola", description: "Timber pergola frame — posts, beams and rafters", trade: "Carpentry", unitRate: 280, unitType: "area", durationDays: 3, code: "AS 1684", order: 110 } },
      { type: "add_stage", matchAnswer: "Insulated patio roof", stage: { name: "Insulated patio roof", description: "Insulated panel patio roof — steel frame, supply and install", trade: "Roofing", unitRate: 380, unitType: "area", durationDays: 3, code: "AS 1562", order: 110 } },
      { type: "add_stage", matchAnswer: "Retractable awning", stage: { name: "Retractable awning", description: "Motorised retractable awning supply and install", trade: "Awning", unitRate: 3500, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 110, isFixed: true } },
    ],
  },
];

export const external: WorkCategory = {
  id: "external",
  label: "External / Outdoor",
  description: "Decking, pergolas, carports, fencing, landscaping, retaining walls",
  icon: "🏡",
  trades: ["Site Prep", "Site Works", "Concrete", "Carpentry", "Decking", "Landscaping", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Site clearance, set out and temporary services", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Earthworks & site works", description: "Excavation, levelling and compaction", trade: "Site Works", unitRate: 65, unitType: "area", durationDays: 2, code: "NCC 2022", order: 20 },
    { name: "Concrete footings & piers", description: "Concrete footings, piers and bearer supports", trade: "Concrete", unitRate: 140, unitType: "area", durationDays: 2, code: "AS 3600", order: 40 },
    { name: "Framing — bearers & joists", description: "Structural framing — bearers, joists and bracing", trade: "Carpentry", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1684", order: 60 },
    { name: "Decking boards", description: "Deck board supply, install, fix and finish", trade: "Decking", unitRate: 280, unitType: "area", durationDays: 3, code: "AS 1684", order: 100 },
    { name: "Painting / oiling", description: "Deck oil or stain — 2 coat application", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Landscaping & surrounds", description: "Garden beds, paths, turf and surrounds", trade: "Landscaping", unitRate: 60, unitType: "area", durationDays: 2, code: "NCC 2022", order: 200 },
    { name: "Builder's clean", description: "Builder's clean and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...EXTERNAL_QUESTIONS],
};
