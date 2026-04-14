import type { StageTemplate } from "../types";

export const roofingStages: StageTemplate[] = [
  { name: "Site setup and scaffolding", description: "Scaffolding erect, safety setup", trade: "Scaffolding", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 10, isFixed: true },
  { name: "Roof strip and removal", description: "Remove existing roofing material and dispose", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 2, code: "AS 2601", order: 40 },
  { name: "Roof carpentry repairs", description: "Replace damaged rafters, battens, fascia", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 2, code: "AS 1684", order: 60 },
  { name: "Insulation", description: "Roof insulation supply and install", trade: "Insulation", unitRate: 30, unitType: "area", durationDays: 1, code: "NCC 2022 Vol 2 Part 3.12", order: 100 },
  { name: "New roof sheeting", description: "Colorbond roof sheeting, flashing and ridge capping", trade: "Roofing", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1562", order: 65 },
  { name: "Gutters and downpipes", description: "New gutters and downpipes", trade: "Guttering", unitRate: 45, unitType: "area", durationDays: 1, code: "AS/NZS 3500.3", order: 66 },
  { name: "Scaffolding dismantle", description: "Dismantle and remove scaffolding", trade: "Scaffolding", unitRate: 500, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 235, isFixed: true },
  { name: "Site clean", description: "Ground clean and waste removal", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
