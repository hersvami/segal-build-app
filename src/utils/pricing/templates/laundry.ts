import type { StageTemplate } from "./types";

export const laundryStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Dust barriers, floor protection", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Demolition and strip-out", description: "Remove existing fittings and finishes", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 1, code: "AS 2601", order: 40 },
  { name: "Plumbing rough-in", description: "First fix — tub, washing machine, dryer connections", trade: "Plumbing Rough-In", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 70 },
  { name: "Electrical rough-in", description: "First fix — GPOs for washer/dryer, lighting", trade: "Electrical Rough-In", unitRate: 900, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 80 },
  { name: "Plastering", description: "Plasterboard walls and ceiling", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 110 },
  { name: "Waterproofing", description: "Floor waterproofing per AS 3740", trade: "Waterproofing", unitRate: 75, unitType: "area", durationDays: 1, code: "AS 3740", order: 130 },
  { name: "Tiling", description: "Floor tiling", trade: "Tiling", unitRate: 110, unitType: "area", durationDays: 2, code: "AS 3958.1", order: 140 },
  { name: "Joinery install", description: "Cabinetry and benchtop install", trade: "Joinery", unitRate: 600, unitType: "area", durationDays: 2, code: "AS 4386", order: 150 },
  { name: "Painting", description: "Walls and ceiling paint", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 170 },
  { name: "Plumbing fit-off", description: "Second fix — tub, taps, machine connections", trade: "Plumbing Fit-Off", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  { name: "Electrical fit-off", description: "Second fix — GPOs, light, switches", trade: "Electrical Fit-Off", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 200 },
  { name: "Site clean", description: "Builder's clean", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];