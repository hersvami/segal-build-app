import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const EXTENSION_QUESTIONS: ScopeQuestion[] = [
  {
    id: "extension_type",
    label: "Extension Type",
    category: "Structural",
    options: ["Single room addition", "Multi-room extension", "Second storey addition", "Granny flat / DPU"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Second storey addition", value: 1.6 },
      { type: "multiplier", matchAnswer: "Multi-room extension", value: 1.3 },
      { type: "multiplier", matchAnswer: "Granny flat / DPU", value: 1.4 },
    ],
  },
  {
    id: "foundation_type",
    label: "Foundation Type",
    category: "Structural",
    options: ["Concrete slab on ground", "Suspended timber floor", "Stumps / piers", "Screw piles"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Suspended timber floor", value: 1.15 },
      { type: "multiplier", matchAnswer: "Screw piles", value: 1.1 },
    ],
  },
  {
    id: "cladding_type",
    label: "External Cladding",
    category: "Cladding",
    options: ["Weatherboard", "Brick veneer", "Fibre cement (James Hardie)", "Metal cladding"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Brick veneer", value: 1.2 },
      { type: "multiplier", matchAnswer: "Metal cladding", value: 1.15 },
    ],
  },
  {
    id: "permit_type",
    label: "Permits Required",
    category: "Compliance",
    options: ["Building permit only", "Building + planning permit", "Report & consent (performance solution)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Building + planning permit", stage: { name: "Planning permit application", description: "Prepare and lodge planning permit with council", trade: "Administration", unitRate: 3500, unitType: "allow", durationDays: 10, code: "Planning & Environment Act 1987", order: 3, isFixed: true } },
      { type: "add_stage", matchAnswer: "Report & consent (performance solution)", stage: { name: "Performance solution report", description: "Engage fire engineer and prepare performance solution report", trade: "Engineering", unitRate: 5500, unitType: "allow", durationDays: 5, code: "NCC 2022", order: 4, isFixed: true } },
    ],
  },
];

export const extensions: WorkCategory = {
  id: "extensions",
  label: "Extensions & Additions",
  description: "Room additions, second storey, granny flat, DPU",
  icon: "🏢",
  trades: ["Site Prep", "Engineering", "Excavation", "Concrete", "Structural", "Carpentry", "Roofing", "Plumbing", "Electrical", "Insulation", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Permits & approvals", description: "Building permit application and approval", trade: "Administration", unitRate: 2500, unitType: "allow", durationDays: 10, code: "Building Act 1993 (Vic)", order: 5, isFixed: true },
    { name: "Site preparation", description: "Site setup, fencing, temporary services", trade: "Site Prep", unitRate: 1200, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition & site works", description: "Demolish existing structures, earthworks and site prep", trade: "Excavation", unitRate: 75, unitType: "area", durationDays: 3, code: "AS 2601", order: 15 },
    { name: "Foundation & slab", description: "Excavate, form, reinforce and pour concrete slab/footings", trade: "Concrete", unitRate: 250, unitType: "area", durationDays: 5, code: "AS 3600 / AS 2870", order: 30 },
    { name: "Structural frame", description: "Timber or steel frame — walls, ceiling joists, roof trusses", trade: "Carpentry", unitRate: 180, unitType: "area", durationDays: 8, code: "AS 1684", order: 50 },
    { name: "Roofing", description: "Roof sheeting/tiles, flashings, sarking and insulation", trade: "Roofing", unitRate: 130, unitType: "area", durationDays: 4, code: "AS 1562", order: 70 },
    { name: "External cladding", description: "External wall cladding — supply and install", trade: "Carpentry", unitRate: 120, unitType: "area", durationDays: 4, code: "NCC 2022", order: 80 },
    { name: "Windows & external doors", description: "Supply and install windows and external doors", trade: "Glazing", unitRate: 450, unitType: "area", durationDays: 2, code: "AS 2047", order: 85 },
    { name: "Plumbing rough-in", description: "First fix plumbing as required", trade: "Plumbing", unitRate: 2500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 90, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — cabling, back boxes", trade: "Electrical", unitRate: 2000, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 95, isFixed: true },
    { name: "Insulation", description: "Wall and ceiling insulation to NCC requirements", trade: "Insulation", unitRate: 25, unitType: "area", durationDays: 2, code: "NCC 2022 Vol 2 Part 3.12", order: 100 },
    { name: "Plasterboard lining", description: "Plasterboard to walls and ceilings — set, stop and finish", trade: "Plastering", unitRate: 50, unitType: "area", durationDays: 4, code: "AS/NZS 2589", order: 110 },
    { name: "Internal doors & trim", description: "Internal doors, architraves, skirting", trade: "Carpentry", unitRate: 45, unitType: "area", durationDays: 2, code: "NCC 2022", order: 130 },
    { name: "Plumbing fit-off", description: "Final fix plumbing", trade: "Plumbing", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 160, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights", trade: "Electrical", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 165, isFixed: true },
    { name: "Painting", description: "Full paint — interior and exterior", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 4, code: "AS/NZS 2311", order: 190 },
    { name: "Final inspections", description: "Building surveyor final inspection and occupancy permit", trade: "Administration", unitRate: 800, unitType: "allow", durationDays: 1, code: "Building Act 1993", order: 220, isFixed: true },
    { name: "Builder's clean", description: "Full builders clean — handover quality", trade: "Cleaning", unitRate: 800, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...EXTENSION_QUESTIONS],
};
