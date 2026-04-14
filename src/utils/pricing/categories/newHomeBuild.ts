import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const NEW_HOME_QUESTIONS: ScopeQuestion[] = [
  {
    id: "home_size",
    label: "Home Size (approx m²)",
    category: "Dimensions",
    options: ["Small — under 120m²", "Medium — 120-200m²", "Large — 200-300m²", "Very large — 300m²+"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Small — under 120m²", value: 1.1 },
      { type: "multiplier", matchAnswer: "Large — 200-300m²", value: 0.95 },
      { type: "multiplier", matchAnswer: "Very large — 300m²+", value: 0.9 },
    ],
  },
  {
    id: "home_storeys",
    label: "Number of Storeys",
    category: "Structure",
    options: ["Single storey", "Double storey", "Split level"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Double storey", value: 1.25 },
      { type: "multiplier", matchAnswer: "Split level", value: 1.3 },
    ],
  },
  {
    id: "home_site_class",
    label: "Site Classification",
    category: "Foundation",
    options: ["Class A — rock/sand", "Class S — slightly reactive", "Class M — moderately reactive", "Class H — highly reactive", "Class E — extremely reactive", "Class P — problem site"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Class H — highly reactive", value: 1.15 },
      { type: "multiplier", matchAnswer: "Class E — extremely reactive", value: 1.3 },
      { type: "multiplier", matchAnswer: "Class P — problem site", value: 1.5 },
    ],
  },
  {
    id: "home_finish_level",
    label: "Finish Level",
    category: "Finishes",
    options: ["Basic / project home standard", "Mid-range / quality finishes", "High-end / premium finishes", "Luxury / architect designed"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Mid-range / quality finishes", value: 1.2 },
      { type: "multiplier", matchAnswer: "High-end / premium finishes", value: 1.45 },
      { type: "multiplier", matchAnswer: "Luxury / architect designed", value: 1.8 },
    ],
  },
  {
    id: "home_garage",
    label: "Garage",
    category: "Structure",
    options: ["No garage", "Single garage", "Double garage", "Triple garage"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Single garage", stage: { name: "Single garage construction", description: "Single garage — slab, framing, roof, roller door and fit-out", trade: "Carpentry", unitRate: 18000, unitType: "allow", durationDays: 5, code: "AS 1684", order: 115, isFixed: true } },
      { type: "add_stage", matchAnswer: "Double garage", stage: { name: "Double garage construction", description: "Double garage — slab, framing, roof, roller doors and fit-out", trade: "Carpentry", unitRate: 28000, unitType: "allow", durationDays: 7, code: "AS 1684", order: 115, isFixed: true } },
      { type: "add_stage", matchAnswer: "Triple garage", stage: { name: "Triple garage construction", description: "Triple garage — slab, framing, roof, roller doors and fit-out", trade: "Carpentry", unitRate: 38000, unitType: "allow", durationDays: 10, code: "AS 1684", order: 115, isFixed: true } },
    ],
  },
  {
    id: "home_driveway",
    label: "Driveway",
    category: "External",
    options: ["Not included", "Standard concrete driveway", "Exposed aggregate driveway", "Paved driveway"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard concrete driveway", stage: { name: "Driveway — standard concrete", description: "Standard concrete driveway including base prep, formwork and finish", trade: "Concrete", unitRate: 85, unitType: "area", durationDays: 2, code: "AS 3600", order: 210 } },
      { type: "add_stage", matchAnswer: "Exposed aggregate driveway", stage: { name: "Driveway — exposed aggregate", description: "Exposed aggregate concrete driveway including base prep, formwork and finish", trade: "Concrete", unitRate: 120, unitType: "area", durationDays: 2, code: "AS 3600", order: 210 } },
      { type: "add_stage", matchAnswer: "Paved driveway", stage: { name: "Driveway — paved", description: "Paved driveway including base prep, sand bed and paver laying", trade: "Paving", unitRate: 95, unitType: "area", durationDays: 3, code: "AS 3727", order: 210 } },
    ],
  },
];

export const newHomeBuild: WorkCategory = {
  id: "new_home_build",
  label: "New Home Build",
  description: "Complete new house construction — single or double storey",
  icon: "🏡",
  trades: ["Engineering", "Surveying", "Excavation", "Concrete", "Steel Fabrication", "Carpentry", "Roofing", "Bricklaying", "Plumbing", "Electrical", "HVAC", "Insulation", "Plastering", "Tiling", "Joinery", "Painting", "Landscaping", "Cleaning"],
  stages: [
    { name: "Site survey & set-out", description: "Site survey, building set-out and level pegging", trade: "Surveying", unitRate: 2500, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 5, isFixed: true },
    { name: "Site clearing & earthworks", description: "Clear site, strip topsoil, cut/fill to design levels", trade: "Excavation", unitRate: 25, unitType: "area", durationDays: 3, code: "AS 3798", order: 10 },
    { name: "Footing excavation", description: "Excavate strip footings and pier holes per engineer spec", trade: "Excavation", unitRate: 35, unitType: "linear", durationDays: 2, code: "AS 2870", order: 15 },
    { name: "Plumbing under-slab", description: "Under-slab plumbing — sewer, stormwater, water supply and gas", trade: "Plumbing", unitRate: 6500, unitType: "allow", durationDays: 3, code: "AS/NZS 3500", order: 18, isFixed: true },
    { name: "Slab preparation — mesh & vapour barrier", description: "Vapour barrier, steel mesh, edge boards and chairs per engineer spec", trade: "Concrete", unitRate: 45, unitType: "area", durationDays: 2, code: "AS 2870", order: 20 },
    { name: "Concrete slab pour", description: "Concrete slab pour — 25MPa, power float finish", trade: "Concrete", unitRate: 85, unitType: "area", durationDays: 2, code: "AS 2870", order: 25 },
    { name: "Wall framing", description: "Timber or steel wall framing including top/bottom plates, studs, bracing", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 8, code: "AS 1684", order: 35 },
    { name: "Roof framing", description: "Roof trusses or rafters — supply, crane and install", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 5, code: "AS 1684", order: 40 },
    { name: "Roof sheeting & sarking", description: "Metal roof sheeting, sarking, flashings and ridge capping", trade: "Roofing", unitRate: 75, unitType: "area", durationDays: 4, code: "AS 1562.1", order: 45 },
    { name: "Brickwork / external cladding", description: "External wall cladding — brick veneer, weatherboard or fibre cement", trade: "Bricklaying", unitRate: 140, unitType: "area", durationDays: 10, code: "AS 3700", order: 50 },
    { name: "Window & door installation", description: "Aluminium windows and external doors — supply and install", trade: "Joinery", unitRate: 850, unitType: "item", durationDays: 3, code: "AS 2047", order: 55 },
    { name: "Plumbing rough-in", description: "First fix plumbing — hot/cold water, gas, drainage", trade: "Plumbing", unitRate: 8500, unitType: "allow", durationDays: 5, code: "AS/NZS 3500", order: 60, isFixed: true },
    { name: "Electrical rough-in", description: "First fix electrical — switchboard, cabling, back boxes throughout", trade: "Electrical", unitRate: 9500, unitType: "allow", durationDays: 5, code: "AS/NZS 3000", order: 65, isFixed: true },
    { name: "HVAC rough-in", description: "Heating/cooling ducting and refrigerant piping rough-in", trade: "HVAC", unitRate: 5500, unitType: "allow", durationDays: 3, code: "AS/NZS 3823", order: 68, isFixed: true },
    { name: "Insulation — walls, ceiling, underfloor", description: "Full insulation package per NCC Section J energy requirements", trade: "Insulation", unitRate: 22, unitType: "area", durationDays: 3, code: "NCC 2022 Section J", order: 70 },
    { name: "Plasterboard lining", description: "Plasterboard to all internal walls and ceilings — fix, set, stop and finish", trade: "Plastering", unitRate: 48, unitType: "area", durationDays: 10, code: "AS/NZS 2589", order: 80 },
    { name: "Waterproofing — wet areas", description: "Waterproofing membranes to all wet areas per AS 3740", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 2, code: "AS 3740", order: 85 },
    { name: "Tiling — wet areas", description: "Floor and wall tiling to bathrooms, ensuite, laundry, WC", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 8, code: "AS 3958.1", order: 90 },
    { name: "Kitchen cabinetry & benchtops", description: "Kitchen cabinets, stone benchtops, splashback — supply and install", trade: "Joinery", unitRate: 15000, unitType: "allow", durationDays: 5, code: "NCC 2022", order: 100, isFixed: true },
    { name: "Internal joinery & doors", description: "Internal doors, architraves, skirting, shelving — supply and install", trade: "Joinery", unitRate: 450, unitType: "item", durationDays: 5, code: "NCC 2022", order: 105 },
    { name: "Plumbing fit-off", description: "Final fix plumbing — all fixtures, tapware, appliance connections", trade: "Plumbing", unitRate: 6500, unitType: "allow", durationDays: 3, code: "AS/NZS 3500", order: 140, isFixed: true },
    { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights, smoke alarms, RCDs", trade: "Electrical", unitRate: 7500, unitType: "allow", durationDays: 3, code: "AS/NZS 3000", order: 145, isFixed: true },
    { name: "HVAC fit-off", description: "Final fix HVAC — indoor/outdoor units, controller, commissioning", trade: "HVAC", unitRate: 4500, unitType: "allow", durationDays: 2, code: "AS/NZS 3823", order: 148, isFixed: true },
    { name: "Painting — full house", description: "Full internal and external paint system — prep, prime and two coats", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 8, code: "AS/NZS 2311", order: 170 },
    { name: "Floor coverings", description: "Floor coverings throughout — carpet, timber, vinyl as specified", trade: "Flooring", unitRate: 65, unitType: "area", durationDays: 4, code: "NCC 2022", order: 180 },
    { name: "External works & landscaping", description: "Paths, clothesline, letterbox, basic landscaping and turf", trade: "Landscaping", unitRate: 8500, unitType: "allow", durationDays: 5, code: "NCC 2022", order: 200, isFixed: true },
    { name: "Builder's clean & handover", description: "Full detail clean, defect inspection and practical completion handover", trade: "Cleaning", unitRate: 2500, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...NEW_HOME_QUESTIONS],
};
