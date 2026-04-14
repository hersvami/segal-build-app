import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const GRANNY_FLAT_QUESTIONS: ScopeQuestion[] = [
  {
    id: "gf_size",
    label: "Granny Flat Size",
    category: "Dimensions",
    options: ["1 bedroom — up to 40m²", "2 bedroom — 40-60m²", "Large — 60m² (max allowable)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "1 bedroom — up to 40m²", value: 0.75 },
      { type: "multiplier", matchAnswer: "Large — 60m² (max allowable)", value: 1.15 },
    ],
  },
  {
    id: "gf_construction",
    label: "Construction Type",
    category: "Structure",
    options: ["Timber frame — weatherboard/fibre cement", "Brick veneer", "Prefabricated / modular", "Rendered foam panel (SIPs)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Brick veneer", value: 1.15 },
      { type: "multiplier", matchAnswer: "Prefabricated / modular", value: 0.85 },
      { type: "multiplier", matchAnswer: "Rendered foam panel (SIPs)", value: 1.1 },
    ],
  },
  {
    id: "gf_services_distance",
    label: "Distance to Services",
    category: "Services",
    options: ["Close to main house — under 10m", "Moderate — 10-20m", "Far — over 20m (extended trenching)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Moderate — 10-20m", value: 1.08 },
      { type: "multiplier", matchAnswer: "Far — over 20m (extended trenching)", value: 1.18 },
    ],
  },
  {
    id: "gf_kitchen",
    label: "Kitchen Type",
    category: "Joinery",
    options: ["Kitchenette — basic", "Full kitchen — standard", "Full kitchen — premium"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Kitchenette — basic", stage: { name: "Kitchenette — basic", description: "Basic kitchenette with sink, benchtop, overhead cupboards and hotplate provision", trade: "Joinery", unitRate: 4500, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 100, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full kitchen — standard", stage: { name: "Kitchen — standard", description: "Standard full kitchen with cabinets, laminate benchtop, tiled splashback", trade: "Joinery", unitRate: 8500, unitType: "allow", durationDays: 3, code: "NCC 2022", order: 100, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full kitchen — premium", stage: { name: "Kitchen — premium", description: "Premium kitchen with stone benchtop, soft-close cabinetry, glass splashback", trade: "Joinery", unitRate: 14000, unitType: "allow", durationDays: 4, code: "NCC 2022", order: 100, isFixed: true } },
    ],
  },
  {
    id: "gf_accessibility",
    label: "Accessibility Requirements",
    category: "Accessibility",
    options: ["No special requirements", "Step-free / level access", "Full SDA / NDIS compliant"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Step-free / level access", value: 1.05 },
      { type: "multiplier", matchAnswer: "Full SDA / NDIS compliant", value: 1.2 },
    ],
  },
];

export const grannyFlat: WorkCategory = {
  id: "granny_flat",
  label: "Granny Flat / DPU",
  description: "Self-contained granny flat, dependent person's unit or ancillary dwelling",
  icon: "🏠",
  trades: ["Engineering", "Surveying", "Excavation", "Concrete", "Carpentry", "Roofing", "Cladding", "Plumbing", "Electrical", "HVAC", "Insulation", "Plastering", "Waterproofing", "Tiling", "Joinery", "Painting", "Cleaning"],
  stages: [
    { name: "Design, engineering & permits", description: "Architectural design, structural engineering and building permit", trade: "Engineering", unitRate: 8500, unitType: "allow", durationDays: 10, code: "NCC 2022", order: 5, isFixed: true },
    { name: "Site preparation & set-out", description: "Site clearing, set-out, temporary fencing and services location", trade: "Excavation", unitRate: 1500, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Earthworks & base preparation", description: "Cut/fill, compact to design levels and prepare slab base", trade: "Excavation", unitRate: 25, unitType: "area", durationDays: 2, code: "AS 3798", order: 15 },
    { name: "Under-slab plumbing & services", description: "Under-slab plumbing connections from main house — sewer, water, gas", trade: "Plumbing", unitRate: 4500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 18, isFixed: true },
    { name: "Concrete slab", description: "Concrete slab — mesh, vapour barrier, edge boards, pour and finish", trade: "Concrete", unitRate: 95, unitType: "area", durationDays: 2, code: "AS 2870", order: 25 },
    { name: "Wall framing", description: "Timber wall framing including bracing and tie-downs", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 4, code: "AS 1684", order: 35 },
    { name: "Roof framing", description: "Roof trusses or rafters — supply and install", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 3, code: "AS 1684", order: 40 },
    { name: "Roof sheeting & sarking", description: "Metal roof sheeting, sarking, flashings and guttering", trade: "Roofing", unitRate: 75, unitType: "area", durationDays: 2, code: "AS 1562.1", order: 45 },
    { name: "External cladding", description: "External wall cladding — weatherboard, fibre cement or brick veneer", trade: "Cladding", unitRate: 120, unitType: "area", durationDays: 4, code: "NCC 2022", order: 50 },
    { name: "Windows & external doors", description: "Aluminium windows and external doors — supply and install", trade: "Joinery", unitRate: 850, unitType: "item", durationDays: 2, code: "AS 2047", order: 55 },
    { name: "Plumbing rough-in", description: "First fix plumbing — bathroom, kitchen, laundry pipework", trade: "Plumbing", unitRate: 4500, unitType: "allow", durationDays: 3, code: "AS/NZS 3500", order: 60, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — sub-board, cabling, back boxes", trade: "Electrical", unitRate: 4500, unitType: "allow", durationDays: 3, code: "AS/NZS 3000", order: 65, isFixed: true },
    { name: "HVAC installation", description: "Split system air conditioning — supply and install", trade: "HVAC", unitRate: 2800, unitType: "allow", durationDays: 1, code: "AS/NZS 3823", order: 68, isFixed: true },
    { name: "Insulation", description: "Wall and ceiling insulation per NCC Section J", trade: "Insulation", unitRate: 18, unitType: "area", durationDays: 2, code: "NCC 2022 Section J", order: 70 },
    { name: "Plasterboard lining", description: "Plasterboard to all walls and ceilings — fix, set, stop and finish", trade: "Plastering", unitRate: 48, unitType: "area", durationDays: 5, code: "AS/NZS 2589", order: 80 },
    { name: "Waterproofing — wet areas", description: "Waterproofing to bathroom and laundry per AS 3740", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3740", order: 85 },
    { name: "Tiling — wet areas", description: "Floor and wall tiling to bathroom and laundry", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 4, code: "AS 3958.1", order: 90 },
    { name: "Internal joinery & doors", description: "Internal doors, architraves, skirting and built-in robes", trade: "Joinery", unitRate: 450, unitType: "item", durationDays: 3, code: "NCC 2022", order: 105 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — fixtures, tapware, hot water connection", trade: "Plumbing", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 140, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights, smoke alarms, RCD", trade: "Electrical", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 145, isFixed: true },
    { name: "Painting — full unit", description: "Full internal and external paint system", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 4, code: "AS/NZS 2311", order: 170 },
    { name: "Floor coverings", description: "Floor coverings — carpet, vinyl or timber as specified", trade: "Flooring", unitRate: 60, unitType: "area", durationDays: 2, code: "NCC 2022", order: 180 },
    { name: "External paths & landscaping", description: "Concrete path, clothesline area and basic landscaping", trade: "Landscaping", unitRate: 3500, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 200, isFixed: true },
    { name: "Detail clean & handover", description: "Full detail clean, defect inspection and practical completion", trade: "Cleaning", unitRate: 1200, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...GRANNY_FLAT_QUESTIONS],
};
