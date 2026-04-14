import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const MULTI_UNIT_QUESTIONS: ScopeQuestion[] = [
  {
    id: "multi_unit_count",
    label: "Number of Units",
    category: "Scale",
    options: ["2 units (dual occupancy)", "3 units (triplex)", "4-6 units", "7-10 units"],
    costEffect: [
      { type: "multiplier", matchAnswer: "3 units (triplex)", value: 1.4 },
      { type: "multiplier", matchAnswer: "4-6 units", value: 2.2 },
      { type: "multiplier", matchAnswer: "7-10 units", value: 3.5 },
    ],
  },
  {
    id: "multi_unit_type",
    label: "Development Type",
    category: "Structure",
    options: ["Side-by-side townhouses", "Front & rear units", "Stacked (2 storey) units", "Mixed — combination"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Stacked (2 storey) units", value: 1.25 },
      { type: "multiplier", matchAnswer: "Mixed — combination", value: 1.15 },
    ],
  },
  {
    id: "multi_demolish_existing",
    label: "Existing Dwelling",
    category: "Demolition",
    options: ["Vacant land — no demolition", "Demolish existing house", "Retain & renovate existing + add units"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Demolish existing house", stage: { name: "Full house demolition", description: "Full demolition of existing dwelling including disconnection of services, asbestos assessment, demolition and disposal", trade: "Demolition", unitRate: 25000, unitType: "allow", durationDays: 5, code: "AS 2601", order: 8, isFixed: true } },
      { type: "multiplier", matchAnswer: "Retain & renovate existing + add units", value: 1.2 },
    ],
  },
  {
    id: "multi_fire_separation",
    label: "Fire Separation Walls",
    category: "Fire Safety",
    options: ["Standard inter-tenancy fire wall", "Enhanced acoustic + fire wall", "Fire-rated construction throughout"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Enhanced acoustic + fire wall", value: 1.1 },
      { type: "multiplier", matchAnswer: "Fire-rated construction throughout", value: 1.2 },
    ],
  },
  {
    id: "multi_common_areas",
    label: "Common Areas",
    category: "External",
    options: ["Minimal — individual access only", "Shared driveway only", "Shared driveway + landscaped common area", "Common area with visitor parking"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Shared driveway + landscaped common area", stage: { name: "Common area landscaping", description: "Shared landscaping — garden beds, turf, irrigation and fencing", trade: "Landscaping", unitRate: 8500, unitType: "allow", durationDays: 3, code: "NCC 2022", order: 205, isFixed: true } },
      { type: "add_stage", matchAnswer: "Common area with visitor parking", stage: { name: "Visitor parking construction", description: "Visitor parking area — base prep, formwork, concrete and line marking", trade: "Concrete", unitRate: 12000, unitType: "allow", durationDays: 3, code: "AS 2890", order: 205, isFixed: true } },
    ],
  },
];

export const multiUnit: WorkCategory = {
  id: "multi_unit",
  label: "Multi-Unit Development",
  description: "Dual occupancy, townhouses, triplexes and small-scale multi-unit development",
  icon: "🏘️",
  trades: ["Engineering", "Surveying", "Demolition", "Excavation", "Concrete", "Steel Fabrication", "Carpentry", "Roofing", "Bricklaying", "Plumbing", "Electrical", "HVAC", "Insulation", "Plastering", "Tiling", "Joinery", "Painting", "Landscaping", "Cleaning"],
  stages: [
    { name: "Survey, design & permits", description: "Site survey, architectural design, engineering and building permit", trade: "Engineering", unitRate: 25000, unitType: "allow", durationDays: 20, code: "NCC 2022", order: 5, isFixed: true },
    { name: "Site clearing & earthworks", description: "Clear site, demolish existing (if applicable), strip topsoil, bulk earthworks", trade: "Excavation", unitRate: 35, unitType: "area", durationDays: 5, code: "AS 3798", order: 10 },
    { name: "Sewer & stormwater infrastructure", description: "Main sewer and stormwater connections, pits and pipework per authority requirements", trade: "Plumbing", unitRate: 15000, unitType: "allow", durationDays: 5, code: "AS/NZS 3500", order: 12, isFixed: true },
    { name: "Footing excavation & preparation", description: "Excavate all strip footings, pier holes per engineer specification", trade: "Excavation", unitRate: 35, unitType: "linear", durationDays: 3, code: "AS 2870", order: 15 },
    { name: "Under-slab plumbing", description: "Under-slab plumbing to all units — sewer, water, gas", trade: "Plumbing", unitRate: 4500, unitType: "allow", durationDays: 4, code: "AS/NZS 3500", order: 18, isFixed: true },
    { name: "Concrete slab pour — all units", description: "Concrete slab pour to all units — 25MPa, mesh, vapour barrier, edge boards", trade: "Concrete", unitRate: 95, unitType: "area", durationDays: 5, code: "AS 2870", order: 25 },
    { name: "Wall framing — all units", description: "Wall framing including inter-tenancy fire walls per NCC", trade: "Carpentry", unitRate: 90, unitType: "area", durationDays: 12, code: "AS 1684", order: 35 },
    { name: "Roof framing — all units", description: "Roof trusses/rafters — supply, crane and install to all units", trade: "Carpentry", unitRate: 70, unitType: "area", durationDays: 8, code: "AS 1684", order: 40 },
    { name: "Roof sheeting & sarking", description: "Metal roof sheeting, sarking, flashings and guttering to all units", trade: "Roofing", unitRate: 78, unitType: "area", durationDays: 5, code: "AS 1562.1", order: 45 },
    { name: "External cladding — all units", description: "External wall cladding — brick veneer, render or fibre cement to all units", trade: "Bricklaying", unitRate: 145, unitType: "area", durationDays: 15, code: "AS 3700", order: 50 },
    { name: "Windows & external doors", description: "Aluminium windows and external doors — supply and install to all units", trade: "Joinery", unitRate: 850, unitType: "item", durationDays: 5, code: "AS 2047", order: 55 },
    { name: "Plumbing rough-in — all units", description: "First fix plumbing to all units — hot/cold water, gas, drainage", trade: "Plumbing", unitRate: 6500, unitType: "allow", durationDays: 6, code: "AS/NZS 3500", order: 60, isFixed: true },
    { name: "Electrical rough-in — all units", description: "First fix electrical to all units — switchboards, cabling, sub-mains", trade: "Electrical", unitRate: 7500, unitType: "allow", durationDays: 6, code: "AS/NZS 3000", order: 65, isFixed: true },
    { name: "HVAC rough-in — all units", description: "Split system or ducted rough-in to all units", trade: "HVAC", unitRate: 4000, unitType: "allow", durationDays: 4, code: "AS/NZS 3823", order: 68, isFixed: true },
    { name: "Insulation — all units", description: "Full insulation package to all units per NCC Section J", trade: "Insulation", unitRate: 22, unitType: "area", durationDays: 4, code: "NCC 2022 Section J", order: 70 },
    { name: "Plasterboard — all units", description: "Plasterboard lining to all internal walls and ceilings", trade: "Plastering", unitRate: 48, unitType: "area", durationDays: 12, code: "AS/NZS 2589", order: 80 },
    { name: "Waterproofing — all wet areas", description: "Waterproofing to all bathrooms, ensuites, laundries per AS 3740", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 3, code: "AS 3740", order: 85 },
    { name: "Tiling — all wet areas", description: "Floor and wall tiling to all wet areas", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 10, code: "AS 3958.1", order: 90 },
    { name: "Kitchen cabinetry — all units", description: "Kitchen cabinets and benchtops to all units", trade: "Joinery", unitRate: 12000, unitType: "allow", durationDays: 6, code: "NCC 2022", order: 100, isFixed: true },
    { name: "Internal joinery — all units", description: "Internal doors, architraves, skirting, robes to all units", trade: "Joinery", unitRate: 450, unitType: "item", durationDays: 8, code: "NCC 2022", order: 105 },
    { name: "Plumbing fit-off — all units", description: "Final fix plumbing to all units — fixtures, tapware, appliances", trade: "Plumbing", unitRate: 5000, unitType: "allow", durationDays: 4, code: "AS/NZS 3500", order: 140, isFixed: true },
    { name: "Electrical fit-off — all units", description: "Final fix electrical to all units — switches, GPOs, lights, smoke alarms", trade: "Electrical", unitRate: 6000, unitType: "allow", durationDays: 4, code: "AS/NZS 3000", order: 145, isFixed: true },
    { name: "Painting — all units", description: "Full paint system to all units — internal and external", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 10, code: "AS/NZS 2311", order: 170 },
    { name: "Floor coverings — all units", description: "Floor coverings to all units — carpet, timber, vinyl as specified", trade: "Flooring", unitRate: 65, unitType: "area", durationDays: 5, code: "NCC 2022", order: 180 },
    { name: "Driveways & crossover", description: "Shared driveway, individual crossovers, concrete or paved", trade: "Concrete", unitRate: 95, unitType: "area", durationDays: 4, code: "AS 3600", order: 200 },
    { name: "Fencing — all boundaries", description: "Boundary and dividing fencing — Colorbond or timber", trade: "Fencing", unitRate: 120, unitType: "linear", durationDays: 3, code: "AS 1926", order: 205 },
    { name: "Landscaping — all units", description: "Landscaping, paths, clotheslines, letterboxes and turf to all units", trade: "Landscaping", unitRate: 12000, unitType: "allow", durationDays: 5, code: "NCC 2022", order: 210, isFixed: true },
    { name: "Detail clean & handover", description: "Full detail clean to all units, defect inspection and practical completion", trade: "Cleaning", unitRate: 4500, unitType: "allow", durationDays: 3, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...MULTI_UNIT_QUESTIONS],
};
