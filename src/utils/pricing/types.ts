export interface StageTemplate {
  name: string;
  description: string;
  trade: string;
  unitRate: number;
  unitType: "area" | "allow" | "linear" | "item";
  durationDays: number;
  code?: string;
  order: number;
  isFixed?: boolean;
}
