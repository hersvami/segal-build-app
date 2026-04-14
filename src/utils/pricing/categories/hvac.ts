import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const HVAC_QUESTIONS: ScopeQuestion[] = [
  {
    id: "hvac_type",
    label: "System Type",
    category: "HVAC",
    options: ["Split system (single)", "Multi-split system", "Ducted reverse cycle", "Evaporative cooling", "Hydronic heating"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Ducted reverse cycle", value: 1.8 },
      { type: "multiplier", matchAnswer: "Multi-split system", value: 1.4 },
      { type: "multiplier", matchAnswer: "Hydronic heating", value: 2.0 },
    ],
  },
  {
    id: "ductwork",
    label: "Ductwork Required",
    category: "HVAC",
    options: ["No ductwork", "Modify existing ducts", "New ductwork throughout"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Modify existing ducts", stage: { name: "Ductwork modification", description: "Modify existing ductwork — extend, reroute or resize", trade: "HVAC", unitRate: 1200, unitType: "allow", durationDays: 2, code: "AS 1668", order: 55, isFixed: true } },
      { type: "add_stage", matchAnswer: "New ductwork throughout", stage: { name: "New ductwork installation", description: "Full ductwork installation — supply and install throughout", trade: "HVAC", unitRate: 85, unitType: "area", durationDays: 3, code: "AS 1668", order: 55 } },
    ],
  },
  {
    id: "zone_control",
    label: "Zone Control",
    category: "HVAC",
    options: ["Single zone", "Multi-zone (2–4 zones)", "Smart zone control (iZone/MyAir)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Multi-zone (2–4 zones)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Smart zone control (iZone/MyAir)", value: 1.3 },
    ],
  },
];

export const hvac: WorkCategory = {
  id: "hvac",
  label: "HVAC / Air Conditioning",
  description: "Split systems, ducted, evaporative, ventilation, hydronic",
  icon: "❄️",
  trades: ["Site Prep", "HVAC", "Electrical", "Carpentry", "Plastering", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Site access, protect flooring and walls", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "System design & sizing", description: "Heat load calculation, system design and equipment selection", trade: "HVAC", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS 1668", order: 15, isFixed: true },
    { name: "Electrical supply", description: "Dedicated circuit for HVAC unit — cable, isolator and connection", trade: "Electrical", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 30, isFixed: true },
    { name: "Pipework & refrigerant lines", description: "Run refrigerant pipework, insulate and connect", trade: "HVAC", unitRate: 55, unitType: "area", durationDays: 2, code: "AS/NZS 5149", order: 50 },
    { name: "Indoor unit installation", description: "Mount and install indoor unit(s) — wall/ceiling/floor", trade: "HVAC", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS/NZS 5149", order: 80, isFixed: true },
    { name: "Outdoor unit installation", description: "Mount outdoor condensing unit on pad/bracket", trade: "HVAC", unitRate: 500, unitType: "allow", durationDays: 1, code: "AS/NZS 5149", order: 90, isFixed: true },
    { name: "Commissioning & testing", description: "Vacuum, charge, commission and test system", trade: "HVAC", unitRate: 400, unitType: "allow", durationDays: 1, code: "AS/NZS 5149", order: 180, isFixed: true },
    { name: "Plaster patching & paint touch-up", description: "Patch and paint any penetrations", trade: "Plastering", unitRate: 20, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 200 },
    { name: "Builder's clean", description: "Clean up and site tidy", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...HVAC_QUESTIONS],
};
