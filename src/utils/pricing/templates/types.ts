export interface StageTemplate {
  name: string;
  description: string;
  trade: string;
  unitRate: number;
  unitType: "area" | "allow";
  durationDays: number;
  code?: string;
  order: number;
  isFixed?: boolean;
}