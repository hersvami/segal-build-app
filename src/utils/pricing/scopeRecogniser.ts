/**
 * Scope Recogniser — AI-Powered Work Classification
 * 
 * Takes free-text description of construction work and returns:
 * - Work category (Wet Areas, Structural, External, etc.)
 * - Relevant trades required
 * - Dynamic questions to ask the builder
 * - Stage templates for pricing (Rawlinsons/Cordell methodology)
 * 
 * Two modes:
 * 1. Keyword fallback — instant, no API needed
 * 2. Gemini AI — uses API key for intelligent classification
 */

import type { StageTemplate } from "./types";

// ─── Work Categories (aligned with Rawlinsons chapter structure) ────────────
export interface WorkCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  trades: string[];
  stages: StageTemplate[];
  questions: ScopeQuestion[];
}

export interface ScopeQuestion {
  id: string;
  label: string;
  category: string;
  options: string[];
  costEffect?: {
    type: "multiplier" | "add_stage";
    value?: number;
    stage?: StageTemplate;
    matchAnswer: string | string[];
  }[];
}

export interface RecognisedScope {
  categoryId: string;
  categoryLabel: string;
  confidence: number;
  trades: string[];
  stages: StageTemplate[];
  questions: ScopeQuestion[];
  suggestedTitle: string;
  rawInput: string;
}

// ─── Scope Questions Database (industry-standard) ───────────────────────────

const COMMON_QUESTIONS: ScopeQuestion[] = [
  {
    id: "building_age",
    label: "Building Age",
    category: "General",
    options: ["Post-2000", "1970–2000", "Pre-1970"],
    costEffect: [
      {
        type: "add_stage",
        matchAnswer: "Pre-1970",
        stage: { name: "Asbestos assessment & removal", description: "Licensed asbestos assessment, removal and disposal per WorkSafe Vic", trade: "Asbestos Removal", unitRate: 3500, unitType: "allow", durationDays: 2, code: "Code of Practice (WorkSafe Vic)", order: 25, isFixed: true },
      },
    ],
  },
  {
    id: "access_difficulty",
    label: "Site Access",
    category: "General",
    options: ["Easy — ground floor, clear access", "Moderate — stairs or narrow entry", "Difficult — multi-storey, crane/scaffold needed"],
    costEffect: [
      {
        type: "add_stage",
        matchAnswer: "Difficult — multi-storey, crane/scaffold needed",
        stage: { name: "Scaffolding & difficult access", description: "Scaffolding erect, hire and dismantle for difficult access", trade: "Scaffolding", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 12, isFixed: true },
      },
      {
        type: "multiplier",
        matchAnswer: "Moderate — stairs or narrow entry",
        value: 1.08,
      },
    ],
  },
  {
    id: "skip_bin",
    label: "Skip Bin Required",
    category: "General",
    options: ["Not required", "Small skip (2–3m³)", "Medium skip (4–6m³)", "Large skip (8–10m³)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Small skip (2–3m³)", stage: { name: "Skip bin — small (2–3m³)", description: "Small skip bin delivery, hire and removal", trade: "Skip Bin", unitRate: 350, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 18, isFixed: true } },
      { type: "add_stage", matchAnswer: "Medium skip (4–6m³)", stage: { name: "Skip bin — medium (4–6m³)", description: "Medium skip bin delivery, hire and removal", trade: "Skip Bin", unitRate: 550, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 18, isFixed: true } },
      { type: "add_stage", matchAnswer: "Large skip (8–10m³)", stage: { name: "Skip bin — large (8–10m³)", description: "Large skip bin delivery, hire and removal", trade: "Skip Bin", unitRate: 850, unitType: "allow", durationDays: 1, code: "EPA Vic", order: 18, isFixed: true } },
    ],
  },
  {
    id: "engineering",
    label: "Structural Engineering",
    category: "General",
    options: ["Not required", "Needs structural engineer engagement"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Needs structural engineer engagement", stage: { name: "Structural engineering engagement", description: "Engage structural engineer for design, certification and inspections", trade: "Engineering", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS 1170", order: 30, isFixed: true } },
    ],
  },
  {
    id: "site_clean",
    label: "Final Clean Type",
    category: "General",
    options: ["Builder's clean", "Full detail clean (handover quality)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Full detail clean (handover quality)", stage: { name: "Full detail clean", description: "Professional detail clean — handover quality", trade: "Detail Clean", unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 999, isFixed: true } },
    ],
  },
];

// ─── Category-specific questions ────────────────────────────────────────────

const WET_AREA_QUESTIONS: ScopeQuestion[] = [
  {
    id: "demolition_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Cosmetic only — no demo", "Partial strip (tiles/fixtures)", "Full strip-out to frame"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full strip-out to frame", value: 1.35 },
      { type: "multiplier", matchAnswer: "Partial strip (tiles/fixtures)", value: 1.1 },
    ],
  },
  {
    id: "tile_type",
    label: "Tile Selection",
    category: "Finishes",
    options: ["Standard ceramic/porcelain", "Large format (600x600+)", "Feature / mosaic tiles", "Natural stone"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Large format (600x600+)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Feature / mosaic tiles", value: 1.25 },
      { type: "multiplier", matchAnswer: "Natural stone", value: 1.4 },
    ],
  },
  {
    id: "shower_screen",
    label: "Shower Screen",
    category: "Fixtures",
    options: ["Not required", "Standard framed", "Semi-frameless", "Fully frameless"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard framed", stage: { name: "Shower screen — framed", description: "Framed shower screen supply and install", trade: "Shower Screen", unitRate: 800, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210, isFixed: true } },
      { type: "add_stage", matchAnswer: "Semi-frameless", stage: { name: "Shower screen — semi-frameless", description: "Semi-frameless shower screen supply and install", trade: "Shower Screen", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210, isFixed: true } },
      { type: "add_stage", matchAnswer: "Fully frameless", stage: { name: "Shower screen — fully frameless", description: "Fully frameless shower screen supply and install", trade: "Shower Screen", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS 1288", order: 210, isFixed: true } },
    ],
  },
  {
    id: "vanity_type",
    label: "Vanity / Joinery",
    category: "Joinery",
    options: ["Existing — keep", "Budget vanity", "Mid-range vanity", "Custom stone-top vanity"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Budget vanity", stage: { name: "Vanity supply & install — budget", description: "Budget vanity unit supply and install", trade: "Joinery", unitRate: 600, unitType: "allow", durationDays: 1, code: "AS 4386", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Mid-range vanity", stage: { name: "Vanity supply & install — mid-range", description: "Mid-range vanity unit supply and install", trade: "Joinery", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 4386", order: 200, isFixed: true } },
      { type: "add_stage", matchAnswer: "Custom stone-top vanity", stage: { name: "Custom stone vanity & benchtop", description: "Custom vanity with stone benchtop — supply, template and install", trade: "Stone/Masonry", unitRate: 2800, unitType: "allow", durationDays: 2, code: "NCC 2022", order: 200, isFixed: true } },
    ],
  },
];

const KITCHEN_QUESTIONS: ScopeQuestion[] = [
  {
    id: "demolition_scope",
    label: "Demolition Scope",
    category: "Demolition",
    options: ["Cosmetic only — no demo", "Partial strip (benchtops/splashback)", "Full strip-out to frame"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full strip-out to frame", value: 1.4 },
      { type: "multiplier", matchAnswer: "Partial strip (benchtops/splashback)", value: 1.1 },
    ],
  },
  {
    id: "benchtop_type",
    label: "Benchtop Material",
    category: "Joinery",
    options: ["Laminate", "Engineered stone (Caesarstone)", "Natural stone (marble/granite)", "Timber"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Engineered stone (Caesarstone)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Natural stone (marble/granite)", value: 1.35 },
    ],
  },
  {
    id: "splashback_type",
    label: "Splashback",
    category: "Finishes",
    options: ["Not required", "Tiled splashback", "Glass splashback", "Stone/marble splashback"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Tiled splashback", stage: { name: "Tiled splashback", description: "Tile splashback supply and install", trade: "Tiling", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS 3958.1", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Glass splashback", stage: { name: "Glass splashback", description: "Toughened glass splashback — measure, supply and install", trade: "Glazing", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", order: 180, isFixed: true } },
      { type: "add_stage", matchAnswer: "Stone/marble splashback", stage: { name: "Stone splashback", description: "Natural stone splashback — template, supply and install", trade: "Stone/Masonry", unitRate: 1800, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 180, isFixed: true } },
    ],
  },
];

const STRUCTURAL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "structural_type",
    label: "Structural Work Type",
    category: "Structural",
    options: ["Load-bearing wall removal", "New opening / lintel", "Underpinning", "Retaining wall", "Extension footings"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Underpinning", value: 1.5 },
      { type: "multiplier", matchAnswer: "Extension footings", value: 1.3 },
    ],
  },
  {
    id: "concrete_type",
    label: "Concrete / Slab Work",
    category: "Structural",
    options: ["Not required", "New concrete slab", "Slab repair / levelling", "Concrete stumps"],
    costEffect: [
      { type: "add_stage", matchAnswer: "New concrete slab", stage: { name: "Concrete slab — new pour", description: "New concrete slab including formwork, mesh and pour", trade: "Concrete", unitRate: 220, unitType: "area", durationDays: 3, code: "AS 3600", order: 45 } },
      { type: "add_stage", matchAnswer: "Slab repair / levelling", stage: { name: "Slab repair & levelling", description: "Concrete slab repair and levelling compound", trade: "Concrete", unitRate: 80, unitType: "area", durationDays: 2, code: "AS 3600", order: 45 } },
    ],
  },
];

const EXTERNAL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "deck_material",
    label: "Decking Material",
    category: "Carpentry",
    options: ["Merbau hardwood", "Treated pine", "Composite (ModWood etc.)", "Spotted gum"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Composite (ModWood etc.)", value: 1.25 },
      { type: "multiplier", matchAnswer: "Spotted gum", value: 1.3 },
    ],
  },
  {
    id: "balustrade",
    label: "Balustrade / Railing",
    category: "Carpentry",
    options: ["Not required", "Timber balustrade", "Glass balustrade", "Wire balustrade"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Timber balustrade", stage: { name: "Timber balustrade", description: "Timber balustrade supply and install to AS 1170", trade: "Carpentry", unitRate: 320, unitType: "allow", durationDays: 1, code: "AS 1170", order: 160, isFixed: true } },
      { type: "add_stage", matchAnswer: "Glass balustrade", stage: { name: "Glass balustrade", description: "Toughened glass balustrade supply and install", trade: "Glazing", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS 1288", order: 160, isFixed: true } },
      { type: "add_stage", matchAnswer: "Wire balustrade", stage: { name: "Wire balustrade", description: "Stainless wire balustrade supply and install", trade: "Carpentry", unitRate: 480, unitType: "allow", durationDays: 1, code: "AS 1170", order: 160, isFixed: true } },
    ],
  },
];

const ROOFING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "roof_scope",
    label: "Roof Work Scope",
    category: "Roofing",
    options: ["Repairs & patching", "Partial re-roof (one section)", "Full re-roof", "New roof (extension)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Full re-roof", value: 1.3 },
      { type: "multiplier", matchAnswer: "Partial re-roof (one section)", value: 1.1 },
      { type: "multiplier", matchAnswer: "New roof (extension)", value: 1.4 },
    ],
  },
  {
    id: "roof_material",
    label: "Roofing Material",
    category: "Roofing",
    options: ["Colorbond steel", "Concrete tiles", "Terracotta tiles", "Slate"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Terracotta tiles", value: 1.2 },
      { type: "multiplier", matchAnswer: "Slate", value: 1.5 },
    ],
  },
  {
    id: "guttering_scope",
    label: "Guttering & Downpipes",
    category: "Roofing",
    options: ["Not required", "Replace guttering only", "Full gutter & downpipe replacement"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Replace guttering only", stage: { name: "Gutter replacement", description: "Remove and replace guttering", trade: "Guttering", unitRate: 35, unitType: "area", durationDays: 1, code: "AS/NZS 3500.3", order: 155 } },
      { type: "add_stage", matchAnswer: "Full gutter & downpipe replacement", stage: { name: "Gutter & downpipe replacement", description: "Full gutter and downpipe removal and replacement", trade: "Guttering", unitRate: 55, unitType: "area", durationDays: 2, code: "AS/NZS 3500.3", order: 155 } },
    ],
  },
];

const PAINTING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "paint_scope",
    label: "Painting Scope",
    category: "Painting",
    options: ["Walls only", "Walls & ceilings", "Full repaint (walls, ceilings, trim, doors)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Walls & ceilings", value: 1.25 },
      { type: "multiplier", matchAnswer: "Full repaint (walls, ceilings, trim, doors)", value: 1.5 },
    ],
  },
  {
    id: "paint_prep",
    label: "Surface Preparation",
    category: "Painting",
    options: ["Light — minimal prep", "Moderate — patching and sanding", "Heavy — extensive repair, stripping, priming"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Moderate — patching and sanding", value: 1.15 },
      { type: "multiplier", matchAnswer: "Heavy — extensive repair, stripping, priming", value: 1.4 },
    ],
  },
];

const FLOORING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "flooring_type",
    label: "Flooring Material",
    category: "Flooring",
    options: ["Hybrid / LVP", "Engineered timber", "Solid hardwood", "Carpet", "Tiles"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Solid hardwood", value: 1.4 },
      { type: "multiplier", matchAnswer: "Engineered timber", value: 1.15 },
    ],
  },
  {
    id: "subfloor_prep",
    label: "Subfloor Preparation",
    category: "Flooring",
    options: ["None required", "Levelling compound", "Plywood overlay", "Full subfloor replacement"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Levelling compound", stage: { name: "Floor levelling compound", description: "Self-levelling compound application", trade: "Screed", unitRate: 40, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 72 } },
      { type: "add_stage", matchAnswer: "Plywood overlay", stage: { name: "Plywood overlay", description: "Plywood overlay to existing subfloor", trade: "Carpentry", unitRate: 45, unitType: "area", durationDays: 1, code: "AS 1684", order: 72 } },
      { type: "multiplier", matchAnswer: "Full subfloor replacement", value: 1.5 },
    ],
  },
  {
    id: "skirting",
    label: "Skirting Boards",
    category: "Finishes",
    options: ["Not required", "Replace skirting boards", "New skirting + architraves"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Replace skirting boards", stage: { name: "Skirting board replacement", description: "Remove and replace skirting boards", trade: "Skirting", unitRate: 22, unitType: "area", durationDays: 1, code: "NCC 2022", order: 220 } },
      { type: "add_stage", matchAnswer: "New skirting + architraves", stage: { name: "Skirting & architraves", description: "New skirting boards and architraves — supply and install", trade: "Skirting", unitRate: 35, unitType: "area", durationDays: 1, code: "NCC 2022", order: 220 } },
    ],
  },
];

// ─── Work Category Definitions with Rawlinsons/Cordell Stage Templates ──────

export const WORK_CATEGORIES: WorkCategory[] = [
  {
    id: "wet_areas",
    label: "Wet Areas",
    description: "Bathroom, ensuite, laundry, powder room renovations",
    icon: "🚿",
    trades: ["Site Prep", "Demolition", "Plumbing Rough-In", "Electrical Rough-In", "Carpentry", "Waterproofing", "Screed", "Tiling", "Plastering", "Plumbing Fit-Off", "Electrical Fit-Off", "Painting", "Cleaning"],
    stages: [
      { name: "Site preparation & protection", description: "Site setup, dust barriers, floor protection and temporary services", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Demolition & strip-out", description: "Strip out existing fixtures, tiles, linings and disposal to licensed facility", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
      { name: "Plumbing rough-in", description: "First fix plumbing — relocate/extend pipework, drainage and waste", trade: "Plumbing Rough-In", unitRate: 1800, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 40, isFixed: true },
      { name: "Electrical rough-in", description: "First fix electrical — cabling, back boxes, exhaust fan ducting", trade: "Electrical Rough-In", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 50, isFixed: true },
      { name: "Framing & carpentry", description: "Wall framing, hob construction, niche framing and structural support", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 1684", order: 60 },
      { name: "Plasterboard lining", description: "Plasterboard lining to walls and ceiling — set, stop and finish", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 70 },
      { name: "Waterproofing membrane", description: "Applied waterproofing membrane to floor, walls and hob per AS 3740", trade: "Waterproofing", unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3740", order: 80 },
      { name: "Floor screed & levelling", description: "Screed to falls and floor levelling compound", trade: "Screed", unitRate: 40, unitType: "area", durationDays: 1, code: "AS 3958.1", order: 90 },
      { name: "Wall & floor tiling", description: "Floor and wall tiling including adhesive, grout and sealing", trade: "Tiling", unitRate: 140, unitType: "area", durationDays: 3, code: "AS 3958.1", order: 100 },
      { name: "Plumbing fit-off", description: "Final fix plumbing — install tapware, toilet, basin, shower mixer", trade: "Plumbing Fit-Off", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 170, isFixed: true },
      { name: "Electrical fit-off", description: "Final fix electrical — switches, GPOs, lights, exhaust fan", trade: "Electrical Fit-Off", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
      { name: "Painting & finishing", description: "Prep, prime and two-coat paint system to ceiling and any exposed walls", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
      { name: "Builder's clean", description: "Builder's clean — remove debris, wipe surfaces, practical completion", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...WET_AREA_QUESTIONS],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    description: "Kitchen renovation, cabinetry, benchtops, splashback",
    icon: "🍳",
    trades: ["Site Prep", "Demolition", "Plumbing Rough-In", "Electrical Rough-In", "Carpentry", "Plastering", "Joinery", "Tiling", "Plumbing Fit-Off", "Electrical Fit-Off", "Painting", "Cleaning"],
    stages: [
      { name: "Site preparation & protection", description: "Site setup, dust barriers, floor protection", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Demolition & strip-out", description: "Remove existing cabinetry, appliances, splashback and disposal", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
      { name: "Plumbing rough-in", description: "First fix plumbing — relocate/extend water, gas and drainage", trade: "Plumbing Rough-In", unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", order: 40, isFixed: true },
      { name: "Electrical rough-in", description: "First fix electrical — additional circuits, rangehood duct, lighting", trade: "Electrical Rough-In", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 50, isFixed: true },
      { name: "Wall framing & patching", description: "Framing modifications, wall patching and preparation", trade: "Carpentry", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 1684", order: 60 },
      { name: "Plasterboard & patching", description: "Plasterboard repair, set, stop and finish", trade: "Plastering", unitRate: 40, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 70 },
      { name: "Cabinetry supply & install", description: "Kitchen cabinetry — supply, deliver and install (base, wall, tall units)", trade: "Joinery", unitRate: 800, unitType: "area", durationDays: 3, code: "AS 4386", order: 110 },
      { name: "Benchtop template & install", description: "Benchtop measure, template, supply and install", trade: "Stone/Masonry", unitRate: 500, unitType: "area", durationDays: 2, code: "NCC 2022", order: 120 },
      { name: "Plumbing fit-off", description: "Final fix plumbing — sink, tap, dishwasher, gas connection", trade: "Plumbing Fit-Off", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 170, isFixed: true },
      { name: "Electrical fit-off", description: "Final fix electrical — GPOs, switches, undercabinet lighting", trade: "Electrical Fit-Off", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 180, isFixed: true },
      { name: "Painting & touch-up", description: "Prep, prime and two-coat paint to ceiling and walls", trade: "Painting", unitRate: 30, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
      { name: "Builder's clean", description: "Builder's clean — remove debris, wipe surfaces", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...KITCHEN_QUESTIONS],
  },
  {
    id: "structural",
    label: "Structural",
    description: "Wall removal, underpinning, retaining walls, extensions, slabs",
    icon: "🏗️",
    trades: ["Site Prep", "Engineering", "Demolition", "Concrete", "Structural", "Carpentry", "Plastering", "Painting", "Cleaning"],
    stages: [
      { name: "Site preparation & protection", description: "Site setup, propping, temporary support and protection", trade: "Site Prep", unitRate: 650, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Structural engineering", description: "Structural engineer engagement — design, calculations and certification", trade: "Engineering", unitRate: 2500, unitType: "allow", durationDays: 2, code: "AS 1170", order: 15, isFixed: true },
      { name: "Demolition & removal", description: "Controlled demolition, propping, removal and disposal", trade: "Demolition", unitRate: 75, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
      { name: "Concrete & footings", description: "Concrete works — footings, piers or slab as required", trade: "Concrete", unitRate: 180, unitType: "area", durationDays: 3, code: "AS 3600", order: 40 },
      { name: "Steel / timber beam install", description: "Structural beam supply and install — steel or LVL", trade: "Structural", unitRate: 220, unitType: "area", durationDays: 3, code: "AS 1684 / AS 4100", order: 50 },
      { name: "Framing & carpentry", description: "Wall framing, ceiling joists, noggings and bracing", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 3, code: "AS 1684", order: 60 },
      { name: "Plasterboard & finishing", description: "Plasterboard lining, set, stop and finish", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 70 },
      { name: "Painting", description: "Prep, prime and two-coat paint system", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 190 },
      { name: "Builder's clean", description: "Builder's clean and practical completion", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...STRUCTURAL_QUESTIONS],
  },
  {
    id: "external",
    label: "External / Outdoor",
    description: "Decking, pergolas, carports, fencing, landscaping, retaining walls",
    icon: "🏡",
    trades: ["Site Prep", "Site Works", "Concrete", "Carpentry", "Decking", "Landscaping", "Painting", "Cleaning"],
    stages: [
      { name: "Site preparation", description: "Site clearance, set out and temporary services", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Earthworks & site works", description: "Excavation, levelling and compaction", trade: "Site Works", unitRate: 65, unitType: "area", durationDays: 2, code: "NCC 2022", order: 20 },
      { name: "Concrete footings & piers", description: "Concrete footings, piers and bearer supports", trade: "Concrete", unitRate: 140, unitType: "area", durationDays: 2, code: "AS 3600", order: 40 },
      { name: "Framing — bearers & joists", description: "Structural framing — bearers, joists and bracing", trade: "Carpentry", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1684", order: 60 },
      { name: "Decking boards", description: "Deck board supply, install, fix and finish", trade: "Decking", unitRate: 280, unitType: "area", durationDays: 3, code: "AS 1684", order: 100 },
      { name: "Painting / oiling", description: "Deck oil or stain — 2 coat application", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
      { name: "Landscaping & surrounds", description: "Garden beds, paths, turf and surrounds", trade: "Landscaping", unitRate: 60, unitType: "area", durationDays: 2, code: "NCC 2022", order: 200 },
      { name: "Builder's clean", description: "Builder's clean and site tidy", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...EXTERNAL_QUESTIONS],
  },
  {
    id: "roofing",
    label: "Roofing",
    description: "Roof repairs, re-roofing, guttering, fascia, insulation",
    icon: "🏠",
    trades: ["Site Prep", "Scaffolding", "Roofing", "Guttering", "Carpentry", "Insulation", "Cleaning"],
    stages: [
      { name: "Site preparation", description: "Site setup, ground protection", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Scaffolding", description: "Scaffolding erect, hire and dismantle", trade: "Scaffolding", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", order: 12, isFixed: true },
      { name: "Strip existing roofing", description: "Remove existing roof sheets/tiles, battens and sarking", trade: "Roofing", unitRate: 35, unitType: "area", durationDays: 2, code: "AS 1562", order: 20 },
      { name: "Fascia & barge board", description: "Replace or repair fascia and barge boards", trade: "Carpentry", unitRate: 30, unitType: "area", durationDays: 1, code: "AS 1684", order: 50 },
      { name: "Insulation & sarking", description: "Roof insulation and sarking to NCC requirements", trade: "Insulation", unitRate: 30, unitType: "area", durationDays: 1, code: "NCC 2022 Vol 2 Part 3.12", order: 60 },
      { name: "New roof sheeting / tiles", description: "Roof sheeting or tile supply and install including flashings", trade: "Roofing", unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1562", order: 100 },
      { name: "Guttering & downpipes", description: "Gutter and downpipe supply and install", trade: "Guttering", unitRate: 45, unitType: "area", durationDays: 1, code: "AS/NZS 3500.3", order: 150 },
      { name: "Builder's clean", description: "Builder's clean — remove debris from site and roof", trade: "Cleaning", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...ROOFING_QUESTIONS],
  },
  {
    id: "painting",
    label: "Painting & Decorating",
    description: "Interior/exterior painting, feature walls, wallpaper",
    icon: "🎨",
    trades: ["Site Prep", "Plastering", "Painting", "Cleaning"],
    stages: [
      { name: "Site preparation & protection", description: "Dust sheets, masking, furniture protection", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Surface preparation", description: "Repair, patch, sand and prepare all surfaces", trade: "Plastering", unitRate: 25, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 30 },
      { name: "Primer coat", description: "Apply primer/sealer coat to all surfaces", trade: "Painting", unitRate: 12, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 100 },
      { name: "Two-coat paint application", description: "Apply two coats of finish paint — walls and ceilings", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 110 },
      { name: "Trim & detail painting", description: "Paint doors, architraves, skirting and window frames", trade: "Painting", unitRate: 15, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 120 },
      { name: "Builder's clean", description: "Remove dust sheets, clean up", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...PAINTING_QUESTIONS],
  },
  {
    id: "flooring",
    label: "Flooring",
    description: "Timber, hybrid, tile, carpet — supply and install",
    icon: "🪵",
    trades: ["Site Prep", "Demolition", "Screed", "Carpentry", "Flooring", "Skirting", "Cleaning"],
    stages: [
      { name: "Site preparation & protection", description: "Furniture removal, floor protection, dust barriers", trade: "Site Prep", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Remove existing floor covering", description: "Strip existing carpet, vinyl or tiles and dispose", trade: "Demolition", unitRate: 20, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
      { name: "Subfloor inspection & prep", description: "Inspect subfloor condition, repair and prepare", trade: "Carpentry", unitRate: 20, unitType: "area", durationDays: 1, code: "AS 1684", order: 40 },
      { name: "Floor covering supply & install", description: "Floor covering — supply, acclimatise and install", trade: "Flooring", unitRate: 95, unitType: "area", durationDays: 2, code: "NCC 2022", order: 100 },
      { name: "Transition strips & thresholds", description: "Transition strips at doorways and material changes", trade: "Flooring", unitRate: 180, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 150, isFixed: true },
      { name: "Builder's clean", description: "Builder's clean — vacuum, wipe and handover", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS, ...FLOORING_QUESTIONS],
  },
  {
    id: "general",
    label: "General Construction",
    description: "General building works, maintenance, repairs, fit-outs",
    icon: "🔨",
    trades: ["Site Prep", "Demolition", "Carpentry", "Plastering", "Electrical", "Plumbing", "Painting", "Cleaning"],
    stages: [
      { name: "Site preparation", description: "Site setup and protection", trade: "Site Prep", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
      { name: "Demolition & removal", description: "Demolition, strip-out and disposal", trade: "Demolition", unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", order: 20 },
      { name: "Carpentry & framing", description: "Carpentry, framing and fixing works", trade: "Carpentry", unitRate: 85, unitType: "area", durationDays: 3, code: "AS 1684", order: 60 },
      { name: "Plumbing", description: "Plumbing works as required", trade: "Plumbing", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", order: 70, isFixed: true },
      { name: "Electrical", description: "Electrical works as required", trade: "Electrical", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 80, isFixed: true },
      { name: "Plastering", description: "Plasterboard lining, set, stop and finish", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 90 },
      { name: "Painting", description: "Prep, prime and two-coat paint system", trade: "Painting", unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", order: 190 },
      { name: "Builder's clean", description: "Builder's clean and practical completion", trade: "Cleaning", unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
    ],
    questions: [...COMMON_QUESTIONS],
  },
];

// ─── Keyword-Based Scope Recognition (fallback when no API key) ─────────────

interface KeywordMatch {
  keywords: string[];
  categoryId: string;
  titlePrefix: string;
}

const KEYWORD_MAP: KeywordMatch[] = [
  { keywords: ["bathroom", "ensuite", "shower", "bath", "wet room", "powder room", "toilet", "laundry", "washroom"], categoryId: "wet_areas", titlePrefix: "Wet Area" },
  { keywords: ["kitchen", "cabinetry", "benchtop", "splashback", "rangehood", "pantry"], categoryId: "kitchen", titlePrefix: "Kitchen" },
  { keywords: ["wall removal", "load bearing", "underpinning", "retaining wall", "beam", "lintel", "structural", "foundation", "stumps", "restump", "slab"], categoryId: "structural", titlePrefix: "Structural" },
  { keywords: ["deck", "pergola", "carport", "fence", "fencing", "patio", "verandah", "outdoor", "landscaping", "garden", "retaining", "driveway", "concrete path"], categoryId: "external", titlePrefix: "External" },
  { keywords: ["roof", "re-roof", "gutter", "fascia", "downpipe", "flashing", "ridge cap", "sarking", "colorbond", "tile roof"], categoryId: "roofing", titlePrefix: "Roofing" },
  { keywords: ["paint", "painting", "repaint", "feature wall", "wallpaper", "render", "rendering"], categoryId: "painting", titlePrefix: "Painting" },
  { keywords: ["floor", "flooring", "timber floor", "carpet", "hybrid", "vinyl", "lvp", "hardwood", "tiles", "tiling"], categoryId: "flooring", titlePrefix: "Flooring" },
];

export function recogniseScopeFromText(input: string): RecognisedScope {
  const lower = input.toLowerCase().trim();

  // Score each category by keyword hits
  let bestMatch: KeywordMatch | null = null;
  let bestScore = 0;

  for (const entry of KEYWORD_MAP) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.split(" ").length; // multi-word keywords score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  const categoryId = bestMatch?.categoryId ?? "general";
  const category = WORK_CATEGORIES.find((c) => c.id === categoryId) ?? WORK_CATEGORIES[WORK_CATEGORIES.length - 1];
  const confidence = bestScore > 0 ? Math.min(bestScore * 25, 95) : 10;

  // Generate a suggested title
  const prefix = bestMatch?.titlePrefix ?? "General";
  const suggestedTitle = bestScore > 0
    ? `${prefix} — ${input.slice(0, 60)}`
    : input.slice(0, 80);

  return {
    categoryId: category.id,
    categoryLabel: category.label,
    confidence,
    trades: category.trades,
    stages: category.stages,
    questions: category.questions,
    suggestedTitle,
    rawInput: input,
  };
}

// ─── Gemini AI Scope Recognition ────────────────────────────────────────────

export async function recogniseScopeWithAI(
  input: string,
  apiKey: string
): Promise<RecognisedScope> {
  const categoryIds = WORK_CATEGORIES.map((c) => c.id);

  const prompt = `You are an Australian construction estimator. Analyse this description of building work and classify it.

Description: "${input}"

Available categories: ${categoryIds.join(", ")}

Respond in JSON only:
{
  "categoryId": "one of the category IDs above",
  "confidence": 0-100,
  "suggestedTitle": "a professional short title for this work"
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
        }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const catId = categoryIds.includes(parsed.categoryId) ? parsed.categoryId : "general";
      const category = WORK_CATEGORIES.find((c) => c.id === catId) ?? WORK_CATEGORIES[WORK_CATEGORIES.length - 1];

      return {
        categoryId: category.id,
        categoryLabel: category.label,
        confidence: Math.min(parsed.confidence ?? 80, 99),
        trades: category.trades,
        stages: category.stages,
        questions: category.questions,
        suggestedTitle: parsed.suggestedTitle || `${category.label} — ${input.slice(0, 60)}`,
        rawInput: input,
      };
    }
  } catch (e) {
    console.warn("AI scope recognition failed, falling back to keywords:", e);
  }

  // Fallback to keyword matching
  return recogniseScopeFromText(input);
}
