export const OVERHEAD = 0.15;
export const MARGIN = 0.20;

export function toClient(builderCost: number): number {
  return Math.round(builderCost * (1 + OVERHEAD) * (1 + MARGIN));
}

export const FIXED_COST_TRADES = new Set([
  "Site Prep",
  "Skip Bin",
  "Asbestos Removal",
  "Scaffolding",
  "Engineering",
  "Cleaning",
  "Detail Clean",
]);

export const VICTORIAN_TRADE_RATES: Record<
  string,
  { unitRate: number; unitType: "area" | "allow"; durationDays: number; code: string; description: string }
> = {
  "Site Prep": { unitRate: 450, unitType: "allow", durationDays: 1, code: "NCC 2022", description: "Site setup, protection and temporary services" },
  "Skip Bin": { unitRate: 450, unitType: "allow", durationDays: 1, code: "EPA Vic", description: "Skip bin delivery, hire and removal" },
  "Asbestos Removal": { unitRate: 3500, unitType: "allow", durationDays: 2, code: "Code of Practice (WorkSafe Vic)", description: "Licensed asbestos removal and disposal" },
  Demolition: { unitRate: 55, unitType: "area", durationDays: 2, code: "AS 2601", description: "Strip out and disposal to licensed facility" },
  Structural: { unitRate: 220, unitType: "area", durationDays: 3, code: "AS 1684", description: "Structural framing and beam works" },
  Engineering: { unitRate: 1500, unitType: "allow", durationDays: 1, code: "AS 1170", description: "Structural engineering assessment and certification" },
  Carpentry: { unitRate: 85, unitType: "area", durationDays: 3, code: "AS 1684", description: "Framing, fixing and timber works" },
  Plumbing: { unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", description: "Pipework, fixtures and drainage" },
  "Plumbing Rough-In": { unitRate: 1800, unitType: "allow", durationDays: 2, code: "AS/NZS 3500", description: "First fix plumbing — pipework and drainage" },
  "Plumbing Fit-Off": { unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3500", description: "Final fix plumbing — fixtures and tapware" },
  Electrical: { unitRate: 950, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", description: "Wiring, switchboard, lighting and power" },
  "Electrical Rough-In": { unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", description: "First fix electrical — cabling and back boxes" },
  "Electrical Fit-Off": { unitRate: 850, unitType: "allow", durationDays: 1, code: "AS/NZS 3000", description: "Final fix electrical — switches, GPOs, lights" },
  Plastering: { unitRate: 45, unitType: "area", durationDays: 2, code: "AS/NZS 2589", description: "Plasterboard lining, set and finish" },
  Screed: { unitRate: 40, unitType: "area", durationDays: 1, code: "AS 3958.1", description: "Floor screed and levelling compound" },
  Waterproofing: { unitRate: 95, unitType: "area", durationDays: 1, code: "AS 3740", description: "Membrane waterproofing to wet areas" },
  Tiling: { unitRate: 140, unitType: "area", durationDays: 3, code: "AS 3958.1", description: "Floor and wall tiling to Australian Standards" },
  Joinery: { unitRate: 800, unitType: "area", durationDays: 3, code: "AS 4386", description: "Cabinetry supply and install" },
  "Stone/Masonry": { unitRate: 500, unitType: "area", durationDays: 1, code: "NCC 2022", description: "Stone benchtops or masonry works" },
  Painting: { unitRate: 35, unitType: "area", durationDays: 2, code: "AS/NZS 2311", description: "Prep, prime and two-coat paint system" },
  Flooring: { unitRate: 95, unitType: "area", durationDays: 2, code: "NCC 2022", description: "Floor covering supply and install" },
  "Engineered Timber": { unitRate: 130, unitType: "area", durationDays: 2, code: "AS 1684", description: "Engineered timber flooring supply and install" },
  "Solid Hardwood": { unitRate: 180, unitType: "area", durationDays: 3, code: "AS 1684", description: "Solid hardwood flooring supply, install and finish" },
  "Hybrid Flooring": { unitRate: 75, unitType: "area", durationDays: 2, code: "NCC 2022", description: "Hybrid/LVP flooring supply and install" },
  Carpet: { unitRate: 55, unitType: "area", durationDays: 1, code: "NCC 2022", description: "Carpet supply and install including underlay" },
  Glazing: { unitRate: 480, unitType: "area", durationDays: 2, code: "AS 1288", description: "Window and glass supply and install" },
  "Double Glazing": { unitRate: 720, unitType: "area", durationDays: 2, code: "AS 1288", description: "Double glazed window units supply and install" },
  "Shower Screen": { unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS 1288", description: "Shower screen supply and install" },
  Roofing: { unitRate: 120, unitType: "area", durationDays: 3, code: "AS 1562", description: "Roof sheeting, flashing and guttering" },
  Concrete: { unitRate: 180, unitType: "area", durationDays: 2, code: "AS 3600", description: "Concrete works including formwork and reinforcement" },
  Landscaping: { unitRate: 90, unitType: "area", durationDays: 3, code: "NCC 2022", description: "External landscaping and hardscaping works" },
  Cleaning: { unitRate: 400, unitType: "allow", durationDays: 1, code: "NCC 2022", description: "Builder's clean and practical completion" },
  "Detail Clean": { unitRate: 800, unitType: "allow", durationDays: 1, code: "NCC 2022", description: "Full detail clean — handover quality" },
  Scaffolding: { unitRate: 1200, unitType: "allow", durationDays: 1, code: "AS/NZS 1576", description: "Scaffolding erect, hire and dismantle" },
  "Site Works": { unitRate: 65, unitType: "area", durationDays: 2, code: "NCC 2022", description: "Earthworks, levelling and site preparation" },
  General: { unitRate: 180, unitType: "area", durationDays: 3, code: "NCC 2022", description: "General construction works" },
  Services: { unitRate: 1700, unitType: "allow", durationDays: 1, code: "NCC 2022", description: "Combined services rough-in (plumbing + electrical)" },
  Finishes: { unitRate: 900, unitType: "allow", durationDays: 1, code: "AS/NZS 2311", description: "Final finishes, paint and fit-off" },
  Insulation: { unitRate: 30, unitType: "area", durationDays: 1, code: "NCC 2022 Vol 2 Part 3.12", description: "Thermal and acoustic insulation" },
  "Fire Services": { unitRate: 1800, unitType: "allow", durationDays: 1, code: "AS 1670.1", description: "Smoke alarms, fire rating and compliance" },
  HVAC: { unitRate: 2200, unitType: "allow", durationDays: 2, code: "AS/NZS 3823", description: "Heating, ventilation and air conditioning" },
  Decking: { unitRate: 280, unitType: "area", durationDays: 3, code: "AS 1684", description: "Deck framing, bearers, joists and boards" },
  "Composite Decking": { unitRate: 350, unitType: "area", durationDays: 3, code: "NCC 2022", description: "Composite decking supply and install" },
  Guttering: { unitRate: 45, unitType: "area", durationDays: 1, code: "AS/NZS 3500.3", description: "Gutter and downpipe supply and install" },
  Skirting: { unitRate: 25, unitType: "area", durationDays: 1, code: "NCC 2022", description: "Skirting board supply and install" },
  "Wardrobe Fit-Out": { unitRate: 1800, unitType: "allow", durationDays: 2, code: "NCC 2022", description: "Built-in wardrobe shelving, hanging and doors" },
  Rendering: { unitRate: 65, unitType: "area", durationDays: 2, code: "AS 3700", description: "External render application" },
};

export function getTradeRate(trade: string) {
  return (
    VICTORIAN_TRADE_RATES[trade] ?? {
      unitRate: 150,
      unitType: "area",
      durationDays: 2,
      code: "NCC 2022",
      description: `${trade} works`,
    }
  );
}

export function getAutoPrice(
  trade: string,
  dims: { length: number; width: number; height: number }
) {
  const rate = getTradeRate(trade);
  const area = Math.max(dims.length * dims.width, 1);
  const builderCost = rate.unitType === "area" ? Math.round(area * rate.unitRate) : rate.unitRate;
  return {
    builderCost,
    clientCost: toClient(builderCost),
    durationDays: rate.durationDays,
    code: rate.code,
    description: rate.description,
  };
}