import type { StageTemplate } from "../types";

export const outdoorStages: StageTemplate[] = [
  { name: "Site setup", description: "Site prep and layout", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
  { name: "Demolition and site clear", description: "Remove existing structures and clear site", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 40 },
  { name: "Concrete footings and pads", description: "Excavate and pour footings per engineer spec", trade: "Concrete", unitRate: 180, unitType: "area", durationDays: 2, code: "AS 3600", order: 55 },
  { name: "Framing and structure", description: "Posts, bearers, joists and roof framing", trade: "Carpentry", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1684", order: 60 },
  { name: "Decking", description: "Deck boards supply and install", trade: "Decking", unitRate: 280, unitType: "area", durationDays: 3, code: "AS 1684", order: 180 },
  { name: "Roofing", description: "Roof sheeting, flashing and gutters", trade: "Roofing", unitRate: 120, unitType: "area", durationDays: 2, code: "AS 1562", order: 65 },
  { name: "Site clean", description: "Builder's clean and waste removal", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
];
