import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const waterproofing: WorkCategory = {
  id: "waterproofing",
  label: "Waterproofing & Remedial",
  description: "Membrane, balcony waterproofing, crack injection, remedial works",
  icon: "💧",
  trades: ["Site Prep", "Demolition", "Waterproofing", "Concrete", "Tiling", "Painting", "Cleaning"],
  stages: [
    { name: "Assessment & report", description: "Water ingress investigation and remedial report", trade: "Administration", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS 4654.1", order: 5, isFixed: true },
    { name: "Site preparation", description: "Site setup, protection and access", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Surface preparation", description: "Remove failed waterproofing, clean and prepare substrate", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 2, code: "AS 4654.2", order: 20 },
    { name: "Crack injection", description: "Epoxy or polyurethane crack injection to concrete", trade: "Waterproofing", unitRate: 120, unitType: "area", durationDays: 2, code: "AS 3600", order: 40 },
    { name: "Waterproofing membrane", description: "Apply liquid or sheet membrane system", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 2, code: "AS 4654.2 / AS 3740", order: 60 },
    { name: "Protection / drainage layer", description: "Install protection board or drainage cell", trade: "Waterproofing", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 4654.2", order: 80 },
    { name: "Screed / topping", description: "Screed or topping slab over membrane", trade: "Concrete", unitRate: 55, unitType: "area", durationDays: 1, code: "AS 3600", order: 100 },
    { name: "Finish surface", description: "Tiling, coating or finish to waterproofed area", trade: "Tiling", unitRate: 120, unitType: "area", durationDays: 2, code: "AS 3958.1", order: 130 },
    { name: "Flood testing", description: "24-hour flood test and inspection", trade: "Waterproofing", unitRate: 350, unitType: "allow", durationDays: 2, code: "AS 3740", order: 200, isFixed: true },
    { name: "Builder's clean", description: "Clean up and handover", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "waterproof_scope", label: "Waterproofing Scope", category: "Waterproofing",
      options: ["Bathroom re-waterproofing", "Balcony / terrace", "Basement / retaining wall", "Roof / planter box", "Shower only"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Basement / retaining wall", value: 1.6 },
        { type: "multiplier", matchAnswer: "Roof / planter box", value: 1.4 },
      ],
    },
  ],
};
