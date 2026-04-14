import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const SECOND_STOREY_QUESTIONS: ScopeQuestion[] = [
  {
    id: "storey_scope",
    label: "Addition Scope",
    category: "Structure",
    options: ["Full second storey addition", "Partial second storey (above garage/portion)", "Attic conversion / roof raise"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Partial second storey (above garage/portion)", value: 0.7 },
      { type: "multiplier", matchAnswer: "Attic conversion / roof raise", value: 0.8 },
    ],
  },
  {
    id: "storey_roof",
    label: "Existing Roof Treatment",
    category: "Demolition",
    options: ["Full roof removal & new roof", "Partial roof removal", "Raise existing roof"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full roof removal & new roof", value: 1.15 },
      { type: "multiplier", matchAnswer: "Raise existing roof", value: 1.25 },
    ],
  },
  {
    id: "storey_stair",
    label: "Staircase Type",
    category: "Carpentry",
    options: ["Standard timber staircase", "Open-tread feature staircase", "Steel & timber combination", "Spiral staircase"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard timber staircase", stage: { name: "Staircase — standard timber", description: "Standard timber staircase supply and install including balustrade and handrail", trade: "Carpentry", unitRate: 6500, unitType: "allow", durationDays: 3, code: "AS 1657", order: 110, isFixed: true } },
      { type: "add_stage", matchAnswer: "Open-tread feature staircase", stage: { name: "Staircase — open-tread feature", description: "Open-tread feature staircase with glass/steel balustrade, supply and install", trade: "Carpentry", unitRate: 15000, unitType: "allow", durationDays: 5, code: "AS 1657", order: 110, isFixed: true } },
      { type: "add_stage", matchAnswer: "Steel & timber combination", stage: { name: "Staircase — steel & timber", description: "Steel stringer with timber treads staircase, supply and install", trade: "Steel Fabrication", unitRate: 18000, unitType: "allow", durationDays: 5, code: "AS 1657", order: 110, isFixed: true } },
      { type: "add_stage", matchAnswer: "Spiral staircase", stage: { name: "Staircase — spiral", description: "Spiral staircase supply and install including balustrade", trade: "Steel Fabrication", unitRate: 12000, unitType: "allow", durationDays: 4, code: "AS 1657", order: 110, isFixed: true } },
    ],
  },
  {
    id: "storey_cladding",
    label: "External Cladding",
    category: "External",
    options: ["Match existing (brick veneer)", "Weatherboard / timber cladding", "Rendered foam panel", "James Hardie fibre cement"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Weatherboard / timber cladding", value: 1.1 },
      { type: "multiplier", matchAnswer: "Rendered foam panel", value: 1.15 },
    ],
  },
  {
    id: "storey_ground_floor_mods",
    label: "Ground Floor Modifications",
    category: "Structure",
    options: ["Minimal ground floor changes", "Moderate reconfiguration", "Significant ground floor remodel"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Moderate reconfiguration", value: 1.15 },
      { type: "multiplier", matchAnswer: "Significant ground floor remodel", value: 1.3 },
    ],
  },
];

export const secondStorey: WorkCategory = {
  id: "second_storey",
  label: "Second Storey Addition",
  description: "Full or partial second storey addition, attic conversion, roof raise",
  icon: "🏢",
  trades: ["Engineering", "Demolition", "Scaffolding", "Concrete", "Steel Fabrication", "Carpentry", "Roofing", "Plumbing", "Electrical", "Insulation", "Plastering", "Cladding", "Windows", "Painting", "Cleaning"],
  stages: [
    { name: "Engineering & design documentation", description: "Structural engineer design, working drawings and building permit documentation", trade: "Engineering", unitRate: 8500, unitType: "allow", durationDays: 10, code: "AS 1170", order: 5, isFixed: true },
    { name: "Scaffolding erection", description: "Full scaffold erection to perimeter of building", trade: "Scaffolding", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 1576", order: 10 },
    { name: "Roof removal", description: "Remove existing roof — tiles/sheeting, battens, trusses/rafters and disposal", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 3, code: "AS 2601", order: 20 },
    { name: "Structural steel & beams", description: "Steel beams and columns to support second storey per engineer spec", trade: "Steel Fabrication", unitRate: 450, unitType: "linear", durationDays: 3, code: "AS 4100", order: 30 },
    { name: "First floor framing", description: "Floor joist system — LVL/engineered timber or steel, including bearers and joists", trade: "Carpentry", unitRate: 120, unitType: "area", durationDays: 5, code: "AS 1684", order: 40 },
    { name: "Floor sheeting", description: "Structural floor sheeting — particleboard or plywood", trade: "Carpentry", unitRate: 35, unitType: "area", durationDays: 2, code: "AS 1684", order: 45 },
    { name: "Wall framing — second storey", description: "Timber or steel wall framing to second storey including bracing", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 5, code: "AS 1684", order: 50 },
    { name: "Roof framing — new", description: "New roof framing — trusses or rafters per engineer specification", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 4, code: "AS 1684", order: 55 },
    { name: "Roof sheeting & sarking", description: "Metal roof sheeting, sarking and flashings", trade: "Roofing", unitRate: 75, unitType: "area", durationDays: 3, code: "AS 1562.1", order: 60 },
    { name: "Window installation", description: "Window supply and install to second storey", trade: "Windows", unitRate: 850, unitType: "item", durationDays: 2, code: "AS 2047", order: 65 },
    { name: "External cladding", description: "External wall cladding system — supply and install", trade: "Cladding", unitRate: 120, unitType: "area", durationDays: 5, code: "NCC 2022", order: 70 },
    { name: "Plumbing rough-in", description: "First fix plumbing to second storey — pipework and drainage", trade: "Plumbing", unitRate: 4500, unitType: "allow", durationDays: 3, code: "AS/NZS 3500", order: 80, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical to second storey — cabling, switchboard upgrade", trade: "Electrical", unitRate: 5500, unitType: "allow", durationDays: 3, code: "AS/NZS 3000", order: 85, isFixed: true },
    { name: "Insulation — walls & ceiling", description: "Wall and ceiling insulation batts per NCC Section J requirements", trade: "Insulation", unitRate: 18, unitType: "area", durationDays: 2, code: "NCC 2022 Section J", order: 90 },
    { name: "Plasterboard lining", description: "Plasterboard lining to walls and ceilings — fix, set, stop and finish", trade: "Plastering", unitRate: 48, unitType: "area", durationDays: 5, code: "AS/NZS 2589", order: 100 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — fixtures, tapware and connections", trade: "Plumbing", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 160, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights, fans", trade: "Electrical", unitRate: 4200, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 165, isFixed: true },
    { name: "Painting — internal & external", description: "Full paint system to all new internal and external surfaces", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 5, code: "AS/NZS 2311", order: 190 },
    { name: "Scaffolding dismantle", description: "Dismantle and remove all scaffolding", trade: "Scaffolding", unitRate: 15, unitType: "area", durationDays: 1, code: "AS/NZS 1576", order: 220 },
    { name: "Builder's clean", description: "Builder's clean — full site clean and practical completion", trade: "Cleaning", unitRate: 1200, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...SECOND_STOREY_QUESTIONS],
};
