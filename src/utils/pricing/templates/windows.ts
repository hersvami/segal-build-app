import type { StageTemplate } from "./types";

export const windowsStages: StageTemplate[] = [
  { name: "Site setup", description: "Protection and setup", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Window removal", description: "Remove existing windows and dispose", trade: "Demolition", unitRate: 300, unitType: "allow", durationDays: 1, code: "AS 2601", order: 40 },
  { name: "Window supply and install", description: "New windows supply and install", trade: "Glazing", unitRate: 480, unitType: "area", durationDays: 2, code: "AS 1288", order: 210 },
  { name: "Plastering and make good", description: "Patch and repair around new windows", trade: "Plastering", unitRate: 350, unitType: "allow", durationDays: 1, code: "AS/NZS 2589", order: 110 },
  { name: "Painting", description: "Paint reveals and affected areas", trade: "Painting", unitRate: 250, unitType: "allow", durationDays: 1, code: "AS/NZS 2311", order: 170 },
  { name: "Site clean", description: "Builder's clean", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];