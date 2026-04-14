import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const PAINTING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "paint_scope",
    label: "Painting Scope",
    category: "Painting",
    options: ["Walls only", "Walls & ceilings", "Full repaint (walls, ceilings, trim, doors)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Walls & ceilings", value: 1.25 },
      { type: "multiplier", matchAnswer: "Full repaint (walls, ceilings, trim, doors)", value: 1.5 },
    ],
  },
  {
    id: "paint_prep",
    label: "Surface Preparation",
    category: "Painting",
    options: ["Light — minimal prep", "Moderate — patching and sanding", "Heavy — extensive repair, stripping, priming"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Moderate — patching and sanding", value: 1.15 },
      { type: "multiplier", matchAnswer: "Heavy — extensive repair, stripping, priming", value: 1.4 },
    ],
  },
  {
    id: "paint_type",
    label: "Paint Quality",
    category: "Painting",
    options: ["Standard (Dulux Wash & Wear)", "Premium (Dulux Weathershield / Haymes)", "Specialty (anti-mould, heat reflective)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Premium (Dulux Weathershield / Haymes)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Specialty (anti-mould, heat reflective)", value: 1.3 },
    ],
  },
];

export const painting: WorkCategory = {
  id: "painting",
  label: "Painting & Decorating",
  description: "Interior/exterior painting, feature walls, wallpaper",
  icon: "🎨",
  trades: ["Site Prep", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Dust sheets, masking, furniture protection", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Surface preparation", description: "Repair, patch, sand and prepare all surfaces", trade: "Plastering", unitRate: 25, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 30 },
    { name: "Primer coat", description: "Apply primer/sealer coat to all surfaces", trade: "Painting", unitRate: 12, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 100 },
    { name: "Two-coat paint application", description: "Apply two coats of finish paint — walls and ceilings", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 110 },
    { name: "Trim & detail painting", description: "Paint doors, architraves, skirting and window frames", trade: "Painting", unitRate: 15, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 120 },
    { name: "Builder's clean", description: "Remove dust sheets, clean up", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...PAINTING_QUESTIONS],
};
