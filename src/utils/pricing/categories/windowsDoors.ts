import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const WINDOWS_DOORS_QUESTIONS: ScopeQuestion[] = [
  {
    id: "window_type",
    label: "Window Type",
    category: "Windows",
    options: ["Aluminium single glazed", "Aluminium double glazed", "Timber windows", "uPVC double glazed"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Aluminium double glazed", value: 1.4 },
      { type: "multiplier", matchAnswer: "Timber windows", value: 1.5 },
      { type: "multiplier", matchAnswer: "uPVC double glazed", value: 1.35 },
    ],
  },
  {
    id: "door_type",
    label: "Door Type",
    category: "Doors",
    options: ["Standard hollow core", "Solid core", "Cavity slider", "Bi-fold doors", "Sliding glass doors"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Solid core", value: 1.15 },
      { type: "multiplier", matchAnswer: "Bi-fold doors", value: 1.6 },
      { type: "multiplier", matchAnswer: "Sliding glass doors", value: 1.4 },
    ],
  },
  {
    id: "security",
    label: "Security Screens/Bars",
    category: "Security",
    options: ["Not required", "Fly screens only", "Security screens (Crimsafe etc.)", "Security bars"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Fly screens only", stage: { name: "Fly screens", description: "Supply and install fly screens to windows", trade: "Screens", unitRate: 180, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 185, isFixed: true } },
      { type: "add_stage", matchAnswer: "Security screens (Crimsafe etc.)", stage: { name: "Security screens", description: "Supply and install security mesh screens (Crimsafe or equivalent)", trade: "Security", unitRate: 650, unitType: "allow", durationDays: 1, code: "AS 5039", order: 185, isFixed: true } },
      { type: "add_stage", matchAnswer: "Security bars", stage: { name: "Security bars", description: "Supply and install security bars to windows", trade: "Security", unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 185, isFixed: true } },
    ],
  },
];

export const windowsDoors: WorkCategory = {
  id: "windows_doors",
  label: "Windows & Doors",
  description: "Window replacement, door installation, double glazing, security screens",
  icon: "🪟",
  trades: ["Site Prep", "Demolition", "Carpentry", "Glazing", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Site preparation & protection", description: "Protect floors, furniture and surrounds", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Remove existing windows/doors", description: "Carefully remove existing units, frame and trim", trade: "Demolition", unitRate: 45, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Frame preparation & adjustment", description: "Check, adjust or rebuild frame openings", trade: "Carpentry", unitRate: 65, unitType: "area", durationDays: 2, code: "AS 1684", order: 40 },
    { name: "New window/door supply & install", description: "Supply and install new windows or doors including hardware", trade: "Glazing", unitRate: 450, unitType: "area", durationDays: 2, code: "AS 2047 / AS 1288", order: 80 },
    { name: "Flashings & weatherproofing", description: "Install flashings, sealant and weatherproofing", trade: "Carpentry", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 4654.2", order: 100 },
    { name: "Internal trim & architraves", description: "Install architraves, reveal linings and trim", trade: "Carpentry", unitRate: 40, unitType: "area", durationDays: 1, code: "NCC 2022", order: 130 },
    { name: "Plaster patching", description: "Patch and repair plasterboard around new openings", trade: "Plastering", unitRate: 30, unitType: "area", durationDays: 1, code: "AS/NZS 2589", order: 150 },
    { name: "Painting & finishing", description: "Prep, prime and paint new frames, trim and surrounds", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Builder's clean", description: "Clean up glass, debris and site tidy", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...WINDOWS_DOORS_QUESTIONS],
};
