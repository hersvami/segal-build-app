import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const ELECTRICAL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "electrical_scope",
    label: "Electrical Work Type",
    category: "Electrical",
    options: ["Switchboard upgrade", "Full rewire", "Lighting upgrade", "Power point additions", "Solar panel install"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full rewire", value: 1.6 },
      { type: "multiplier", matchAnswer: "Solar panel install", value: 1.4 },
    ],
  },
  {
    id: "switchboard",
    label: "Switchboard",
    category: "Electrical",
    options: ["No change", "Upgrade to RCD compliant", "Full switchboard replacement"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Upgrade to RCD compliant", stage: { name: "Switchboard RCD upgrade", description: "Upgrade switchboard with safety switches (RCDs) to current standards", trade: "Electrical", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 35, isFixed: true } },
      { type: "add_stage", matchAnswer: "Full switchboard replacement", stage: { name: "Switchboard replacement", description: "Full switchboard replacement — new board, RCDs, circuit breakers", trade: "Electrical", unitRate: 2800, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 35, isFixed: true } },
    ],
  },
  {
    id: "lighting_type",
    label: "Lighting Type",
    category: "Electrical",
    options: ["Standard downlights", "LED strip / feature lighting", "Smart lighting (Clipsal/C-Bus)", "Pendant / decorative fixtures"],
    costEffect: [
      { type: "multiplier", matchAnswer: "LED strip / feature lighting", value: 1.2 },
      { type: "multiplier", matchAnswer: "Smart lighting (Clipsal/C-Bus)", value: 1.5 },
    ],
  },
];

export const electrical: WorkCategory = {
  id: "electrical",
  label: "Electrical",
  description: "Switchboard upgrade, rewire, lighting, solar, power points",
  icon: "⚡",
  trades: ["Site Prep", "Electrical", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation", description: "Isolate circuits, site protection", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Circuit assessment & planning", description: "Assess existing circuits, plan new layout, load calculations", trade: "Electrical", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 15, isFixed: true },
    { name: "Cable rough-in", description: "Run new cables, conduits and back boxes through walls/ceiling", trade: "Electrical", unitRate: 65, unitType: "area", durationDays: 3, code: "AS/NZS 3000", order: 40 },
    { name: "Plaster patching", description: "Patch and repair walls after cable installation", trade: "Plastering", unitRate: 30, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 70 },
    { name: "Electrical fit-off", description: "Install switches, GPOs, lights, fans and test", trade: "Electrical", unitRate: 55, unitType: "area", durationDays: 2, code: "AS/NZS 3000", order: 100 },
    { name: "Compliance testing & certificate", description: "Test and tag, insulation resistance, RCD testing — issue certificate of compliance", trade: "Electrical", unitRate: 350, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 200, isFixed: true },
    { name: "Paint touch-up", description: "Touch up paint to patched areas", trade: "Painting", unitRate: 15, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 210 },
    { name: "Builder's clean", description: "Clean up and debris removal", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...ELECTRICAL_QUESTIONS],
};
