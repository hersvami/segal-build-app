import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const STEEL_FRAMING_QUESTIONS: ScopeQuestion[] = [
  {
    id: "steel_type",
    label: "Steel Work Type",
    category: "Structure",
    options: ["Steel beam (UB/UC) installation", "Steel portal frame", "Steel post and beam", "Roof framing — steel truss"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Steel portal frame", value: 1.4 },
      { type: "multiplier", matchAnswer: "Roof framing — steel truss", value: 1.2 },
    ],
  },
  {
    id: "steel_size",
    label: "Beam / Member Size",
    category: "Dimensions",
    options: ["Light — up to 200UB", "Medium — 250-310UB", "Heavy — 360UB+", "Engineer to specify"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Medium — 250-310UB", value: 1.25 },
      { type: "multiplier", matchAnswer: "Heavy — 360UB+", value: 1.5 },
    ],
  },
  {
    id: "steel_crane",
    label: "Crane Required",
    category: "Access",
    options: ["No — can be manually lifted", "Yes — mobile crane required"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Yes — mobile crane required", stage: { name: "Mobile crane hire", description: "Mobile crane hire for steel beam installation — minimum 4hr hire", trade: "Crane", unitRate: 2200, unitType: "allow", durationDays: 1, code: "AS 1418", order: 35, isFixed: true } },
    ],
  },
  {
    id: "steel_connection",
    label: "Connection Type",
    category: "Structure",
    options: ["Bolted connections", "Welded connections (on-site)", "Pre-fabricated connections"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Welded connections (on-site)", value: 1.2 },
    ],
  },
  {
    id: "steel_fireproofing",
    label: "Fire Rating Required",
    category: "Fire Safety",
    options: ["No fire rating required", "Intumescent paint coating", "Encasement in plasterboard"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Intumescent paint coating", stage: { name: "Intumescent fire coating", description: "Intumescent fire-resistant paint coating to steel members", trade: "Painting", unitRate: 85, unitType: "linear", durationDays: 1, code: "AS 1530", order: 80 } },
      { type: "add_stage", matchAnswer: "Encasement in plasterboard", stage: { name: "Steel beam encasement", description: "Fire-rated plasterboard encasement to steel beams per BCA requirement", trade: "Plastering", unitRate: 120, unitType: "linear", durationDays: 1, code: "NCC 2022", order: 80 } },
    ],
  },
];

export const steelFraming: WorkCategory = {
  id: "steel_framing",
  label: "Steel & Framing",
  description: "Steel beams, steel framing, roof trusses and structural steel installation",
  icon: "🏗️",
  trades: ["Engineering", "Demolition", "Concrete", "Steel Fabrication", "Crane", "Carpentry", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Structural engineering design", description: "Structural engineer — steel member design, connection details and certification", trade: "Engineering", unitRate: 3000, unitType: "allow", durationDays: 5, code: "AS 4100", order: 5, isFixed: true },
    { name: "Temporary propping & support", description: "Install temporary props and support to existing structure during steel installation", trade: "Carpentry", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1684", order: 15, isFixed: true },
    { name: "Demolition for steel install", description: "Remove existing structure to allow steel beam/frame installation", trade: "Demolition", unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS 2601", order: 20, isFixed: true },
    { name: "Steel fabrication & delivery", description: "Steel member fabrication, hot-dip galvanise and delivery to site", trade: "Steel Fabrication", unitRate: 450, unitType: "linear", durationDays: 5, code: "AS 4100", order: 30 },
    { name: "Steel erection & installation", description: "Erect and install steel members including bolted connections and alignment", trade: "Steel Fabrication", unitRate: 280, unitType: "linear", durationDays: 2, code: "AS 4100", order: 40 },
    { name: "Bearing pad installation", description: "Concrete or steel bearing pads at support points", trade: "Concrete", unitRate: 350, unitType: "item", durationDays: 1, code: "AS 3600", order: 38 },
    { name: "Remove temporary propping", description: "Remove temporary props after steel is loaded and verified", trade: "Carpentry", unitRate: 400, unitType: "allow", durationDays: 1, code: "AS 1684", order: 50, isFixed: true },
    { name: "Engineer inspection & sign-off", description: "Structural engineer site inspection and compliance certification", trade: "Engineering", unitRate: 950, unitType: "allow", durationDays: 1, code: "AS 4100", order: 150, isFixed: true },
    { name: "Builder's clean", description: "Builder's clean — debris removal and site tidy", trade: "Cleaning", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...STEEL_FRAMING_QUESTIONS],
};
