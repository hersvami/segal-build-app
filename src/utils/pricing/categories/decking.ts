import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const DECKING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "deck_material",
    label: "Decking Material",
    category: "Materials",
    options: ["Treated pine", "Merbau hardwood", "Spotted gum hardwood", "Composite decking (ModWood/Trex)", "Blackbutt hardwood"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Merbau hardwood", value: 1.3 },
      { type: "multiplier", matchAnswer: "Spotted gum hardwood", value: 1.45 },
      { type: "multiplier", matchAnswer: "Composite decking (ModWood/Trex)", value: 1.35 },
      { type: "multiplier", matchAnswer: "Blackbutt hardwood", value: 1.5 },
    ],
  },
  {
    id: "deck_height",
    label: "Deck Height Above Ground",
    category: "Structure",
    options: ["Ground level — under 200mm", "Low — 200-600mm", "Elevated — 600mm-1.2m", "High — over 1.2m (balustrade required)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Ground level — under 200mm", value: 0.8 },
      { type: "multiplier", matchAnswer: "Elevated — 600mm-1.2m", value: 1.2 },
      { type: "multiplier", matchAnswer: "High — over 1.2m (balustrade required)", value: 1.4 },
      { type: "add_stage", matchAnswer: "High — over 1.2m (balustrade required)", stage: { name: "Balustrade & handrail", description: "Timber or steel balustrade and handrail system per AS 1170", trade: "Carpentry", unitRate: 180, unitType: "linear", durationDays: 2, code: "AS 1170", order: 65 } },
    ],
  },
  {
    id: "deck_subframe",
    label: "Subframe Type",
    category: "Structure",
    options: ["Timber bearers & joists on stumps", "Steel subframe on concrete piers", "Direct fix to slab (battens)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Steel subframe on concrete piers", value: 1.25 },
      { type: "multiplier", matchAnswer: "Direct fix to slab (battens)", value: 0.7 },
    ],
  },
  {
    id: "deck_stairs",
    label: "Deck Stairs",
    category: "Carpentry",
    options: ["Not required", "Short flight (1-4 treads)", "Full flight (5+ treads)", "Wrap-around stairs"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Short flight (1-4 treads)", stage: { name: "Deck stairs — short flight", description: "Short flight timber deck stairs with stringers and treads", trade: "Carpentry", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS 1657", order: 70, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full flight (5+ treads)", stage: { name: "Deck stairs — full flight", description: "Full flight timber deck stairs with stringers, treads and handrail", trade: "Carpentry", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS 1657", order: 70, isFixed: true } },
      { type: "add_stage", matchAnswer: "Wrap-around stairs", stage: { name: "Deck stairs — wrap-around", description: "Wrap-around deck stairs with landing, stringers, treads and balustrade", trade: "Carpentry", unitRate: 4500, unitType: "allow", durationDays: 3, code: "AS 1657", order: 70, isFixed: true } },
    ],
  },
  {
    id: "deck_finish",
    label: "Deck Finish",
    category: "Finishes",
    options: ["Oil finish (natural)", "Stain finish", "Paint finish", "No finish (composite — pre-finished)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Oil finish (natural)", stage: { name: "Deck oiling", description: "Sand and apply two coats of decking oil", trade: "Painting", unitRate: 18, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 80 } },
      { type: "add_stage", matchAnswer: "Stain finish", stage: { name: "Deck staining", description: "Sand and apply two coats of timber stain", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 80 } },
      { type: "add_stage", matchAnswer: "Paint finish", stage: { name: "Deck painting", description: "Sand, prime and two-coat paint system to deck", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 80 } },
    ],
  },
];

export const decking: WorkCategory = {
  id: "decking",
  label: "Decking",
  description: "Timber, hardwood or composite decking — ground level to elevated",
  icon: "🪵",
  trades: ["Site Prep", "Excavation", "Concrete", "Carpentry", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & set-out", description: "Mark out deck footprint, clear vegetation and level area", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Footing excavation", description: "Excavate pier holes for deck footings", trade: "Excavation", unitRate: 85, unitType: "item", durationDays: 1, code: "AS 2870", order: 15 },
    { name: "Concrete pier footings", description: "Concrete pier footings with stirrups/brackets — 25MPa", trade: "Concrete", unitRate: 120, unitType: "item", durationDays: 1, code: "AS 2870", order: 20 },
    { name: "Bearer & joist subframe", description: "Treated pine or hardwood bearers and joists on stirrups/posts", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 3, code: "AS 1684", order: 40 },
    { name: "Deck board installation", description: "Deck boards — supply, lay and fix with stainless steel screws", trade: "Carpentry", unitRate: 95, unitType: "area", durationDays: 3, code: "AS 1684", order: 50 },
    { name: "Fascia & edge trim", description: "Fascia boards and edge trim to deck perimeter", trade: "Carpentry", unitRate: 35, unitType: "linear", durationDays: 1, code: "AS 1684", order: 60 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...DECKING_QUESTIONS],
};
