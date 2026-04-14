import type { WorkCategory, ScopeQuestion } from "./types";
import { COMMON_QUESTIONS } from "./types";

const SMART_HOME_QUESTIONS: ScopeQuestion[] = [
  {
    id: "smart_scope",
    label: "Smart Home Scope",
    category: "Technology",
    options: ["Basic — smart lighting & switches", "Mid-range — lighting, security & HVAC control", "Full automation — whole-house system", "CCTV & intercom only"],
    costEffect: [
      { type: "multiplier", matchAnswer: "Mid-range — lighting, security & HVAC control", value: 1.5 },
      { type: "multiplier", matchAnswer: "Full automation — whole-house system", value: 2.5 },
      { type: "multiplier", matchAnswer: "CCTV & intercom only", value: 0.6 },
    ],
  },
  {
    id: "smart_network",
    label: "Network Infrastructure",
    category: "Data",
    options: ["WiFi only — no cabling", "Cat6 data cabling to key rooms", "Full Cat6A cabling — every room", "Fibre backbone + Cat6A"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Cat6 data cabling to key rooms", stage: { name: "Data cabling — key rooms", description: "Cat6 data cabling to living, study, bedrooms — patch panel and wall plates", trade: "Data Cabling", unitRate: 180, unitType: "item", durationDays: 1, code: "AS/NZS 3080", order: 35 } },
      { type: "add_stage", matchAnswer: "Full Cat6A cabling — every room", stage: { name: "Data cabling — full house", description: "Cat6A data cabling to every room — patch panel, rack and wall plates", trade: "Data Cabling", unitRate: 180, unitType: "item", durationDays: 2, code: "AS/NZS 3080", order: 35 } },
      { type: "add_stage", matchAnswer: "Fibre backbone + Cat6A", stage: { name: "Fibre & Cat6A network", description: "Fibre optic backbone with Cat6A distribution — enterprise grade", trade: "Data Cabling", unitRate: 5500, unitType: "allow", durationDays: 3, code: "AS/NZS 3080", order: 35, isFixed: true } },
    ],
  },
  {
    id: "smart_cctv",
    label: "CCTV System",
    category: "Security",
    options: ["No CCTV", "4 camera system", "8 camera system", "12+ camera system"],
    costEffect: [
      { type: "add_stage", matchAnswer: "4 camera system", stage: { name: "CCTV — 4 camera system", description: "4-camera IP CCTV system with NVR, cabling and commissioning", trade: "Security", unitRate: 2800, unitType: "allow", durationDays: 1, code: "AS 4806", order: 60, isFixed: true } },
      { type: "add_stage", matchAnswer: "8 camera system", stage: { name: "CCTV — 8 camera system", description: "8-camera IP CCTV system with NVR, cabling and commissioning", trade: "Security", unitRate: 4500, unitType: "allow", durationDays: 2, code: "AS 4806", order: 60, isFixed: true } },
      { type: "add_stage", matchAnswer: "12+ camera system", stage: { name: "CCTV — 12+ camera system", description: "12+ camera IP CCTV system with NVR, cabling and commissioning", trade: "Security", unitRate: 7500, unitType: "allow", durationDays: 3, code: "AS 4806", order: 60, isFixed: true } },
    ],
  },
  {
    id: "smart_intercom",
    label: "Intercom / Video Doorbell",
    category: "Security",
    options: ["No intercom", "Smart video doorbell (Ring/Nest)", "Wired video intercom — single station", "Multi-station intercom system"],
    costEffect: [
      { type: "add_stage", matchAnswer: "Smart video doorbell (Ring/Nest)", stage: { name: "Smart video doorbell", description: "Smart video doorbell installation and WiFi integration", trade: "Electrical", unitRate: 450, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 55, isFixed: true } },
      { type: "add_stage", matchAnswer: "Wired video intercom — single station", stage: { name: "Video intercom — single", description: "Wired video intercom system — single internal station, supply and install", trade: "Electrical", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 55, isFixed: true } },
      { type: "add_stage", matchAnswer: "Multi-station intercom system", stage: { name: "Video intercom — multi-station", description: "Multi-station video intercom system — supply, install and commission", trade: "Electrical", unitRate: 3500, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 55, isFixed: true } },
    ],
  },
];

export const smartHome: WorkCategory = {
  id: "smart_home",
  label: "Smart Home & Data",
  description: "Home automation, CCTV, intercom, network cabling and smart home systems",
  icon: "📡",
  trades: ["Electrical", "Data Cabling", "Security", "Cleaning"],
  stages: [
    { name: "System design & specification", description: "Smart home system design, equipment specification and wiring schedule", trade: "Electrical", unitRate: 1500, unitType: "allow", durationDays: 2, code: "AS/NZS 3000", order: 5, isFixed: true },
    { name: "Cable rough-in", description: "Run all data, CCTV, intercom and automation cabling during construction/renovation", trade: "Data Cabling", unitRate: 120, unitType: "item", durationDays: 2, code: "AS/NZS 3080", order: 30 },
    { name: "Smart switch & sensor installation", description: "Smart switches, sensors and actuators — supply and install", trade: "Electrical", unitRate: 150, unitType: "item", durationDays: 1, code: "AS/NZS 3000", order: 50 },
    { name: "Network cabinet setup", description: "Network cabinet, patch panel, switch and WiFi access point installation", trade: "Data Cabling", unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS/NZS 3080", order: 40, isFixed: true },
    { name: "System commissioning & programming", description: "Commission all smart home systems, program scenes and test", trade: "Electrical", unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", order: 80, isFixed: true },
    { name: "Client training & handover", description: "Train client on system operation, provide documentation and support", trade: "Electrical", unitRate: 350, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [...COMMON_QUESTIONS, ...SMART_HOME_QUESTIONS],
};
