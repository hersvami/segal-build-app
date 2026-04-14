import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const heritage: WorkCategory = {
  id: "heritage",
  label: "Heritage & Restoration",
  description: "Heritage façade, period features, heritage compliance, restoration",
  icon: "🏛️",
  trades: ["Site Prep", "Scaffolding", "Demolition", "Carpentry", "Bricklaying", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Heritage assessment", description: "Heritage architect assessment and recommendations", trade: "Administration", unitRate: 2500, unitType: "allow", durationDays: 3, code: "Heritage Act 2017 (Vic)", order: 3, isFixed: true },
    { name: "Heritage permit application", description: "Prepare and lodge heritage permit with Heritage Victoria or council", trade: "Administration", unitRate: 3500, unitType: "allow", durationDays: 10, code: "Heritage Act 2017", order: 5, isFixed: true },
    { name: "Site preparation & scaffolding", description: "Heritage-sensitive site setup, protection of significant fabric", trade: "Site Prep", unitRate: 1200, unitType: "allow", durationDays: 2, code: "Burra Charter", order: 10, isFixed: true },
    { name: "Careful demolition / strip-back", description: "Careful removal of non-original fabric, salvage heritage elements", trade: "Demolition", unitRate: 85, unitType: "area", durationDays: 3, code: "Burra Charter", order: 20 },
    { name: "Structural stabilisation", description: "Stabilise and repair original structural elements", trade: "Carpentry", unitRate: 150, unitType: "area", durationDays: 4, code: "AS 1684", order: 40 },
    { name: "Brick repointing", description: "Rake out and repoint original brickwork with lime mortar", trade: "Bricklaying", unitRate: 120, unitType: "area", durationDays: 4, code: "AS 3700", order: 60 },
    { name: "Timber restoration", description: "Repair, splice and restore original timber elements", trade: "Carpentry", unitRate: 180, unitType: "area", durationDays: 5, code: "NCC 2022", order: 80 },
    { name: "Plaster restoration", description: "Restore original plaster mouldings, cornices, ceiling roses", trade: "Plastering", unitRate: 95, unitType: "area", durationDays: 3, code: "AS/NZS 2589", order: 100 },
    { name: "Heritage painting", description: "Heritage colour scheme painting — lime wash or traditional paint", trade: "Painting", unitRate: 45, unitType: "area", durationDays: 3, code: "AS/NZS 2311", order: 190 },
    { name: "Documentation & certification", description: "As-built documentation and heritage compliance sign-off", trade: "Administration", unitRate: 1200, unitType: "allow", durationDays: 2, code: "Heritage Act 2017", order: 220, isFixed: true },
    { name: "Builder's clean", description: "Heritage-sensitive clean up", trade: "Cleaning", unitRate: 500, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "heritage_scope", label: "Heritage Scope", category: "Heritage",
      options: ["Façade restoration", "Interior restoration", "Full building restoration", "Period feature reinstatement"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Full building restoration", value: 1.8 },
        { type: "multiplier", matchAnswer: "Period feature reinstatement", value: 1.4 },
      ],
    },
    {
      id: "heritage_overlay", label: "Heritage Overlay", category: "Compliance",
      options: ["No overlay", "Council heritage overlay (HO)", "Heritage Victoria listed", "National Trust registered"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Heritage Victoria listed", value: 1.3 },
        { type: "multiplier", matchAnswer: "National Trust registered", value: 1.2 },
      ],
    },
  ],
};
