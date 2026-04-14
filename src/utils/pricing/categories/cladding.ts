import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const CLADDING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "clad_material",
    label: "Cladding Material",
    category: "Materials",
    options: [
      "Weatherboard (timber)",
      "Fibre cement (Scyon Linea/Axon/Stria)",
      "Timber (cedar/hardwood)",
      "Metal (Colorbond/aluminium)",
      "Composite panel",
      "Brick veneer",
    ],
    costEffect: [
      { type: "multiplier", matchAnswer: "Fibre cement (Scyon Linea/Axon/Stria)", value: 1.1 },
      { type: "multiplier", matchAnswer: "Timber (cedar/hardwood)", value: 1.4 },
      { type: "multiplier", matchAnswer: "Metal (Colorbond/aluminium)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Composite panel", value: 1.5 },
      { type: "multiplier", matchAnswer: "Brick veneer", value: 1.6 },
    ],
  },
  {
    id: "clad_height",
    label: "Wall Height",
    category: "Structure",
    options: ["Single storey (up to 3m)", "Double storey (up to 6m)", "Over 6m"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Double storey (up to 6m)", value: 1.25 },
      { type: "multiplier", matchAnswer: "Over 6m", value: 1.5 },
      {
        type: "add_stage",
        matchAnswer: "Double storey (up to 6m)",
        stage: { name: "Scaffolding — double storey", description: "Scaffold erect, hire and dismantle for double storey cladding", trade: "Scaffolding", unitRate: 2200, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 12, isFixed: true },
      },
      {
        type: "add_stage",
        matchAnswer: "Over 6m",
        stage: { name: "Scaffolding — high access", description: "Full scaffold system for high access cladding works", trade: "Scaffolding", unitRate: 4500, unitType: "allow", durationDays: 2, code: "AS/NZS 1576", order: 12, isFixed: true },
      },
    ],
  },
  {
    id: "clad_remove_existing",
    label: "Remove Existing Cladding",
    category: "Demolition",
    options: ["Yes — remove and dispose", "No — new cladding only", "Over-clad existing"],
    costEffect: [
      {
        type: "add_stage",
        matchAnswer: "Yes — remove and dispose",
        stage: { name: "Strip existing cladding", description: "Remove and dispose existing wall cladding, battens and building paper", trade: "Demolition", unitRate: 28, unitType: "area", durationDays: 3, code: "EPA Vic", order: 5 },
      },
    ],
  },
  {
    id: "clad_insulation",
    label: "Wall Insulation",
    category: "Insulation",
    options: ["Yes — R2.0 batts", "Yes — R2.5 batts", "Yes — rigid foam board", "No — not required"],
    costEffect: [
      {
        type: "add_stage",
        matchAnswer: "Yes — R2.0 batts",
        stage: { name: "Wall insulation — R2.0 batts", description: "Supply and install R2.0 wall batts between studs", trade: "Insulation", unitRate: 15, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 25 },
      },
      {
        type: "add_stage",
        matchAnswer: "Yes — R2.5 batts",
        stage: { name: "Wall insulation — R2.5 batts", description: "Supply and install R2.5 wall batts between studs", trade: "Insulation", unitRate: 18, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 25 },
      },
      {
        type: "add_stage",
        matchAnswer: "Yes — rigid foam board",
        stage: { name: "Wall insulation — rigid foam board", description: "Supply and fix rigid XPS/EPS foam insulation board to frame", trade: "Insulation", unitRate: 35, unitType: "area", durationDays: 2, code: "NCC 2022 Section J", order: 25 },
      },
    ],
  },
  {
    id: "clad_sarking",
    label: "Building Wrap / Sarking",
    category: "Envelope",
    options: ["Yes — new building wrap required", "No — already in place", "Not required"],
    costEffect: [
      {
        type: "add_stage",
        matchAnswer: "Yes — new building wrap required",
        stage: { name: "Building wrap / sarking", description: "Supply and install building wrap (sarking) to timber frame walls", trade: "Carpentry", unitRate: 12, unitType: "area", durationDays: 1, code: "AS 4200.1", order: 20 },
      },
    ],
  },
  {
    id: "clad_windows",
    label: "Window/Door Openings to Flash",
    category: "Flashings",
    options: ["Under 5 openings", "5–10 openings", "Over 10 openings", "No openings"],
    costEffect: [
      { type: "multiplier", matchAnswer: "5–10 openings", value: 1.08 },
      { type: "multiplier", matchAnswer: "Over 10 openings", value: 1.15 },
    ],
  },
  {
    id: "clad_finish",
    label: "Cladding Finish",
    category: "Finishes",
    options: ["Paint — primer + 2 coats", "Stain/oil (timber)", "Pre-finished (no painting required)", "Raw / natural timber"],
    costEffect: [
      {
        type: "add_stage",
        matchAnswer: "Paint — primer + 2 coats",
        stage: { name: "External painting — primer + 2 coats", description: "Sand, prime and apply 2 coats exterior acrylic paint to cladding", trade: "Painting", unitRate: 28, unitType: "area", durationDays: 3, code: "AS/NZS 2311", order: 80 },
      },
      {
        type: "add_stage",
        matchAnswer: "Stain/oil (timber)",
        stage: { name: "Timber stain / oil finish", description: "Sand and apply 2 coats timber stain or decking oil to cladding", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 80 },
      },
    ],
  },
];

export const cladding: WorkCategory = {
  id: "cladding",
  label: "Cladding",
  description: "External wall cladding — weatherboard, fibre cement, timber, metal, composite panels, brick veneer",
  icon: "🧱",
  trades: ["Demolition", "Carpentry", "Insulation", "Scaffolding", "Painting", "Cleaning"],
  stages: [
    { name: "Framing inspection & repair", description: "Inspect existing wall framing, replace damaged studs/noggings as required", trade: "Carpentry", unitRate: 45, unitType: "area", durationDays: 2, code: "AS 1684", order: 15 },
    { name: "Cavity battens installation", description: "Install timber or metal battens to create ventilated cavity behind cladding", trade: "Carpentry", unitRate: 22, unitType: "area", durationDays: 2, code: "AS 1684", order: 30 },
    { name: "Cladding supply & installation", description: "Supply and fix cladding boards/sheets to battens per manufacturer spec", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 5, code: "AS 1684", order: 40 },
    { name: "Window & door flashings", description: "Metal flashings to all window and door openings — head, sill and jamb", trade: "Carpentry", unitRate: 65, unitType: "linear", durationDays: 2, code: "AS 4654.2", order: 50 },
    { name: "Corner trims & junctions", description: "Corner mouldings, junction trims and cover strips", trade: "Carpentry", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS 1684", order: 55 },
    { name: "Sealing & caulking", description: "Sealant to all joints, penetrations and junctions per manufacturer spec", trade: "Carpentry", unitRate: 8, unitType: "linear", durationDays: 1, code: "AS 1684", order: 60 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...CLADDING_QUESTIONS],
};
