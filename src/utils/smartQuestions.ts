import type { SmartAnswer } from "../types/domain";

export interface QuestionTemplate {
  id: string;
  question: string;
  options: string[];
  category: SmartAnswer["category"];
}

export function detectRoomType(title: string, description: string): string {
  const value = `${title} ${description}`.toLowerCase();
  if (value.includes("kitchen")) return "kitchen";
  if (value.includes("ensuite")) return "bathroom";
  if (value.includes("bath") || value.includes("shower") || value.includes("toilet") || value.includes("wc")) return "bathroom";
  if (value.includes("laundry")) return "laundry";
  if (value.includes("floor") || value.includes("timber") || value.includes("hybrid") || value.includes("carpet")) return "flooring";
  if (value.includes("window") || value.includes("glazing")) return "windows";
  if (value.includes("structural") || value.includes("beam") || value.includes("wall removal")) return "structural";
  if (value.includes("bedroom")) return "bedroom";
  if (value.includes("living") || value.includes("lounge") || value.includes("family")) return "living";
  if (value.includes("deck") || value.includes("outdoor") || value.includes("patio") || value.includes("pergola")) return "outdoor";
  if (value.includes("roof") || value.includes("gutter")) return "roofing";
  if (value.includes("paint") || value.includes("render")) return "painting";
  return "general";
}

export function getSmartQuestions(roomType: string): QuestionTemplate[] {
  const shared: QuestionTemplate[] = [
    {
      id: "building_age",
      question: "Approximate age of the building?",
      options: ["Post-2000", "1990-2000", "1970-1990", "Pre-1970"],
      category: "General",
    },
    {
      id: "access",
      question: "How difficult is site access?",
      options: ["Easy — ground floor, clear path", "Moderate — stairs or narrow access", "Difficult — multi-storey, crane/scaffold needed"],
      category: "General",
    },
    {
      id: "demolition",
      question: "Demolition and strip-out scope?",
      options: ["None", "Partial strip-out", "Full strip-out to frame"],
      category: "Demolition",
    },
    {
      id: "skip_bin",
      question: "Skip bin required?",
      options: ["No — minimal waste", "Small skip (2-3m³)", "Medium skip (4-6m³)", "Large skip (8-10m³)"],
      category: "General",
    },
    {
      id: "site_clean",
      question: "Site clean scope?",
      options: ["Basic clean only", "Builder's clean (standard)", "Full detail clean (handover quality)"],
      category: "General",
    },
    {
      id: "plastering",
      question: "Plastering / wall repair required?",
      options: ["No plastering needed", "Patch and repair only", "New plasterboard walls", "Full replaster (walls and ceiling)"],
      category: "Finishes",
    },
    {
      id: "painting",
      question: "Painting scope?",
      options: ["No painting", "Touch-up only", "Walls only", "Walls and ceiling", "Full repaint including trim"],
      category: "Finishes",
    },
  ];

  const byRoom: Record<string, QuestionTemplate[]> = {
    bathroom: [
      {
        id: "waterproofing",
        question: "Waterproofing scope?",
        options: ["Shower only", "Shower and floor", "Full wet area (floor, shower, walls to 1800mm)"],
        category: "Finishes",
      },
      {
        id: "screed",
        question: "Screed / floor levelling required?",
        options: ["No — existing floor is level", "Shower screed only (fall to waste)", "Full floor screed (entire bathroom)"],
        category: "Finishes",
      },
      {
        id: "tiling",
        question: "Tiling extent?",
        options: ["Floor only", "Floor + splashback areas", "Floor + half height walls", "Floor + full height walls"],
        category: "Finishes",
      },
      {
        id: "tile_type",
        question: "Tile type / size?",
        options: ["Standard ceramic (up to 300x300)", "Mid-range porcelain (up to 600x600)", "Large format (600x600+)", "Feature / mosaic tiles"],
        category: "Finishes",
      },
      {
        id: "plumbing_fixtures",
        question: "Which plumbing fixtures need connecting?",
        options: ["Toilet + basin only", "Toilet + basin + shower", "Toilet + basin + shower + bath", "Toilet + basin + shower + bath + bidet"],
        category: "Services",
      },
      {
        id: "plumbing_new_runs",
        question: "New plumbing runs required?",
        options: ["No — reconnect to existing points", "Minor relocation (under 1m)", "Major relocation or new pipework", "Complete new plumbing layout"],
        category: "Services",
      },
      {
        id: "electrical_points",
        question: "How many electrical points?",
        options: ["Basic (1 light, 1 exhaust fan)", "Standard (2 lights, exhaust, 1 GPO)", "Full (downlights, exhaust, heat lamp, 2+ GPOs)", "Premium (as above + heated towel rail, shaver point, underfloor heating)"],
        category: "Services",
      },
      {
        id: "shower_type",
        question: "Shower screen type?",
        options: ["No screen (open/curtain)", "Semi-frameless screen", "Fully frameless glass screen", "Walk-in panel (fixed glass)"],
        category: "Finishes",
      },
      {
        id: "vanity_type",
        question: "Vanity type?",
        options: ["No vanity (pedestal basin)", "Wall-hung vanity", "Freestanding vanity (600-900mm)", "Double vanity (1200mm+)"],
        category: "Joinery",
      },
      {
        id: "mirror_type",
        question: "Mirror / cabinet?",
        options: ["Standard mirror", "Shaving cabinet (recessed)", "LED mirror cabinet", "Custom mirror to wall width"],
        category: "Finishes",
      },
      {
        id: "floor_waste",
        question: "Floor waste relocation?",
        options: ["No — keep existing position", "Relocate floor waste (new core hole)"],
        category: "Services",
      },
    ],
    kitchen: [
      {
        id: "cabinetry",
        question: "Cabinetry quality?",
        options: ["Flat pack (budget)", "Custom laminate (mid-range)", "Premium 2PAC spray finish", "Custom timber / shaker style"],
        category: "Joinery",
      },
      {
        id: "benchtop_material",
        question: "Benchtop material?",
        options: ["Laminate", "Stone (Caesarstone / similar)", "Timber", "Stainless steel"],
        category: "Finishes",
      },
      {
        id: "splashback",
        question: "Splashback type?",
        options: ["No splashback", "Tiled splashback", "Glass splashback", "Stone splashback (matching benchtop)"],
        category: "Finishes",
      },
      {
        id: "electrical_points",
        question: "How many electrical points needed?",
        options: ["Basic (4 GPOs, standard lighting)", "Standard (6 GPOs, pendant/downlights)", "Full (8+ GPOs, under-cabinet lighting, feature lighting)", "Premium (as above + island power, USB points)"],
        category: "Services",
      },
      {
        id: "plumbing_fixtures",
        question: "Plumbing connections required?",
        options: ["Sink only", "Sink + dishwasher", "Sink + dishwasher + fridge water", "Sink + dishwasher + fridge water + gas cooktop"],
        category: "Services",
      },
      {
        id: "plumbing_new_runs",
        question: "New plumbing runs required?",
        options: ["No — reconnect to existing", "Minor relocation (sink position change)", "Major relocation or new pipework", "Complete new layout (island sink etc)"],
        category: "Services",
      },
      {
        id: "rangehood",
        question: "Rangehood ducting?",
        options: ["No rangehood", "Recirculating (no ductwork)", "Ducted to external wall", "Ducted through ceiling/roof"],
        category: "Services",
      },
      {
        id: "island_bench",
        question: "Island bench?",
        options: ["No island", "Island without services", "Island with power only", "Island with power + plumbing (sink)"],
        category: "Joinery",
      },
      {
        id: "appliance_install",
        question: "Appliance installation scope?",
        options: ["None — owner supplied and installed", "Install owner-supplied appliances", "Supply and install basic package", "Supply and install premium package"],
        category: "General",
      },
    ],
    laundry: [
      {
        id: "joinery",
        question: "Joinery / cabinetry scope?",
        options: ["No joinery", "Base units only", "Base + overhead cabinets", "Full cabinetry with benchtop"],
        category: "Joinery",
      },
      {
        id: "tub_type",
        question: "Laundry tub?",
        options: ["No tub", "Standard tub in cabinet", "Drop-in tub in benchtop", "Freestanding utility sink"],
        category: "Finishes",
      },
      {
        id: "plumbing_fixtures",
        question: "Plumbing connections required?",
        options: ["Tub only", "Tub + washing machine", "Tub + washing machine + dryer (if condenser)", "Tub + washing machine + external drain"],
        category: "Services",
      },
      {
        id: "plumbing_new_runs",
        question: "New plumbing runs required?",
        options: ["No — reconnect to existing", "Minor relocation", "Major relocation or new pipework"],
        category: "Services",
      },
      {
        id: "electrical_points",
        question: "How many electrical points?",
        options: ["Basic (1 light, 1 GPO)", "Standard (1 light, 2 GPOs for washer/dryer)", "Full (downlights, 3+ GPOs, external access point)"],
        category: "Services",
      },
      {
        id: "tiling",
        question: "Tiling / flooring?",
        options: ["No tiling", "Floor tiles only", "Floor + splashback tiles", "Floor + full wall tiles"],
        category: "Finishes",
      },
      {
        id: "waterproofing",
        question: "Waterproofing required?",
        options: ["No waterproofing", "Floor only", "Floor + tub area"],
        category: "Finishes",
      },
    ],
    flooring: [
      {
        id: "flooring_type",
        question: "Flooring type?",
        options: ["Hybrid / LVP", "Engineered timber", "Solid hardwood", "Tiles (ceramic/porcelain)", "Carpet"],
        category: "Finishes",
      },
      {
        id: "subfloor_condition",
        question: "Subfloor condition?",
        options: ["Good — minimal prep needed", "Moderate — some levelling needed", "Poor — full screed or levelling compound", "Unknown — needs inspection"],
        category: "General",
      },
      {
        id: "existing_floor_removal",
        question: "Existing floor removal?",
        options: ["No — installing over existing", "Remove carpet", "Remove tiles (add skip bin)", "Remove timber / parquetry"],
        category: "Demolition",
      },
      {
        id: "skirting_boards",
        question: "Skirting boards?",
        options: ["No skirting", "Reuse existing skirting", "New skirting — standard profile", "New skirting — custom / heritage profile"],
        category: "Finishes",
      },
      {
        id: "floor_area_rooms",
        question: "How many rooms?",
        options: ["1 room", "2-3 rooms", "4-5 rooms", "Whole house"],
        category: "General",
      },
      {
        id: "transitions",
        question: "Floor transitions / thresholds?",
        options: ["None needed", "1-2 transitions", "3-5 transitions", "6+ transitions (whole house)"],
        category: "Finishes",
      },
    ],
    bedroom: [
      {
        id: "electrical_points",
        question: "How many electrical points?",
        options: ["Basic (1 light, 2 GPOs)", "Standard (downlights, 4 GPOs, TV point)", "Full (downlights, 6+ GPOs, TV, data, bedside switches)"],
        category: "Services",
      },
      {
        id: "wardrobe",
        question: "Wardrobe / robe scope?",
        options: ["No wardrobe work", "Fit shelving to existing robe", "New sliding robe doors", "Full built-in wardrobe with fit-out"],
        category: "Joinery",
      },
      {
        id: "flooring_type",
        question: "Flooring?",
        options: ["No flooring work", "Carpet", "Hybrid / LVP", "Engineered timber"],
        category: "Finishes",
      },
    ],
    living: [
      {
        id: "electrical_points",
        question: "How many electrical points?",
        options: ["Basic (1 light, 4 GPOs)", "Standard (downlights, 6 GPOs, TV + data)", "Full (feature lighting, 8+ GPOs, multiple TV/data, dimmers)"],
        category: "Services",
      },
      {
        id: "flooring_type",
        question: "Flooring?",
        options: ["No flooring work", "Carpet", "Hybrid / LVP", "Engineered timber", "Tiles"],
        category: "Finishes",
      },
      {
        id: "feature_wall",
        question: "Feature wall or bulkhead?",
        options: ["None", "Feature paint wall", "VJ panelling / timber feature", "Custom bulkhead with lighting"],
        category: "Finishes",
      },
    ],
    structural: [
      {
        id: "engineering",
        question: "Engineering status?",
        options: ["Engineer drawings provided", "Needs structural engineer engagement"],
        category: "Services",
      },
      {
        id: "structural_type",
        question: "Type of structural work?",
        options: ["Load-bearing wall removal (steel beam)", "Stump/subfloor repairs", "Roof structure repair", "Foundation / footing works"],
        category: "General",
      },
      {
        id: "propping",
        question: "Temporary propping required?",
        options: ["No propping", "Light propping (acrow props)", "Heavy propping (multi-level)"],
        category: "General",
      },
    ],
    windows: [
      {
        id: "window_type",
        question: "Window type?",
        options: ["Aluminium single glazed", "Aluminium double glazed", "Timber frame", "uPVC double glazed"],
        category: "Finishes",
      },
      {
        id: "window_count",
        question: "How many windows?",
        options: ["1-2 windows", "3-4 windows", "5-8 windows", "Whole house"],
        category: "General",
      },
      {
        id: "window_size",
        question: "Typical window size?",
        options: ["Standard (up to 1200x1200)", "Large (up to 1800x1200)", "Floor to ceiling / sliding doors", "Custom / arched"],
        category: "General",
      },
    ],
    outdoor: [
      {
        id: "deck_material",
        question: "Deck / outdoor material?",
        options: ["Treated pine", "Hardwood (merbau/spotted gum)", "Composite decking", "Concrete / paving"],
        category: "Finishes",
      },
      {
        id: "electrical_points",
        question: "Outdoor electrical?",
        options: ["No electrical", "1-2 lights + 1 GPO", "Feature lighting + multiple GPOs", "Full outdoor kitchen electrical"],
        category: "Services",
      },
      {
        id: "plumbing_fixtures",
        question: "Outdoor plumbing?",
        options: ["No plumbing", "Garden tap only", "Outdoor sink / BBQ connection", "Full outdoor kitchen plumbing"],
        category: "Services",
      },
      {
        id: "roof_type",
        question: "Roof / cover?",
        options: ["No roof", "Flat roof Colorbond", "Gable roof", "Insulated panel roof"],
        category: "General",
      },
    ],
    roofing: [
      {
        id: "roof_work",
        question: "Roofing scope?",
        options: ["Repairs / patching only", "Partial re-roof", "Full re-roof", "New roof structure"],
        category: "General",
      },
      {
        id: "gutter_work",
        question: "Gutters and downpipes?",
        options: ["No gutter work", "Repair / reseal only", "Replace gutters only", "Full gutter and downpipe replacement"],
        category: "General",
      },
    ],
    painting: [
      {
        id: "paint_interior",
        question: "Interior painting scope?",
        options: ["1-2 rooms", "3-5 rooms", "Whole house interior", "No interior painting"],
        category: "Finishes",
      },
      {
        id: "paint_exterior",
        question: "Exterior painting scope?",
        options: ["No exterior", "Touch-up / spot repair", "Full exterior repaint", "Full exterior with render repair"],
        category: "Finishes",
      },
      {
        id: "paint_prep",
        question: "Surface preparation?",
        options: ["Minimal — good condition", "Moderate — some patching and sanding", "Heavy — extensive repair, stripping, priming"],
        category: "General",
      },
    ],
    general: [
      {
        id: "electrical_points",
        question: "Electrical work scope?",
        options: ["No electrical", "Minor (1-3 points)", "Standard (4-8 points)", "Major (8+ points or switchboard work)"],
        category: "Services",
      },
      {
        id: "plumbing_fixtures",
        question: "Plumbing work scope?",
        options: ["No plumbing", "Minor (1-2 fixtures)", "Standard (3-5 fixtures)", "Major (6+ fixtures or new runs)"],
        category: "Services",
      },
    ],
  };

  return [...shared, ...(byRoom[roomType] ?? byRoom.general)];
}