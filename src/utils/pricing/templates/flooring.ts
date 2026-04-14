import type { StageTemplate } from "../types";

export const flooringStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Floor protection to non-work areas, dust barriers", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Existing floor removal", description: "Remove existing floor covering and dispose", trade: "Demolition", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 2601", order: 40 },
  { name: "Subfloor preparation", description: "Grinding, levelling compound, moisture testing", trade: "Screed", unitRate: 40, unitType: "area", durationDays: 1, code: "NCC 2022", order: 120 },
  { name: "Floor installation", description: "Supply and install selected floor system", trade: "Flooring", unitRate: 95, unitType: "area", durationDays: 2, code: "NCC 2022", order: 180 },
  { name: "Skirting boards", description: "Supply and install skirting boards", trade: "Skirting", unitRate: 25, unitType: "area", durationDays: 1, code: "NCC 2022", order: 220 },
  { name: "Site clean", description: "Final clean and handover", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
