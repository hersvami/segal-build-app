import type { WorkCategory } from "./types";
import { COMMON_QUESTIONS } from "./types";

export const acoustic: WorkCategory = {
  id: "acoustic",
  label: "Acoustic & Soundproofing",
  description: "Studio walls, party wall upgrades, acoustic ceilings, sound isolation",
  icon: "🔇",
  trades: ["Site Prep", "Demolition", "Carpentry", "Insulation", "Plastering", "Painting", "Cleaning"],
  stages: [
    { name: "Acoustic assessment", description: "Acoustic assessment and design recommendations", trade: "Administration", unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022 Vol 1 Part F5", order: 5, isFixed: true },
    { name: "Site preparation", description: "Site setup and protection", trade: "Site Prep", unitRate: 300, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 10, isFixed: true },
    { name: "Demolition of existing linings", description: "Remove existing wall/ceiling linings", trade: "Demolition", unitRate: 35, unitType: "area", durationDays: 1, code: "AS 2601", order: 20 },
    { name: "Acoustic framing", description: "Staggered stud or resilient channel framing", trade: "Carpentry", unitRate: 75, unitType: "area", durationDays: 2, code: "NCC 2022", order: 40 },
    { name: "Acoustic insulation", description: "Install acoustic insulation batts (Rockwool/Knauf)", trade: "Insulation", unitRate: 35, unitType: "area", durationDays: 1, code: "NCC 2022", order: 60 },
    { name: "Acoustic plasterboard", description: "Supply and install acoustic rated plasterboard (SoundShield)", trade: "Plastering", unitRate: 65, unitType: "area", durationDays: 2, code: "AS/NZS 2589", order: 80 },
    { name: "Acoustic sealing", description: "Seal all gaps, joints and penetrations with acoustic sealant", trade: "Carpentry", unitRate: 15, unitType: "area", durationDays: 1, code: "NCC 2022", order: 100 },
    { name: "Painting & finishing", description: "Paint and finish acoustic linings", trade: "Painting", unitRate: 25, unitType: "area", durationDays: 1, code: "AS/NZS 2311", order: 190 },
    { name: "Acoustic testing", description: "Post-installation acoustic testing and certification", trade: "Administration", unitRate: 600, unitType: "allow", durationDays: 1, code: "AS/NZS ISO 717", order: 220, isFixed: true },
    { name: "Builder's clean", description: "Clean up and handover", trade: "Cleaning", unitRate: 250, unitType: "allow", durationDays: 1, code: "NCC 2022", order: 230, isFixed: true },
  ],
  questions: [
    ...COMMON_QUESTIONS,
    {
      id: "acoustic_scope", label: "Acoustic Scope", category: "Acoustic",
      options: ["Single wall upgrade", "Full room isolation", "Ceiling only", "Home studio / theatre"],
      costEffect: [
        { type: "multiplier", matchAnswer: "Full room isolation", value: 1.8 },
        { type: "multiplier", matchAnswer: "Home studio / theatre", value: 2.0 },
      ],
    },
  ],
};
