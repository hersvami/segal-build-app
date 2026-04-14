import type { StageTemplate } from "../types";

export const paintingStages: StageTemplate[] = [
  { name: "Site setup and protection", description: "Drop sheets, masking, furniture cover", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Surface preparation", description: "Patch, sand, scrape, prime — all surfaces", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 115 },
  { name: "Painting — walls and ceilings", description: "Two coats premium acrylic to walls and ceilings", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 3, code: "AS/NZS 2311", order: 170 },
  { name: "Painting — trim and doors", description: "Sand, prime and two coats to skirting, architraves, doors", trade: "Painting", unitRate: 20, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 175 },
  { name: "Site clean", description: "Remove masking, drop sheets, clean", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
