import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const TOILET_QUESTIONS: ScopeQuestion[] = [
  {
    id: "toilet_demo_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Cosmetic refresh only", "Partial strip (floor/fixtures)", "Full strip-out to frame"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full strip-out to frame", value: 1.3 },
      { type: "multiplier", matchAnswer: "Partial strip (floor/fixtures)", value: 1.1 },
    ],
  },
  {
    id: "toilet_suite_type",
    label: "Toilet Suite",
    category: "Fixtures",
    options: ["Existing — keep", "Standard close-coupled", "Wall-hung toilet", "In-wall cistern"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard close-coupled", stage: { name: "Toilet suite — standard", description: "Standard close-coupled toilet suite supply and install", trade: "Plumbing Fit-Off", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Wall-hung toilet", stage: { name: "Toilet suite — wall-hung", description: "Wall-hung toilet suite with concealed cistern frame, supply and install", trade: "Plumbing Fit-Off", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "In-wall cistern", stage: { name: "Toilet suite — in-wall cistern", description: "Toilet with in-wall cistern system, frame, flush plate, supply and install", trade: "Plumbing Fit-Off", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 200, isFixed: true } },
    ],
  },
  {
    id: "toilet_basin",
    label: "Hand Basin",
    category: "Fixtures",
    options: ["Existing — keep", "Small wall-mounted basin", "Vanity with basin", "Custom stone vanity"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Small wall-mounted basin", stage: { name: "Hand basin — wall-mounted", description: "Small wall-mounted hand basin with tapware, supply and install", trade: "Plumbing Fit-Off", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 205, isFixed: true } },
      { type: "add_stage", matchAnswer: "Vanity with basin", stage: { name: "Vanity unit with basin", description: "Vanity unit with basin and tapware, supply and install", trade: "Joinery", unitRate: 900, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 205, isFixed: true } },
      { type: "add_stage", matchAnswer: "Custom stone vanity", stage: { name: "Custom stone vanity", description: "Custom vanity with stone benchtop and undermount basin, supply and install", trade: "Stone/Masonry", unitRate: 2400, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 205, isFixed: true } },
    ],
  },
  {
    id: "toilet_ventilation",
    label: "Ventilation",
    category: "Services",
    options: ["Existing window — adequate", "New exhaust fan required", "Window + exhaust fan"],
    costEffect: [
      { type: "add_stage", matchAnswer: "New exhaust fan required", stage: { name: "Exhaust fan installation", description: "Exhaust fan supply, install and duct to exterior", trade: "Electrical Fit-Off", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 185, isFixed: true } },
      { type: "add_stage", matchAnswer: "Window + exhaust fan", stage: { name: "Exhaust fan installation", description: "Exhaust fan supply, install and duct to exterior", trade: "Electrical Fit-Off", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 185, isFixed: true } },
    ],
  },
];

export const toilet: WorkCategory = {
  id: "toilet",
  label: "Toilet / WC",
  description: "Separate toilet or powder room renovation or new build",
  icon: "🚽",
  trades: ["Site Prep", "Demolition", "Plumbing Rough-In", "Electrical Rough-In", "Carpentry", "Waterproofing", "Tiling", "Plastering", "Plumbing Fit-Off", "Electrical Fit-Off", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Site setup, dust barriers, floor protection", trade: "Site Prep", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition & strip-out", description: "Strip out existing fixtures, tiles and linings", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Plumbing rough-in", description: "First fix plumbing — waste relocation, water supply points", trade: "Plumbing Rough-In", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 40, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — cabling, back boxes, fan ducting", trade: "Electrical Rough-In", unitRate: 550, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 50, isFixed: true },
    { name: "Framing & carpentry", description: "Wall framing adjustments, niche or cistern framing", trade: "Carpentry", unitRate: 55, unitType: "area", durationDays: 1, code: "AS 1684", order: 60 },
    { name: "Plasterboard lining", description: "Plasterboard lining to walls and ceiling — set, stop and finish", trade: "Plastering", unitRate: 42, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 70 },
    { name: "Waterproofing membrane", description: "Waterproofing to floor area per AS 3740", trade: "Waterproofing", unitRate: 85, unitType: "area", durationDays: 1, code: "AS 3740", order: 80 },
    { name: "Floor tiling", description: "Floor tiling including adhesive, grout and sealing", trade: "Tiling", unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 100 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — toilet suite, basin, tapware", trade: "Plumbing Fit-Off", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 170, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights, exhaust fan", trade: "Electrical Fit-Off", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
    { name: "Painting & finishing", description: "Prep, prime and two-coat paint to ceiling and walls", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and wipe down", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...TOILET_QUESTIONS],
};
