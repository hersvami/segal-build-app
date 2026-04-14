import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const INTERNAL_WALL_QUESTIONS: ScopeQuestion[] = [
  {
    id: "wall_scope",
    label: "Wall Work Scope",
    category: "Structure",
    options: ["New stud wall construction", "Wall relocation", "Niche / recess construction", "Patch & repair existing walls"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Wall relocation", value: 1.3 },
      { type: "add_stage", matchAnswer: "Niche / recess construction", stage: { name: "Niche / recess framing", description: "Frame and line recessed niches including plasterboard finish", trade: "Carpentry", unitRate: 250, unitType: "item", durationDays: 1, code: "AS 1684", order: 55 } },
    ],
  },
  {
    id: "wall_lining_type",
    label: "Wall Lining",
    category: "Finishes",
    options: ["Standard 10mm plasterboard", "13mm plasterboard (fire/acoustic)", "Moisture-resistant plasterboard", "Feature timber lining"],
    costEffect: [
      { type: "multiplier", matchAnswer: "13mm plasterboard (fire/acoustic)", value: 1.15 },
      { type: "multiplier", matchAnswer: "Moisture-resistant plasterboard", value: 1.12 },
      { type: "multiplier", matchAnswer: "Feature timber lining", value: 1.6 },
    ],
  },
  {
    id: "wall_insulation",
    label: "Wall Insulation",
    category: "Insulation",
    options: ["None required", "R2.0 batts (standard)", "R2.5 batts (acoustic)", "Acoustic panel system"],
    costEffect: [
      { type: "add_stage", matchAnswer: "R2.0 batts (standard)", stage: { name: "Wall insulation — R2.0", description: "R2.0 wall insulation batts supply and install", trade: "Insulation", unitRate: 10, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 55 } },
      { type: "add_stage", matchAnswer: "R2.5 batts (acoustic)", stage: { name: "Wall insulation — R2.5 acoustic", description: "R2.5 acoustic wall insulation batts supply and install", trade: "Insulation", unitRate: 14, unitType: "area", durationDays: 1, code: "NCC 2022 Section J", order: 55 } },
      { type: "add_stage", matchAnswer: "Acoustic panel system", stage: { name: "Acoustic panel system", description: "Acoustic panel system including resilient mounts and double plasterboard", trade: "Acoustic", unitRate: 85, unitType: "area", durationDays: 2, code: "AS/NZS 1276", order: 55 } },
    ],
  },
  {
    id: "wall_door_opening",
    label: "New Door Opening Required",
    category: "Carpentry",
    options: ["No new opening", "Standard door opening", "Sliding cavity door opening", "Double door / wide opening"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Standard door opening", stage: { name: "Door opening — standard", description: "New door opening — lintel, frame, architrave and door supply & install", trade: "Carpentry", unitRate: 850, unitType: "allow", durationDays: 1, code: "AS 1684", order: 65, isFixed: true } },
      { type: "add_stage", matchAnswer: "Sliding cavity door opening", stage: { name: "Door opening — cavity slider", description: "Cavity slider opening — frame, track system, door supply & install", trade: "Carpentry", unitRate: 1400, unitType: "allow", durationDays: 1, code: "AS 1684", order: 65, isFixed: true } },
      { type: "add_stage", matchAnswer: "Double door / wide opening", stage: { name: "Door opening — double/wide", description: "Double door or wide opening — lintel, frames, doors supply & install", trade: "Carpentry", unitRate: 1600, unitType: "allow", durationDays: 1, code: "AS 1684", order: 65, isFixed: true } },
    ],
  },
];

export const internalWalls: WorkCategory = {
  id: "internal_walls",
  label: "Internal Walls",
  description: "New stud walls, wall relocation, plasterboard lining, wall repairs and niches",
  icon: "🧱",
  trades: ["Site Prep", "Demolition", "Carpentry", "Insulation", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Floor protection, dust barriers and site setup", trade: "Site Prep", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition of existing wall", description: "Remove existing wall lining, framing and disposal", trade: "Demolition", unitRate: 30, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Wall framing — timber stud", description: "New timber stud wall framing including top/bottom plates and studs at 450mm centres", trade: "Carpentry", unitRate: 55, unitType: "area", durationDays: 1, code: "AS 1684", order: 50 },
    { name: "Services rough-in allowance", description: "Allowance for electrical and plumbing rough-in within new wall", trade: "Carpentry", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 55, isFixed: true },
    { name: "Plasterboard lining", description: "Plasterboard lining — fix, set, stop and finish to Level 4", trade: "Plastering", unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 70 },
    { name: "Painting", description: "Prep, prime and two-coat paint system to new walls", trade: "Painting", unitRate: 22, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Builder's clean — debris removal and dust wipe", trade: "Cleaning", unitRate: 200, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...INTERNAL_WALL_QUESTIONS],
};
