import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const PERGOLA_QUESTIONS: ScopeQuestion[] = [
  {
    id: "pergola_type",
    label: "Structure Type",
    category: "Structure",
    options: ["Pergola — open roof", "Patio — insulated roof", "Verandah — attached to house", "Carport", "Alfresco — fully enclosed"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Patio — insulated roof", value: 1.3 },
      { type: "multiplier", matchAnswer: "Alfresco — fully enclosed", value: 1.5 },
      { type: "multiplier", matchAnswer: "Carport", value: 0.85 },
    ],
  },
  {
    id: "pergola_material",
    label: "Frame Material",
    category: "Materials",
    options: ["Timber frame", "Steel frame — powder coated", "Aluminium frame", "Hardwood feature timber"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Steel frame — powder coated", value: 1.2 },
      { type: "multiplier", matchAnswer: "Aluminium frame", value: 1.15 },
      { type: "multiplier", matchAnswer: "Hardwood feature timber", value: 1.4 },
    ],
  },
  {
    id: "pergola_roof",
    label: "Roofing Type",
    category: "Roofing",
    options: ["Open battens / rafters only", "Polycarbonate sheeting", "Colorbond sheeting", "Insulated panel (Lysaght/Stratco)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Open battens / rafters only", value: 0.75 },
      { type: "multiplier", matchAnswer: "Insulated panel (Lysaght/Stratco)", value: 1.35 },
    ],
  },
  {
    id: "pergola_electrical",
    label: "Electrical / Lighting",
    category: "Electrical",
    options: ["No electrical required", "Downlights only", "Downlights + fan", "Full outdoor kitchen electrical"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Downlights only", stage: { name: "Pergola lighting", description: "LED downlights to pergola — cabling and install", trade: "Electrical", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 70, isFixed: true } },
      { type: "add_stage", matchAnswer: "Downlights + fan", stage: { name: "Pergola lighting & fan", description: "LED downlights and outdoor ceiling fan — cabling and install", trade: "Electrical", unitRate: 1400, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 70, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full outdoor kitchen electrical", stage: { name: "Outdoor kitchen electrical", description: "Full electrical to outdoor kitchen — GPOs, lights, fan, rangehood", trade: "Electrical", unitRate: 2800, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 70, isFixed: true } },
    ],
  },
  {
    id: "pergola_floor",
    label: "Floor Surface",
    category: "External",
    options: ["Existing concrete slab", "New concrete slab", "Paved surface", "Timber deck floor"],
    costEffect: [
      { type: "add_stage", matchAnswer: "New concrete slab", stage: { name: "Concrete slab — pergola", description: "New concrete slab under pergola including base prep and finish", trade: "Concrete", unitRate: 95, unitType: "area", durationDays: 2, code: "AS 3600", order: 15 } },
      { type: "add_stage", matchAnswer: "Paved surface", stage: { name: "Paving under pergola", description: "Paving to pergola area including base prep and sand bed", trade: "Paving", unitRate: 85, unitType: "area", durationDays: 2, code: "AS 3727", order: 15 } },
      { type: "add_stage", matchAnswer: "Timber deck floor", stage: { name: "Timber deck floor", description: "Timber decking floor to pergola including subframe", trade: "Carpentry", unitRate: 165, unitType: "area", durationDays: 3, code: "AS 1684", order: 15 } },
    ],
  },
];

export const pergola: WorkCategory = {
  id: "pergola",
  label: "Pergola & Patio",
  description: "Pergola, patio, verandah, carport and alfresco area construction",
  icon: "🏡",
  trades: ["Site Prep", "Excavation", "Concrete", "Carpentry", "Roofing", "Electrical", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & set-out", description: "Mark out footprint, clear area and prepare site", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Footing excavation", description: "Excavate pier holes for post footings", trade: "Excavation", unitRate: 85, unitType: "item", durationDays: 1, code: "AS 2870", order: 15 },
    { name: "Concrete pier footings", description: "Concrete pier footings with post brackets — 25MPa", trade: "Concrete", unitRate: 150, unitType: "item", durationDays: 1, code: "AS 2870", order: 20 },
    { name: "Post installation", description: "Structural posts — supply, plumb and fix to footings", trade: "Carpentry", unitRate: 250, unitType: "item", durationDays: 1, code: "AS 1684", order: 30 },
    { name: "Beam & rafter framing", description: "Main beams and rafters — supply, install and fix", trade: "Carpentry", unitRate: 75, unitType: "area", durationDays: 2, code: "AS 1684", order: 40 },
    { name: "Roof sheeting", description: "Roof sheeting — supply and fix including flashings and guttering", trade: "Roofing", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 1562.1", order: 50 },
    { name: "Gutter & downpipe", description: "Gutter, downpipe and stormwater connection", trade: "Roofing", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS/NZS 3500.3", order: 55 },
    { name: "Painting / coating", description: "Paint or stain finish to all exposed timber/steel", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 80 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...PERGOLA_QUESTIONS],
};
