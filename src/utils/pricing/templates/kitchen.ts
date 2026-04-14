import type { StageTemplate } from "../types";

export const kitchenStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Dust barriers, floor protection, temporary facilities", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Demolition and strip-out", description: "Remove existing kitchen, appliances, linings", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 40 },
  { name: "Framing and carpentry", description: "Wall framing modifications, bulkheads, blocking", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 2, code: "AS 1684", order: 60 },
  { name: "Plumbing rough-in", description: "First fix — hot/cold to new sink position, gas if required, dishwasher connection", trade: "Plumbing Rough-In", unitRate: 1800, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 70 },
  { name: "Electrical rough-in", description: "First fix — cabling for GPOs, lighting, rangehood, appliance circuits", trade: "Electrical Rough-In", unitRate: 1400, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 80 },
  { name: "Plastering", description: "Plasterboard walls and ceiling, set and sand", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 110 },
  { name: "Joinery and cabinetry install", description: "Kitchen cabinetry supply and install — base and overhead units", trade: "Joinery", unitRate: 800, unitType: "area", durationDays: 3, code: "AS 4386", order: 150 },
  { name: "Benchtops", description: "Benchtop supply, template and install", trade: "Stone/Masonry", unitRate: 500, unitType: "area", durationDays: 1, code: "NCC 2022", order: 160 },
  { name: "Splashback", description: "Splashback supply and install", trade: "Tiling", unitRate: 80, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 165 },
  { name: "Painting", description: "Walls and ceiling — prep, prime, two coats", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 170 },
  { name: "Plumbing fit-off", description: "Second fix — sink, mixer, dishwasher connection, gas connection", trade: "Plumbing Fit-Off", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  { name: "Electrical fit-off", description: "Second fix — GPOs, switches, downlights, rangehood connection", trade: "Electrical Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 200 },
  { name: "Final fix", description: "Handles, kickboards, appliance install, silicone", trade: "Finishes", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 220 },
  { name: "Site clean", description: "Builder's clean — remove waste, wipe surfaces", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
