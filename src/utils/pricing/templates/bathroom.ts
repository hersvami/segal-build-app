import type { StageTemplate } from "../types";

export const bathroomStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Dust barriers, floor protection, temporary facilities", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Demolition and strip-out", description: "Remove existing fixtures, tiles, linings and waste", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 40 },
  { name: "Plumbing rough-in", description: "First fix — hot/cold pipework, waste and drainage to new positions", trade: "Plumbing Rough-In", unitRate: 1800, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 70 },
  { name: "Electrical rough-in", description: "First fix — cabling, back boxes for lights, fan, GPOs", trade: "Electrical Rough-In", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 80 },
  { name: "Plastering", description: "Plasterboard lining to walls and ceiling, set and sand", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 110 },
  { name: "Screed to shower and floor", description: "Fall to waste in shower, level floor screed", trade: "Screed", unitRate: 40, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 120 },
  { name: "Waterproofing", description: "Membrane waterproofing to shower, floor and walls per AS 3740", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3740", order: 130 },
  { name: "Tiling", description: "Floor and wall tiling including adhesive, grout and silicone", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 3, code: "AS 3958.1", order: 140 },
  { name: "Vanity and joinery install", description: "Vanity unit supply and install", trade: "Joinery", unitRate: 900, unitType: "allow", durationDays: 1, code: "AS 4386", order: 150 },
  { name: "Painting", description: "Ceiling and any untiled walls — prep, prime, two coats", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 170 },
  { name: "Plumbing fit-off", description: "Second fix — install toilet, basin, tapware, shower mixer, floor waste", trade: "Plumbing Fit-Off", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  { name: "Electrical fit-off", description: "Second fix — install lights, exhaust fan, GPOs, switches", trade: "Electrical Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 200 },
  { name: "Shower screen and mirror", description: "Supply and install shower screen and mirror/cabinet", trade: "Shower Screen", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210 },
  { name: "Final fix and accessories", description: "Towel rails, toilet roll holder, door hardware", trade: "Finishes", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 220 },
  { name: "Site clean", description: "Builder's clean — remove waste, wipe surfaces, mop floors", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
