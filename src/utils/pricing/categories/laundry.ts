import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const LAUNDRY_QUESTIONS: ScopeQuestion[] = [
  {
    id: "laundry_demo_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Cosmetic only — no demo", "Partial strip (tiles/fixtures)", "Full strip-out to frame"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full strip-out to frame", value: 1.35 },
      { type: "multiplier", matchAnswer: "Partial strip (tiles/fixtures)", value: 1.1 },
    ],
  },
  {
    id: "laundry_tub_type",
    label: "Laundry Tub",
    category: "Fixtures",
    options: ["Existing — keep", "Standard single tub", "Double tub", "Custom undermount tub"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard single tub", stage: { name: "Laundry tub — standard single", description: "Standard single laundry tub supply and install", trade: "Plumbing Fit-Off", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Double tub", stage: { name: "Laundry tub — double", description: "Double laundry tub supply and install", trade: "Plumbing Fit-Off", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Custom undermount tub", stage: { name: "Laundry tub — custom undermount", description: "Custom undermount laundry tub with stone benchtop — supply and install", trade: "Stone/Masonry", unitRate: 1800, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 200, isFixed: true } },
    ],
  },
  {
    id: "laundry_cabinetry",
    label: "Cabinetry & Storage",
    category: "Joinery",
    options: ["None — open shelving only", "Budget flat-pack cabinets", "Mid-range cabinetry", "Custom cabinetry with stone benchtop"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Budget flat-pack cabinets", stage: { name: "Laundry cabinets — budget", description: "Flat-pack laundry cabinets supply and install", trade: "Joinery", unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 195, isFixed: true } },
      { type: "add_stage", matchAnswer: "Mid-range cabinetry", stage: { name: "Laundry cabinets — mid-range", description: "Mid-range laundry cabinetry supply and install", trade: "Joinery", unitRate: 1800, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 195, isFixed: true } },
      { type: "add_stage", matchAnswer: "Custom cabinetry with stone benchtop", stage: { name: "Custom laundry cabinetry & stone", description: "Custom cabinetry with stone benchtop — measure, supply and install", trade: "Stone/Masonry", unitRate: 3500, unitType: "allow", durationDays: 3, code: "NCC 2022", order: 195, isFixed: true } },
    ],
  },
  {
    id: "laundry_splashback",
    label: "Splashback",
    category: "Finishes",
    options: ["No splashback", "Tiled splashback", "Acrylic panel"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Tiled splashback", stage: { name: "Splashback tiling", description: "Tiled splashback supply and install including waterproofing", trade: "Tiling", unitRate: 85, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 105 } },
      { type: "add_stage", matchAnswer: "Acrylic panel", stage: { name: "Acrylic splashback panel", description: "Acrylic splashback panel supply and install", trade: "Joinery", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 105, isFixed: true } },
    ],
  },
  {
    id: "laundry_washing_machine",
    label: "Washing Machine Provision",
    category: "Plumbing",
    options: ["Existing taps — keep", "New taps & waste relocation", "Stacked washer/dryer provision"],
    costEffect: [
      { type: "add_stage", matchAnswer: "New taps & waste relocation", stage: { name: "Washing machine taps & waste", description: "New washing machine taps, isolation valve and waste relocation", trade: "Plumbing Rough-In", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 45, isFixed: true } },
      { type: "add_stage", matchAnswer: "Stacked washer/dryer provision", stage: { name: "Stacked washer/dryer provision", description: "Plumbing and electrical provision for stacked washer/dryer including ventilation", trade: "Plumbing Rough-In", unitRate: 750, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 45, isFixed: true } },
    ],
  },
];

export const laundry: WorkCategory = {
  id: "laundry",
  label: "Laundry",
  description: "Laundry renovation, new laundry build or reconfiguration",
  icon: "🧺",
  trades: ["Site Prep", "Demolition", "Plumbing Rough-In", "Electrical Rough-In", "Carpentry", "Waterproofing", "Tiling", "Plastering", "Plumbing Fit-Off", "Electrical Fit-Off", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Site setup, dust barriers, floor protection and temporary services", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition & strip-out", description: "Strip out existing fixtures, tiles, cabinetry, linings and disposal", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Plumbing rough-in", description: "First fix plumbing — relocate/extend pipework, drainage and waste points", trade: "Plumbing Rough-In", unitRate: 1400, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 40, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — cabling, power points for appliances, lighting", trade: "Electrical Rough-In", unitRate: 900, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 50, isFixed: true },
    { name: "Framing & carpentry", description: "Wall framing adjustments, benchtop support framing", trade: "Carpentry", unitRate: 55, unitType: "area", durationDays: 1, code: "AS 1684", order: 60 },
    { name: "Plasterboard lining", description: "Plasterboard lining to walls and ceiling — set, stop and finish", trade: "Plastering", unitRate: 42, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 70 },
    { name: "Waterproofing membrane", description: "Applied waterproofing membrane to floor and splash zones per AS 3740", trade: "Waterproofing", unitRate: 85, unitType: "area", durationDays: 1, code: "AS 3740", order: 80 },
    { name: "Floor tiling", description: "Floor tiling including adhesive, grout and sealing", trade: "Tiling", unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 100 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — install tub, tapware, waste connections", trade: "Plumbing Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 170, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights", trade: "Electrical Fit-Off", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
    { name: "Painting & finishing", description: "Prep, prime and two-coat paint system to ceiling and walls", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean — remove debris, wipe surfaces, practical completion", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...LAUNDRY_QUESTIONS],
};
