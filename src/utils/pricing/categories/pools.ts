import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const pools: WorkCategory = {
  id: "pools",
  label: "Pools & Spas",
  description: "Pool construction, renovation, fencing compliance, spa installation",
  icon: "🏊",
  trades: ["Site Prep", "Excavation", "Concrete", "Plumbing", "Electrical", "Tiling", "Fencing", "Landscaping", "Cleaning"],
  stages: [
    { name: "Design & engineering", description: "Pool design, structural engineering and permit application", trade: "Engineering", unitRate: 3500, unitType: "allow", durationDays: 5, code: "AS 1926.1", order: 5, isFixed: true },
    { name: "Site preparation", description: "Site access, temporary fencing, service locating", trade: "Site Prep", unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Excavation", description: "Excavate pool shell — machine dig, remove spoil", trade: "Excavation", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 2783", order: 20 },
    { name: "Steel reinforcement", description: "Pool shell reinforcement — steel fixing", trade: "Concrete", unitRate: 85, unitType: "area", durationDays: 2, code: "AS 3600", order: 40 },
    { name: "Concrete shell (shotcrete)", description: "Spray concrete pool shell", trade: "Concrete", unitRate: 250, unitType: "area", durationDays: 2, code: "AS 3600", order: 50 },
    { name: "Plumbing & hydraulics", description: "Pool plumbing — pipework, returns, skimmer box, main drain", trade: "Plumbing", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 70, isFixed: true },
    { name: "Electrical & equipment", description: "Pool pump, filter, chlorinator, lighting — supply and install", trade: "Electrical", unitRate: 4500, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 80, isFixed: true },
    { name: "Waterproofing & rendering", description: "Render pool interior and apply waterproofing", trade: "Rendering", unitRate: 95, unitType: "area", durationDays: 3, code: "AS 3740", order: 100 },
    { name: "Tiling / interior finish", description: "Pool interior tiling or pebblecrete finish", trade: "Tiling", unitRate: 180, unitType: "area", durationDays: 3, code: "AS 3958.1", order: 120 },
    { name: "Coping & surrounds", description: "Pool coping stones and surrounding paving", trade: "Concrete", unitRate: 150, unitType: "area", durationDays: 2, code: "NCC 2022", order: 140 },
    { name: "Pool fencing", description: "Pool safety fencing — supply and install to AS 1926.1", trade: "Fencing", unitRate: 220, unitType: "area", durationDays: 2, code: "AS 1926.1", order: 160 },
    { name: "Fill, commission & handover", description: "Fill pool, balance water, commission equipment", trade: "Plumbing", unitRate: 800, unitType: "allow", durationDays: 2, code: "AS 1926.1", order: 200, isFixed: true },
    { name: "Builder's clean", description: "Site clean up, remove debris", trade: "Cleaning", unitRate: 500, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "pool_type", label: "Pool Type", category: "Pool",
      options: ["Concrete (shotcrete)", "Fibreglass", "Plunge pool / small", "Spa only"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Fibreglass", value: 0.7 },
        { type: "multiplier", matchAnswer: "Plunge pool / small", value: 0.6 },
        { type: "multiplier", matchAnswer: "Spa only", value: 0.4 },
      ],
    },
    {
      id: "heating", label: "Pool Heating", category: "Pool",
      options: ["No heating", "Solar heating", "Gas heating", "Heat pump"],
      costEffect: [
        { type: "add_stage", matchAnswer: "Solar heating", stage: { name: "Solar pool heating", description: "Roof-mounted solar pool heating system", trade: "Plumbing", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 85, isFixed: true } },
        { type: "add_stage", matchAnswer: "Gas heating", stage: { name: "Gas pool heater", description: "Gas pool heater supply, install and connect", trade: "Plumbing", unitRate: 3200, unitType: "allow", durationDays: 1, code: "AS/NZS 5601", order: 85, isFixed: true } },
        { type: "add_stage", matchAnswer: "Heat pump", stage: { name: "Heat pump pool heater", description: "Heat pump pool heater supply and install", trade: "Electrical", unitRate: 4500, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 85, isFixed: true } },
      ],
    },
  ],
};
