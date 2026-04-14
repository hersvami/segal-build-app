/**
 * Master Category Registry
 * ─────────────────────────
 * All 43 work categories for domestic residential building.
 * Each category is in its own file to keep the bundle manageable.
 *
 * Categories are sourced from:
 *   - Rawlinsons Australian Construction Handbook 2024
 *   - Rawlinsons Construction Cost Guide
 *   - Cordell Cost Guides (CoreLogic)
 *
 * Rate methodology: $/m², $/lm, $/item, $/allowance
 * Regional base: Melbourne, VIC (multiplier 1.0)
 */

import type { WorkCategory } from "./types";

// ─── Wet Areas & Kitchen (4) ──────────────────────────────────────────────────
import { wetAreas } from "./wetAreas";
import { laundry } from "./laundry";
import { kitchen } from "./kitchen";
import { toilet } from "./toilet";

// ─── Internal Renovations (8) ─────────────────────────────────────────────────
import { flooring } from "./flooring";
import { painting } from "./painting";
import { windowsDoors } from "./windowsDoors";
import { brickwork } from "./brickwork";
import { cabinetry } from "./cabinetry";
import { ceilings } from "./ceilings";
import { internalWalls } from "./internalWalls";
import { demolition } from "./demolition";

// ─── Structural (4) ──────────────────────────────────────────────────────────
import { structural } from "./structural";
import { underpinning } from "./underpinning";
import { retainingWalls } from "./retainingWalls";
import { steelFraming } from "./steelFraming";

// ─── Extensions & New Builds (5) ─────────────────────────────────────────────
import { extensions } from "./extensions";
import { secondStorey } from "./secondStorey";
import { newHomeBuild } from "./newHomeBuild";
import { multiUnit } from "./multiUnit";
import { grannyFlat } from "./grannyFlat";

// ─── External & Outdoor (7) ──────────────────────────────────────────────────
import { decking } from "./decking";
import { pergola } from "./pergola";
import { paving } from "./paving";
import { concreting } from "./concreting";
import { fencing } from "./fencing";
import { landscaping } from "./landscaping";
import { pools } from "./pools";

// ─── Roofing (3) ─────────────────────────────────────────────────────────────
import { roofing } from "./roofing";
import { roofRepairs } from "./roofRepairs";
import { guttersFascia } from "./guttersFascia";

// ─── Services & Trades (5) ───────────────────────────────────────────────────
import { electrical } from "./electrical";
import { plumbing } from "./plumbing";
import { hvac } from "./hvac";
import { waterproofing } from "./waterproofing";
import { insulation } from "./insulation";

// ─── Specialty Residential (7) ───────────────────────────────────────────────
import { fireSafety } from "./fireSafety";
import { accessibility } from "./accessibility";
import { heritage } from "./heritage";
import { rendering } from "./rendering";
import { cladding } from "./cladding";
import { acoustic } from "./acoustic";
import { smartHome } from "./smartHome";

// ─── Master Registry ─────────────────────────────────────────────────────────

/**
 * ALL_CATEGORIES — flat array of every registered WorkCategory.
 * Use this for AI scope recognition and keyword matching.
 */
export const ALL_CATEGORIES: WorkCategory[] = [
  // Wet Areas & Kitchen
  wetAreas,
  laundry,
  kitchen,
  toilet,

  // Internal Renovations
  flooring,
  painting,
  windowsDoors,
  brickwork,
  cabinetry,
  ceilings,
  internalWalls,
  demolition,

  // Structural
  structural,
  underpinning,
  retainingWalls,
  steelFraming,

  // Extensions & New Builds
  extensions,
  secondStorey,
  newHomeBuild,
  multiUnit,
  grannyFlat,

  // External & Outdoor
  decking,
  pergola,
  paving,
  concreting,
  fencing,
  landscaping,
  pools,

  // Roofing
  roofing,
  roofRepairs,
  guttersFascia,

  // Services & Trades
  electrical,
  plumbing,
  hvac,
  waterproofing,
  insulation,

  // Specialty Residential
  fireSafety,
  accessibility,
  heritage,
  rendering,
  cladding,
  acoustic,
  smartHome,
];

/**
 * CATEGORY_MAP — lookup by category ID for fast access.
 */
export const CATEGORY_MAP: Record<string, WorkCategory> = {};
for (const cat of ALL_CATEGORIES) {
  CATEGORY_MAP[cat.id] = cat;
}

/**
 * getCategoryById — safe lookup with undefined return if not found.
 */
export function getCategoryById(id: string): WorkCategory | undefined {
  return CATEGORY_MAP[id];
}

/**
 * searchCategories — keyword search across all category labels, descriptions, and keywords.
 * Returns matching categories sorted by relevance (label match > description match).
 */
export function searchCategories(query: string): WorkCategory[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored: { cat: WorkCategory; score: number }[] = [];

  for (const cat of ALL_CATEGORIES) {
    let score = 0;

    // Exact label match
    if (cat.label.toLowerCase() === q) {
      score += 100;
    }
    // Label contains query
    else if (cat.label.toLowerCase().includes(q)) {
      score += 50;
    }

    // Description contains query
    if (cat.description.toLowerCase().includes(q)) {
      score += 20;
    }

    // Trade match
    for (const trade of cat.trades) {
      if (trade.toLowerCase().includes(q)) {
        score += 10;
        break;
      }
    }

    if (score > 0) {
      scored.push({ cat, score });
    }
  }

  return scored.sort((a, b) => b.score - a.score).map((s) => s.cat);
}

// ─── Category Groups (for UI display) ────────────────────────────────────────

export const CATEGORY_GROUPS = [
  {
    label: "Wet Areas & Kitchen",
    icon: "🚿",
    categories: [wetAreas, laundry, kitchen, toilet],
  },
  {
    label: "Internal Renovations",
    icon: "🏠",
    categories: [flooring, painting, windowsDoors, brickwork, cabinetry, ceilings, internalWalls, demolition],
  },
  {
    label: "Structural",
    icon: "🏗️",
    categories: [structural, underpinning, retainingWalls, steelFraming],
  },
  {
    label: "Extensions & New Builds",
    icon: "🏡",
    categories: [extensions, secondStorey, newHomeBuild, multiUnit, grannyFlat],
  },
  {
    label: "External & Outdoor",
    icon: "🌳",
    categories: [decking, pergola, paving, concreting, fencing, landscaping, pools],
  },
  {
    label: "Roofing",
    icon: "🏠",
    categories: [roofing, roofRepairs, guttersFascia],
  },
  {
    label: "Services & Trades",
    icon: "⚡",
    categories: [electrical, plumbing, hvac, waterproofing, insulation],
  },
  {
    label: "Specialty Residential",
    icon: "🔧",
    categories: [fireSafety, accessibility, heritage, rendering, cladding, acoustic, smartHome],
  },
];

// Re-export types
export type { WorkCategory, ScopeQuestion } from "./types";
export { COMMON_QUESTIONS } from "./types";
