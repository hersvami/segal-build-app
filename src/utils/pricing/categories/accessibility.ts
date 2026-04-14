import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const accessibility: WorkCategory = {
  id: "accessibility",
  label: "Accessibility / SDA",
  description: "Ramps, grab rails, bathroom modifications, NDIS, wheelchair access",
  icon: "♿",
  trades: ["Site Prep", "Carpentry", "Concrete", "Plumbing", "Electrical", "Tiling", "Painting", "Cleaning"],
  stages: [
    { name: "OT assessment & design", description: "Occupational therapist assessment and modification design", trade: "Administration", unitRate: 800, unitType: "allow", durationDays: 2, code: "AS 1428.1", order: 5, isFixed: true },
    { name: "Site preparation", description: "Site setup and protection", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition & modification", description: "Remove existing fixtures, widen doorways, adjust levels", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 1428.1", order: 20 },
    { name: "Ramp construction", description: "Construct compliant access ramp with handrails", trade: "Concrete", unitRate: 350, unitType: "area", durationDays: 3, code: "AS 1428.1", order: 40 },
    { name: "Grab rails & supports", description: "Supply and install grab rails, shower seats, support rails", trade: "Carpentry", unitRate: 180, unitType: "allow", durationDays: 1, code: "AS 1428.1", order: 80, isFixed: true },
    { name: "Bathroom modifications", description: "Hobless shower, raised toilet, accessible vanity", trade: "Plumbing", unitRate: 2800, unitType: "allow", durationDays: 3, code: "AS 1428.1", order: 100, isFixed: true },
    { name: "Non-slip flooring", description: "Non-slip floor treatment or replacement", trade: "Tiling", unitRate: 95, unitType: "area", durationDays: 1, code: "AS/NZS 4586", order: 130 },
    { name: "Electrical modifications", description: "Adjust switch/GPO heights, emergency call system", trade: "Electrical", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 160, isFixed: true },
    { name: "Painting & finishing", description: "Paint and finish to modified areas", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Clean up and handover", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "ndis_funded", label: "NDIS / Funding", category: "Compliance",
      options: ["Private / self-funded", "NDIS funded (SDA)", "Home Care Package", "DVA funded"],
    },
    {
      id: "access_scope", label: "Modification Scope", category: "Access",
      options: ["Bathroom only", "Bathroom + access ramp", "Full home modification", "Kitchen modification"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Bathroom + access ramp", value: 1.3 },
        { type: "multiplier", matchAnswer: "Full home modification", value: 2.0 },
      ],
    },
  ],
};
