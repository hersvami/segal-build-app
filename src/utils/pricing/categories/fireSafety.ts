import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const fireSafety: WorkCategory = {
  id: "fire_safety",
  label: "Fire & Safety",
  description: "Smoke alarms, fire doors, sprinklers, BAL compliance, bushfire protection",
  icon: "🔥",
  trades: ["Site Prep", "Fire Protection", "Electrical", "Carpentry", "Cleaning"],
  stages: [
    { name: "Site assessment", description: "Fire safety assessment and compliance review", trade: "Fire Protection", unitRate: 650, unitType: "allow", durationDays: 1, code: "NCC 2022 Vol 2", order: 10, isFixed: true },
    { name: "Smoke alarm upgrade", description: "Supply and install interconnected smoke alarms to current standards", trade: "Electrical", unitRate: 85, unitType: "area", durationDays: 1, code: "AS 3786", order: 40 },
    { name: "Fire door installation", description: "Supply and install fire-rated doors with hardware", trade: "Carpentry", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1905.1", order: 60, isFixed: true },
    { name: "Fire stopping & sealing", description: "Fire stopping to penetrations — intumescent sealant and collars", trade: "Fire Protection", unitRate: 45, unitType: "area", durationDays: 1, code: "AS 1530.4", order: 80 },
    { name: "Emergency lighting", description: "Supply and install emergency exit and egress lighting", trade: "Electrical", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS 2293", order: 100, isFixed: true },
    { name: "Certification", description: "Fire safety certification and compliance documentation", trade: "Fire Protection", unitRate: 500, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 220, isFixed: true },
    { name: "Builder's clean", description: "Clean up and site tidy", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "fire_scope", label: "Fire Safety Scope", category: "Fire",
      options: ["Smoke alarm upgrade only", "Full fire safety upgrade", "BAL compliance (bushfire)", "Sprinkler system install"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Full fire safety upgrade", value: 1.5 },
        { type: "multiplier", matchAnswer: "BAL compliance (bushfire)", value: 1.8 },
        { type: "multiplier", matchAnswer: "Sprinkler system install", value: 2.5 },
      ],
    },
  ],
};
