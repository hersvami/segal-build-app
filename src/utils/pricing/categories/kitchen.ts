import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const KITCHEN_QUESTIONS: ScopeQuestion[] = [
  {
    id: "demolition_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Cosmetic only — no demo", "Partial strip (benchtops/splashback)", "Full strip-out to frame"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full strip-out to frame", value: 1.4 },
      { type: "multiplier", matchAnswer: "Partial strip (benchtops/splashback)", value: 1.1 },
    ],
  },
  {
    id: "benchtop_type",
    label: "Benchtop Material",
    category: "Joinery",
    options: ["Laminate", "Engineered stone (Caesarstone)", "Natural stone (marble/granite)", "Timber"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Engineered stone (Caesarstone)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Natural stone (marble/granite)", value: 1.35 },
    ],
  },
  {
    id: "splashback_type",
    label: "Splashback",
    category: "Finishes",
    options: ["Not required", "Tiled splashback", "Glass splashback", "Stone/marble splashback"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Tiled splashback", stage: { name: "Tiled splashback", description: "Tile splashback supply and install", trade: "Tiling", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS 3958.1", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Glass splashback", stage: { name: "Glass splashback", description: "Toughened glass splashback — measure, supply and install", trade: "Glazing", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Stone/marble splashback", stage: { name: "Stone splashback", description: "Natural stone splashback — template, supply and install", trade: "Stone/Masonry", unitRate: 1800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 180, isFixed: true } },
    ],
  },
  {
    id: "appliance_install",
    label: "Appliance Installation",
    category: "Fixtures",
    options: ["None — owner supply", "Cooktop & oven", "Full appliance package (cooktop, oven, rangehood, dishwasher)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Cooktop & oven", stage: { name: "Appliance install — cooktop & oven", description: "Install cooktop and oven — gas/electric connection", trade: "Plumbing Fit-Off", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 5601", order: 175, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full appliance package (cooktop, oven, rangehood, dishwasher)", stage: { name: "Full appliance install", description: "Install cooktop, oven, rangehood and dishwasher — all connections", trade: "Plumbing Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 5601", order: 175, isFixed: true } },
    ],
  },
];

export const kitchen: WorkCategory = {
  id: "kitchen",
  label: "Kitchen",
  description: "Kitchen renovation, cabinetry, benchtops, splashback",
  icon: "🍳",
  trades: ["Site Prep", "Demolition", "Plumbing Rough-In", "Electrical Rough-In", "Carpentry", "Plastering", "Joinery", "Tiling", "Plumbing Fit-Off", "Electrical Fit-Off", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Site setup, dust barriers, floor protection", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition & strip-out", description: "Remove existing cabinetry, appliances, splashback and disposal", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
    { name: "Plumbing rough-in", description: "First fix plumbing — relocate/extend water, gas and drainage", trade: "Plumbing Rough-In", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 40, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — additional circuits, rangehood duct, lighting", trade: "Electrical Rough-In", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 50, isFixed: true },
    { name: "Wall framing & patching", description: "Framing modifications, wall patching and preparation", trade: "Carpentry", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 1684", order: 60 },
    { name: "Plasterboard & patching", description: "Plasterboard repair, set, stop and finish", trade: "Plastering", unitRate: 40, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 70 },
    { name: "Cabinetry supply & install", description: "Kitchen cabinetry — supply, deliver and install (base, wall, tall units)", trade: "Joinery", unitRate: 800, unitType: "area", durationDays: 3, code: "AS 4386", order: 110 },
    { name: "Benchtop template & install", description: "Benchtop measure, template, supply and install", trade: "Stone/Masonry", unitRate: 500, unitType: "area", durationDays: 2, code: "NCC 2022", order: 120 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — sink, tap, dishwasher, gas connection", trade: "Plumbing Fit-Off", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 170, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — GPOs, switches, undercabinet lighting", trade: "Electrical Fit-Off", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
    { name: "Painting & touch-up", description: "Prep, prime and two-coat paint to ceiling and walls", trade: "Painting", unitRate: 30, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean — remove debris, wipe surfaces", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...KITCHEN_QUESTIONS],
};
