import type { StageTemplate } from "../types";

export const generalStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Dust barriers, floor protection and setup", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Demolition and strip-out", description: "Strip out and disposal", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 40 },
  { name: "Core trade works", description: "General construction works", trade: "General", unitRate: 180, unitType: "area", durationDays: 3, code: "NCC 2022", order: 100 },
  { name: "Painting", description: "Walls and ceiling paint", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 170 },
  { name: "Site clean", description: "Builder's clean and handover", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
