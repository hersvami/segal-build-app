import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const WET_AREA_QUESTIONS: ScopeQuestion[] = [
  {
    id: "demolition_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Cosmetic only — no demo", "Partial strip (tiles/fixtures)", "Full strip-out to frame"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full strip-out to frame", value: 1.35 },
      { type: "multiplier", matchAnswer: "Partial strip (tiles/fixtures)", value: 1.1 },
    ],
  },
  {
    id: "tile_type",
    label: "Tile Selection",
    category: "Finishes",
    options: ["Standard ceramic/porcelain", "Large format (600x600+)", "Feature / mosaic tiles", "Natural stone"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Large format (600x600+)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Feature / mosaic tiles", value: 1.25 },
      { type: "multiplier", matchAnswer: "Natural stone", value: 1.4 },
    ],
  },
  {
    id: "shower_screen",
    label: "Shower Screen",
    category: "Fixtures",
    options: ["Not required", "Standard framed", "Semi-frameless", "Fully frameless"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard framed", stage: { name: "Shower screen — framed", description: "Framed shower screen supply and install", trade: "Shower Screen", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210, isFixed: true } },
      { type: "add_stage", matchAnswer: "Semi-frameless", stage: { name: "Shower screen — semi-frameless", description: "Semi-frameless shower screen supply and install", trade: "Shower Screen", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210, isFixed: true } },
      { type: "add_stage", matchAnswer: "Fully frameless", stage: { name: "Shower screen — fully frameless", description: "Fully frameless shower screen supply and install", trade: "Shower Screen", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210, isFixed: true } },
    ],
  },
  {
    id: "vanity_type",
    label: "Vanity / Joinery",
    category: "Joinery",
    options: ["Existing — keep", "Budget vanity", "Mid-range vanity", "Custom stone-top vanity"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Budget vanity", stage: { name: "Vanity supply & install — budget", description: "Budget vanity unit supply and install", trade: "Joinery", unitRate: 600, unitType: "allow", durationDays: 1, code: "AS 4386", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Mid-range vanity", stage: { name: "Vanity supply & install — mid-range", description: "Mid-range vanity unit supply and install", trade: "Joinery", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 4386", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Custom stone-top vanity", stage: { name: "Custom stone vanity & benchtop", description: "Custom vanity with stone benchtop — supply, template and install", trade: "Stone/Masonry", unitRate: 2800, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 200, isFixed: true } },
    ],
  },
];

export const wetAreas: WorkCategory = {
  id: "wet_areas",
  label: "Wet Areas",
  description: "Bathroom, ensuite, laundry, powder room renovations",
  icon: "🚿",
  trades: ["Site Prep", "Demolition", "Plumbing Rough-In", "Electrical Rough-In", "Carpentry", "Waterproofing", "Screed", "Tiling", "Plastering", "Plumbing Fit-Off", "Electrical Fit-Off", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Site setup, dust barriers, floor protection and temporary services", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition & strip-out", description: "Strip out existing fixtures, tiles, linings and disposal to licensed facility", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
    { name: "Plumbing rough-in", description: "First fix plumbing — relocate/extend pipework, drainage and waste", trade: "Plumbing Rough-In", unitRate: 1800, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 40, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — cabling, back boxes, exhaust fan ducting", trade: "Electrical Rough-In", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 50, isFixed: true },
    { name: "Framing & carpentry", description: "Wall framing, hob construction, niche framing and structural support", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 1684", order: 60 },
    { name: "Plasterboard lining", description: "Plasterboard lining to walls and ceiling — set, stop and finish", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 70 },
    { name: "Waterproofing membrane", description: "Applied waterproofing membrane to floor, walls and hob per AS 3740", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3740", order: 80 },
    { name: "Floor screed & levelling", description: "Screed to falls and floor levelling compound", trade: "Screed", unitRate: 40, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 90 },
    { name: "Wall & floor tiling", description: "Floor and wall tiling including adhesive, grout and sealing", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 3, code: "AS 3958.1", order: 100 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — install tapware, toilet, basin, shower mixer", trade: "Plumbing Fit-Off", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 170, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights, exhaust fan", trade: "Electrical Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
    { name: "Painting & finishing", description: "Prep, prime and two-coat paint system to ceiling and any exposed walls", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean — remove debris, wipe surfaces, practical completion", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...WET_AREA_QUESTIONS],
};
