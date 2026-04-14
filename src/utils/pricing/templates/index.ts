import type { StageTemplate } from "./types";
import { bathroomStages } from "./bathroom";
import { kitchenStages } from "./kitchen";
import { laundryStages } from "./laundry";
import { flooringStages } from "./flooring";
import { bedroomStages } from "./bedroom";
import { livingStages } from "./living";
import { structuralStages } from "./structural";
import { windowsStages } from "./windows";
import { outdoorStages } from "./outdoor";
import { roofingStages } from "./roofing";
import { paintingStages } from "./painting";
import { generalStages } from "./general";

export type { StageTemplate };

export const ROOM_STAGE_MAP: Record<string, StageTemplate[]> = {
  bathroom: bathroomStages,
  kitchen: kitchenStages,
  laundry: laundryStages,
  flooring: flooringStages,
  bedroom: bedroomStages,
  living: livingStages,
  structural: structuralStages,
  windows: windowsStages,
  outdoor: outdoorStages,
  roofing: roofingStages,
  painting: paintingStages,
  general: generalStages,
};