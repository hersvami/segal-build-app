import type { StageTemplate } from "./types";

export const livingStages: StageTemplate[] = [
  { name: "Site setup", description: "Protection and setup", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Electrical rough-in", description: "First fix — cabling for lights, GPOs, TV/data points", trade: "Electrical Rough-In", unitRate: 1100, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 80 },
  { name: "Plastering", description: "Plasterboard walls and ceiling", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 110 },
  { name: "Painting", description: "Walls and ceiling — prep, prime, two coats", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 170 },
  { name: "Flooring", description: "Floor covering supply and install", trade: "Flooring", unitRate: 95, unitType: "area", durationDays: 2, code: "NCC 2022", order: 180 },
  { name: "Electrical fit-off", description: "Second fix — switches, GPOs, lights, TV points", trade: "Electrical Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 200 },
  { name: "Skirting boards", description: "Supply and install skirting", trade: "Skirting", unitRate: 25, unitType: "area", durationDays: 1, code: "NCC 2022", order: 220 },
  { name: "Site clean", description: "Builder's clean", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];