import type { StageTemplate } from "./templates/types";

export interface AnswerStageRule {
  questionId: string;
  answerMatch: string | string[];
  stages: StageTemplate[];
  costMultiplier?: number;
}

export const ANSWER_STAGE_RULES: AnswerStageRule[] = [
  { questionId: "skip_bin", answerMatch: "Small skip (2-3m³)", stages: [
    { name: "Skip bin — small (2-3m³)", description: "Small skip bin delivery, hire and removal", trade: "Skip Bin", unitRate: 350, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 20, isFixed: true },
  ]},
  { questionId: "skip_bin", answerMatch: "Medium skip (4-6m³)", stages: [
    { name: "Skip bin — medium (4-6m³)", description: "Medium skip bin delivery, hire and removal", trade: "Skip Bin", unitRate: 550, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 20, isFixed: true },
  ]},
  { questionId: "skip_bin", answerMatch: "Large skip (8-10m³)", stages: [
    { name: "Skip bin — large (8-10m³)", description: "Large skip bin delivery, hire and removal", trade: "Skip Bin", unitRate: 850, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 20, isFixed: true },
  ]},

  { questionId: "site_clean", answerMatch: "Full detail clean (handover quality)", stages: [
    { name: "Full detail clean", description: "Professional detail clean — handover quality", trade: "Detail Clean", unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 235, isFixed: true },
  ]},

  { questionId: "building_age", answerMatch: "Pre-1970", stages: [
    { name: "Asbestos assessment and removal", description: "Licensed asbestos assessment, removal and disposal per WorkSafe Vic", trade: "Asbestos Removal", unitRate: 3500, unitType: "allow", durationDays: 2, code: "Code of Practice (WorkSafe Vic)", order: 30, isFixed: true },
  ]},

  { questionId: "access", answerMatch: "Difficult — multi-storey, crane/scaffold needed", stages: [
    { name: "Scaffolding and difficult access", description: "Scaffolding erect, hire and dismantle for difficult access", trade: "Scaffolding", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 15, isFixed: true },
  ]},

  { questionId: "engineering", answerMatch: "Needs structural engineer engagement", stages: [
    { name: "Structural engineering engagement", description: "Engage structural engineer for design, certification and inspections", trade: "Engineering", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS 1170", order: 50, isFixed: true },
  ]},

  { questionId: "demolition", answerMatch: "Full strip-out to frame", costMultiplier: 1.5, stages: [] },
  { questionId: "tile_type", answerMatch: "Large format (600x600+)", costMultiplier: 1.15, stages: [] },
  { questionId: "tile_type", answerMatch: "Feature / mosaic tiles", costMultiplier: 1.25, stages: [] },
  { questionId: "paint_prep", answerMatch: "Heavy — extensive repair, stripping, priming", costMultiplier: 1.4, stages: [] },
  { questionId: "roof_work", answerMatch: "Full re-roof", costMultiplier: 1.3, stages: [] },

  { questionId: "plastering", answerMatch: "New plasterboard walls", stages: [
    { name: "New plasterboard walls", description: "Supply and install new plasterboard lining, set and finish", trade: "Plastering", unitRate: 55, unitType: "area", durationDays: 3, code: "AS/NZS 2589", order: 110 },
  ]},
  { questionId: "plastering", answerMatch: "Full replaster (walls and ceiling)", stages: [
    { name: "Full replaster — walls and ceiling", description: "Strip existing lining, new plasterboard, set and finish", trade: "Plastering", unitRate: 65, unitType: "area", durationDays: 4, code: "AS/NZS 2589", order: 110 },
  ]},

  { questionId: "painting", answerMatch: "Walls and ceiling", stages: [
    { name: "Paint — walls and ceiling", description: "Prep, prime, two coats to walls and ceiling", trade: "Painting", unitRate: 40, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 170 },
  ]},
  { questionId: "painting", answerMatch: "Full repaint including trim", stages: [
    { name: "Full repaint including trim", description: "Full repaint — walls, ceiling, skirting, architraves, doors", trade: "Painting", unitRate: 55, unitType: "area", durationDays: 3, code: "AS/NZS 2311", order: 170 },
  ]},
  { questionId: "paint_exterior", answerMatch: "Full exterior repaint", stages: [
    { name: "Full exterior repaint", description: "Pressure wash, prep, prime and two coats to all external surfaces", trade: "Painting", unitRate: 45, unitType: "area", durationDays: 4, code: "AS/NZS 2311", order: 170 },
  ]},
  { questionId: "paint_exterior", answerMatch: "Full exterior with render repair", stages: [
    { name: "Exterior render repair and repaint", description: "Render patching, crack repair, then full repaint", trade: "Rendering", unitRate: 75, unitType: "area", durationDays: 5, code: "AS 3700", order: 170 },
  ]},

  { questionId: "screed", answerMatch: "Full floor screed (entire bathroom)", stages: [
    { name: "Full floor screed", description: "Full floor screed with fall to waste throughout", trade: "Screed", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 3958.1", order: 120 },
  ]},

  { questionId: "waterproofing", answerMatch: "Full wet area (floor, shower, walls to 1800mm)", stages: [
    { name: "Full wet area waterproofing", description: "Full waterproofing — floor, shower, walls to 1800mm including hobs and junctions", trade: "Waterproofing", unitRate: 120, unitType: "area", durationDays: 2, code: "AS 3740", order: 130 },
  ]},

  { questionId: "tiling", answerMatch: "Floor + full height walls", stages: [
    { name: "Full height wall and floor tiling", description: "Floor to ceiling wall tiling and floor tiles including niches", trade: "Tiling", unitRate: 180, unitType: "area", durationDays: 4, code: "AS 3958.1", order: 140 },
  ]},

  { questionId: "shower_type", answerMatch: "Fully frameless glass screen", stages: [
    { name: "Frameless glass shower screen", description: "Supply and install fully frameless glass shower screen", trade: "Shower Screen", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210 },
  ]},
  { questionId: "shower_type", answerMatch: "Walk-in panel (fixed glass)", stages: [
    { name: "Walk-in shower panel", description: "Fixed glass walk-in shower panel supply and install", trade: "Shower Screen", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210 },
  ]},

  { questionId: "vanity_type", answerMatch: "Double vanity (1200mm+)", stages: [
    { name: "Double vanity supply and install", description: "1200mm+ double vanity with basins and tapware", trade: "Joinery", unitRate: 2200, unitType: "allow", durationDays: 1, code: "AS 4386", order: 150 },
  ]},

  { questionId: "mirror_type", answerMatch: "LED mirror cabinet", stages: [
    { name: "LED mirror cabinet", description: "Recessed LED mirror cabinet supply and install (requires electrical)", trade: "Finishes", unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 210 },
  ]},

  { questionId: "floor_waste", answerMatch: "Relocate floor waste (new core hole)", stages: [
    { name: "Floor waste relocation", description: "Core drill new floor waste position and connect drainage", trade: "Plumbing Rough-In", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 70 },
  ]},

  { questionId: "plumbing_fixtures", answerMatch: "Toilet + basin + shower + bath", stages: [
    { name: "Bath supply and install", description: "Freestanding or built-in bath supply and install", trade: "Plumbing Fit-Off", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  ]},
  { questionId: "plumbing_fixtures", answerMatch: "Toilet + basin + shower + bath + bidet", stages: [
    { name: "Bath and bidet supply and install", description: "Bath and bidet supply, plumbing and install", trade: "Plumbing Fit-Off", unitRate: 2400, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  ]},
  { questionId: "plumbing_fixtures", answerMatch: "Sink + dishwasher + fridge water", stages: [
    { name: "Extended plumbing connections", description: "Sink, dishwasher and fridge water line connection", trade: "Plumbing Fit-Off", unitRate: 1600, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  ]},
  { questionId: "plumbing_fixtures", answerMatch: "Sink + dishwasher + fridge water + gas cooktop", stages: [
    { name: "Full kitchen plumbing and gas", description: "Sink, dishwasher, fridge water and gas cooktop connection", trade: "Plumbing Fit-Off", unitRate: 2200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 190 },
  ]},
  { questionId: "plumbing_new_runs", answerMatch: "Major relocation or new pipework", stages: [
    { name: "Major plumbing relocation", description: "Significant pipework relocation including new drainage runs", trade: "Plumbing Rough-In", unitRate: 3200, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 70 },
  ]},
  { questionId: "plumbing_new_runs", answerMatch: "Complete new plumbing layout", stages: [
    { name: "Complete new plumbing layout", description: "All new pipework, drainage and venting to new layout", trade: "Plumbing Rough-In", unitRate: 4500, unitType: "allow", durationDays: 3, code: "AS/NZS 3500", order: 70 },
  ]},

  { questionId: "electrical_points", answerMatch: [
    "Full (downlights, exhaust, heat lamp, 2+ GPOs)",
    "Full (downlights, 6+ GPOs, multiple TV/data, dimmers)",
    "Full (8+ GPOs, under-cabinet lighting, feature lighting)",
    "Full (downlights, 3+ GPOs, external access point)",
    "Full (downlights, 6+ GPOs, TV, data, bedside switches)",
    "Full (feature lighting, 8+ GPOs, multiple TV/data, dimmers)",
  ], stages: [
    { name: "Extended electrical package", description: "Additional GPOs, data points, feature lighting circuits", trade: "Electrical Rough-In", unitRate: 1800, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 80 },
  ]},
  { questionId: "electrical_points", answerMatch: [
    "Premium (as above + heated towel rail, shaver point, underfloor heating)",
    "Premium (as above + island power, USB points)",
  ], stages: [
    { name: "Premium electrical package", description: "Full electrical plus heated towel rail, underfloor heating, USB, premium switches", trade: "Electrical Rough-In", unitRate: 2800, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 80 },
  ]},

  { questionId: "cabinetry", answerMatch: "Premium 2PAC spray finish", stages: [
    { name: "Premium 2PAC cabinetry", description: "Custom 2PAC spray-finish cabinetry with soft-close hardware", trade: "Joinery", unitRate: 1200, unitType: "area", durationDays: 4, code: "AS 4386", order: 150 },
  ]},
  { questionId: "cabinetry", answerMatch: "Custom timber / shaker style", stages: [
    { name: "Custom timber cabinetry", description: "Solid timber / shaker-style cabinetry with premium hardware", trade: "Joinery", unitRate: 1400, unitType: "area", durationDays: 5, code: "AS 4386", order: 150 },
  ]},
  { questionId: "benchtop_material", answerMatch: "Stone (Caesarstone / similar)", stages: [
    { name: "Stone benchtop", description: "Engineered stone benchtop — template, supply and install", trade: "Stone/Masonry", unitRate: 600, unitType: "area", durationDays: 1, code: "NCC 2022", order: 160 },
  ]},
  { questionId: "splashback", answerMatch: "Glass splashback", stages: [
    { name: "Glass splashback", description: "Toughened glass splashback — measure, supply and install", trade: "Glazing", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", order: 165 },
  ]},
  { questionId: "island_bench", answerMatch: "Island with power + plumbing (sink)", stages: [
    { name: "Island bench with services", description: "Island bench including power and plumbing for sink", trade: "Joinery", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS 4386", order: 150 },
  ]},

  { questionId: "flooring_type", answerMatch: "Engineered timber", stages: [
    { name: "Engineered timber flooring", description: "Supply and install engineered timber flooring inc underlay and transitions", trade: "Engineered Timber", unitRate: 130, unitType: "area", durationDays: 2, code: "AS 1684", order: 180 },
  ]},
  { questionId: "flooring_type", answerMatch: "Solid hardwood", stages: [
    { name: "Solid hardwood flooring", description: "Supply, install, sand and finish solid hardwood flooring", trade: "Solid Hardwood", unitRate: 180, unitType: "area", durationDays: 3, code: "AS 1684", order: 180 },
  ]},
  { questionId: "flooring_type", answerMatch: "Hybrid / LVP", stages: [
    { name: "Hybrid flooring", description: "Supply and install hybrid/LVP flooring inc underlay and transitions", trade: "Hybrid Flooring", unitRate: 75, unitType: "area", durationDays: 2, code: "NCC 2022", order: 180 },
  ]},
  { questionId: "flooring_type", answerMatch: "Carpet", stages: [
    { name: "Carpet supply and install", description: "Carpet and underlay supply and install", trade: "Carpet", unitRate: 55, unitType: "area", durationDays: 1, code: "NCC 2022", order: 180 },
  ]},
  { questionId: "flooring_type", answerMatch: ["Tiles (ceramic/porcelain)", "Tiles"], stages: [
    { name: "Floor tiling", description: "Floor tile supply and install including adhesive and grout", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 3, code: "AS 3958.1", order: 140 },
  ]},
  { questionId: "subfloor_condition", answerMatch: "Poor — full screed or levelling compound", stages: [
    { name: "Full floor levelling", description: "Self-levelling compound over entire floor area", trade: "Screed", unitRate: 55, unitType: "area", durationDays: 2, code: "NCC 2022", order: 120 },
  ]},
  { questionId: "existing_floor_removal", answerMatch: "Remove tiles (add skip bin)", stages: [
    { name: "Tile removal and disposal", description: "Remove existing floor tiles, dispose via skip bin", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 2, code: "AS 2601", order: 40 },
    { name: "Skip bin for tile waste", description: "Skip bin for tile removal waste", trade: "Skip Bin", unitRate: 450, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 20, isFixed: true },
  ]},
  { questionId: "skirting_boards", answerMatch: "New skirting — custom / heritage profile", stages: [
    { name: "Custom profile skirting", description: "Heritage/custom profile skirting — supply, install, prime and paint", trade: "Skirting", unitRate: 40, unitType: "area", durationDays: 2, code: "NCC 2022", order: 220 },
  ]},

  { questionId: "wardrobe", answerMatch: "Full built-in wardrobe with fit-out", stages: [
    { name: "Built-in wardrobe", description: "Full built-in wardrobe — frame, shelving, hanging, sliding doors", trade: "Wardrobe Fit-Out", unitRate: 2400, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 150 },
  ]},
  { questionId: "wardrobe", answerMatch: "New sliding robe doors", stages: [
    { name: "Sliding robe doors", description: "Sliding robe doors — supply and install", trade: "Wardrobe Fit-Out", unitRate: 1200, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 150 },
  ]},
  { questionId: "feature_wall", answerMatch: "VJ panelling / timber feature", stages: [
    { name: "VJ panelling feature wall", description: "VJ panelling supply, install and paint to feature wall", trade: "Carpentry", unitRate: 120, unitType: "area", durationDays: 2, code: "NCC 2022", order: 115 },
  ]},
  { questionId: "feature_wall", answerMatch: "Custom bulkhead with lighting", stages: [
    { name: "Custom bulkhead with lighting", description: "Plasterboard bulkhead with integrated LED lighting", trade: "Carpentry", unitRate: 1800, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 115 },
  ]},

  { questionId: "joinery", answerMatch: "Full cabinetry with benchtop", stages: [
    { name: "Full laundry cabinetry", description: "Base, overhead cabinets and benchtop with tub", trade: "Joinery", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS 4386", order: 150 },
  ]},

  { questionId: "window_type", answerMatch: "Aluminium double glazed", stages: [
    { name: "Double glazed aluminium windows", description: "Double glazed aluminium windows supply and install", trade: "Double Glazing", unitRate: 720, unitType: "area", durationDays: 2, code: "AS 1288", order: 210 },
  ]},
  { questionId: "window_type", answerMatch: "uPVC double glazed", stages: [
    { name: "uPVC double glazed windows", description: "uPVC double glazed windows supply and install", trade: "Double Glazing", unitRate: 780, unitType: "area", durationDays: 2, code: "AS 1288", order: 210 },
  ]},
  { questionId: "window_type", answerMatch: "Timber frame", stages: [
    { name: "Timber frame windows", description: "Timber frame windows supply and install", trade: "Glazing", unitRate: 620, unitType: "area", durationDays: 3, code: "AS 1288", order: 210 },
  ]},

  { questionId: "propping", answerMatch: "Heavy propping (multi-level)", stages: [
    { name: "Heavy temporary propping", description: "Multi-level temporary propping and support", trade: "Structural", unitRate: 2500, unitType: "allow", durationDays: 1, code: "AS 1684", order: 45 },
  ]},

  { questionId: "deck_material", answerMatch: "Hardwood (merbau/spotted gum)", stages: [
    { name: "Hardwood decking", description: "Merbau/spotted gum decking boards supply and install", trade: "Decking", unitRate: 350, unitType: "area", durationDays: 3, code: "AS 1684", order: 180 },
  ]},
  { questionId: "deck_material", answerMatch: "Composite decking", stages: [
    { name: "Composite decking", description: "Composite decking boards supply and install", trade: "Composite Decking", unitRate: 380, unitType: "area", durationDays: 3, code: "NCC 2022", order: 180 },
  ]},

  { questionId: "gutter_work", answerMatch: "Full gutter and downpipe replacement", stages: [
    { name: "Full gutter replacement", description: "Remove and replace all gutters, downpipes and flashings", trade: "Guttering", unitRate: 55, unitType: "area", durationDays: 2, code: "AS/NZS 3500.3", order: 66 },
  ]},
];