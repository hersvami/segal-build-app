import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const insulation: WorkCategory = {
  id: "insulation",
  label: "Insulation & Energy",
  description: "Wall/ceiling insulation, double glazing, draught proofing, energy efficiency",
  icon: "🛡️",
  trades: ["Site Prep", "Insulation", "Carpentry", "Electrical", "Glazing", "Cleaning"],
  stages: [
    { name: "Energy assessment", description: "Energy efficiency assessment and recommendations", trade: "Administration", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022 Vol 2 Part 3.12", order: 5, isFixed: true },
    { name: "Site preparation", description: "Access setup, protect finishes", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Remove existing insulation", description: "Remove old or damaged insulation and dispose", trade: "Insulation", unitRate: 15, unitType: "area", durationDays: 1, code: "NCC 2022", order: 20 },
    { name: "Ceiling insulation", description: "Supply and install ceiling insulation batts (R4.0+)", trade: "Insulation", unitRate: 22, unitType: "area", durationDays: 2, code: "NCC 2022 Vol 2 Part 3.12", order: 50 },
    { name: "Wall insulation", description: "Supply and install wall insulation (R2.0+)", trade: "Insulation", unitRate: 35, unitType: "area", durationDays: 2, code: "NCC 2022 Vol 2 Part 3.12", order: 60 },
    { name: "Underfloor insulation", description: "Underfloor insulation batts or foil", trade: "Insulation", unitRate: 28, unitType: "area", durationDays: 2, code: "NCC 2022 Vol 2 Part 3.12", order: 70 },
    { name: "Draught proofing", description: "Seal gaps around doors, windows and penetrations", trade: "Carpentry", unitRate: 15, unitType: "area", durationDays: 1, code: "NCC 2022", order: 100 },
    { name: "Builder's clean", description: "Clean up insulation offcuts and debris", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "insulation_scope", label: "Insulation Scope", category: "Insulation",
      options: ["Ceiling only", "Ceiling + walls", "Full home (ceiling, walls, underfloor)", "Underfloor only"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Ceiling + walls", value: 1.4 },
        { type: "multiplier", matchAnswer: "Full home (ceiling, walls, underfloor)", value: 1.8 },
      ],
    },
  ],
};
