import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const FENCING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "fence_type",
    label: "Fence Type",
    category: "Materials",
    options: ["Colorbond steel", "Timber paling", "Timber horizontal slat", "Pool fencing — glass", "Pool fencing — aluminium", "Feature / front fence"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Timber horizontal slat", value: 1.3 },
      { type: "multiplier", matchAnswer: "Pool fencing — glass", value: 2.5 },
      { type: "multiplier", matchAnswer: "Pool fencing — aluminium", value: 1.5 },
      { type: "multiplier", matchAnswer: "Feature / front fence", value: 1.6 },
    ],
  },
  {
    id: "fence_height",
    label: "Fence Height",
    category: "Dimensions",
    options: ["1.2m (pool compliance)", "1.5m (front boundary)", "1.8m (standard boundary)", "2.1m (high privacy)"],
    costEffect: [
      { type: "multiplier", matchAnswer: "1.2m (pool compliance)", value: 0.85 },
      { type: "multiplier", matchAnswer: "1.5m (front boundary)", value: 0.92 },
      { type: "multiplier", matchAnswer: "2.1m (high privacy)", value: 1.15 },
    ],
  },
  {
    id: "fence_existing_removal",
    label: "Existing Fence Removal",
    category: "Demolition",
    options: ["No existing fence", "Remove existing timber fence", "Remove existing Colorbond fence", "Remove existing brick/masonry fence"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Remove existing timber fence", stage: { name: "Remove existing timber fence", description: "Remove and dispose existing timber fence including posts", trade: "Demolition", unitRate: 18, unitType: "linear", durationDays: 1, code: "AS 2601", order: 12 } },
      { type: "add_stage", matchAnswer: "Remove existing Colorbond fence", stage: { name: "Remove existing Colorbond fence", description: "Remove and dispose existing Colorbond fence including posts", trade: "Demolition", unitRate: 22, unitType: "linear", durationDays: 1, code: "AS 2601", order: 12 } },
      { type: "add_stage", matchAnswer: "Remove existing brick/masonry fence", stage: { name: "Remove existing masonry fence", description: "Demolish and dispose existing brick/masonry fence", trade: "Demolition", unitRate: 85, unitType: "linear", durationDays: 2, code: "AS 2601", order: 12 } },
    ],
  },
  {
    id: "fence_gate",
    label: "Gates Required",
    category: "Access",
    options: ["No gate", "Single pedestrian gate", "Double driveway gate", "Single + double gate set", "Sliding gate (automated)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Single pedestrian gate", stage: { name: "Pedestrian gate", description: "Single pedestrian gate — supply and install with hardware", trade: "Fencing", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS 1926", order: 55, isFixed: true } },
      { type: "add_stage", matchAnswer: "Double driveway gate", stage: { name: "Double driveway gate", description: "Double driveway gate — supply and install with hardware and drop bolts", trade: "Fencing", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1926", order: 55, isFixed: true } },
      { type: "add_stage", matchAnswer: "Single + double gate set", stage: { name: "Gate set — pedestrian + driveway", description: "Pedestrian gate and double driveway gate — supply and install", trade: "Fencing", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS 1926", order: 55, isFixed: true } },
      { type: "add_stage", matchAnswer: "Sliding gate (automated)", stage: { name: "Automated sliding gate", description: "Motorised sliding gate with remote control — supply, install and commission", trade: "Fencing", unitRate: 5500, unitType: "allow", durationDays: 2, code: "AS 1926", order: 55, isFixed: true } },
    ],
  },
  {
    id: "fence_retaining",
    label: "Retaining Required",
    category: "Structure",
    options: ["No retaining — level ground", "Minor retaining (under 300mm)", "Significant retaining (300mm+)"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Minor retaining (under 300mm)", stage: { name: "Minor retaining under fence", description: "Concrete retaining base under fence line — up to 300mm", trade: "Concrete", unitRate: 45, unitType: "linear", durationDays: 1, code: "AS 3600", order: 18 } },
      { type: "add_stage", matchAnswer: "Significant retaining (300mm+)", stage: { name: "Retaining wall under fence", description: "Concrete sleeper or block retaining wall under fence — 300mm+ height", trade: "Concrete", unitRate: 120, unitType: "linear", durationDays: 2, code: "AS 4678", order: 18 } },
    ],
  },
];

export const fencing: WorkCategory = {
  id: "fencing",
  label: "Fencing & Gates",
  description: "Colorbond, timber, pool fencing, front fences and gates",
  icon: "🏡",
  trades: ["Site Prep", "Demolition", "Excavation", "Concrete", "Fencing", "Cleaning"],
  stages: [
    { name: "Site preparation & set-out", description: "Mark out fence line, locate services (Dial Before You Dig)", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Post hole excavation", description: "Excavate post holes at specified centres — hand or machine auger", trade: "Excavation", unitRate: 25, unitType: "item", durationDays: 1, code: "AS 1926", order: 20 },
    { name: "Post installation & concrete", description: "Steel or timber posts — plumb, brace and concrete into holes", trade: "Fencing", unitRate: 45, unitType: "item", durationDays: 1, code: "AS 1926", order: 30 },
    { name: "Rail installation", description: "Top rail, bottom rail and mid-rail installation", trade: "Fencing", unitRate: 18, unitType: "linear", durationDays: 1, code: "AS 1926", order: 40 },
    { name: "Fence panel / sheet installation", description: "Fence panels, sheets or palings — supply and fix", trade: "Fencing", unitRate: 55, unitType: "linear", durationDays: 2, code: "AS 1926", order: 50 },
    { name: "Capping & finishing", description: "Post caps, capping rail and finishing touches", trade: "Fencing", unitRate: 8, unitType: "linear", durationDays: 1, code: "AS 1926", order: 60 },
    { name: "Builder's clean", description: "Builder's clean — debris removal, excess concrete and site tidy", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...FENCING_QUESTIONS],
};
