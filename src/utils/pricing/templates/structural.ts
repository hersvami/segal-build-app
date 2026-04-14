import type { StageTemplate } from "../types";

export const structuralStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Full site setup including propping", trade: "Site Prep", unitRate: 650, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Engineering assessment", description: "Structural engineer review, design and certification", trade: "Engineering", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS 1170", order: 50, isFixed: true },
  { name: "Structural works", description: "Steel beam, framing, post and pad installation", trade: "Structural", unitRate: 220, unitType: "area", durationDays: 3, code: "AS 1684", order: 55 },
  { name: "Plastering and make good", description: "Replaster and make good around structural works", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 110 },
  { name: "Painting", description: "Touch-up and repaint affected areas", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 170 },
  { name: "Site clean", description: "Builder's clean", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
