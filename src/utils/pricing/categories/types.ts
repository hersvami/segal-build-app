/**
 * Shared types for all 67 work categories
 * Each category file exports a single WorkCategory object
 */
import type { StageTemplate } from "../types";

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

export interface WorkCategory {
  id: string;
  label: string;
  description: string;
  icon: string;
  trades: string[];
  stages: StageTemplate[];
  questions: ScopeQuestion[];
}

// ─── Common questions shared by ALL categories ────────────────────────────────

export const COMMON_QUESTIONS: ScopeQuestion[] = [
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
