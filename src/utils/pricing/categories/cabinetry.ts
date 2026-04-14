import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const cabinetry: WorkCategory = {
  id: "cabinetry",
  label: "Cabinetry & Joinery",
  description: "Built-in robes, vanities, shelving, custom joinery, wardrobes",
  icon: "🚪",
  trades: ["Site Prep", "Demolition", "Carpentry", "Joinery", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Protect floors and walls", trade: "Site Prep", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Remove existing joinery", description: "Demolish and remove existing cabinetry", trade: "Demolition", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Measure & template", description: "Detailed measure and template for custom joinery", trade: "Joinery", unitRate: 350, unitType: "allow", durationDays: 1, code: "AS 4386", order: 30, isFixed: true },
    { name: "Cabinetry manufacture", description: "Custom manufacture of cabinetry/joinery units", trade: "Joinery", unitRate: 650, unitType: "area", durationDays: 5, code: "AS 4386", order: 50 },
    { name: "Delivery & install", description: "Deliver and install joinery — fix, level and adjust", trade: "Joinery", unitRate: 250, unitType: "area", durationDays: 2, code: "AS 4386", order: 100 },
    { name: "Hardware & accessories", description: "Install handles, hinges, soft-close, drawers, accessories", trade: "Joinery", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 4386", order: 130 },
    { name: "Paint / finish", description: "Paint, stain or polyurethane finish to joinery", trade: "Painting", unitRate: 45, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Clean up and handover", trade: "Cleaning", unitRate: 200, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "joinery_type", label: "Joinery Type", category: "Joinery",
      options: ["Built-in wardrobe", "Walk-in robe", "Study nook / desk", "Entertainment unit", "Laundry cabinetry", "Custom shelving"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Walk-in robe", value: 1.3 },
        { type: "multiplier", matchAnswer: "Custom shelving", value: 0.7 },
      ],
    },
    {
      id: "material", label: "Material Finish", category: "Joinery",
      options: ["Melamine / laminate", "2-pack painted", "Timber veneer", "Solid timber"],
      costEffect: [
        { type: "multiplier", matchAnswer: "2-pack painted", value: 1.3 },
        { type: "multiplier", matchAnswer: "Timber veneer", value: 1.4 },
        { type: "multiplier", matchAnswer: "Solid timber", value: 1.7 },
      ],
    },
  ],
};
