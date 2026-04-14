// Cross-category relationship map for intelligent scope suggestions

export interface CategoryRelation {
  categoryId: string;
  reason: string;
  priority: 'auto' | 'suggested';
}

const RELATIONS: Record<string, CategoryRelation[]> = {
  bathroom: [
    { categoryId: 'waterproofing', reason: 'Bathroom requires waterproofing to AS3740', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Hot water, drainage, mixer installation', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Lighting, exhaust fan, heated towel rail', priority: 'auto' },
    { categoryId: 'demolition', reason: 'Strip-out existing bathroom', priority: 'suggested' },
    { categoryId: 'cabinetry', reason: 'Custom vanity, mirror cabinet, shelving', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'Floor transition at doorway', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Ceiling and non-tiled wall areas', priority: 'suggested' },
    { categoryId: 'accessibility', reason: 'Grab rails, hobless shower, NDIS modifications', priority: 'suggested' },
  ],
  laundry: [
    { categoryId: 'waterproofing', reason: 'Laundry requires waterproofing to wet area standards', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Washing machine, tub, hot/cold connections', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Power points, lighting, dryer circuit', priority: 'auto' },
    { categoryId: 'cabinetry', reason: 'Laundry cabinets, benchtop, shelving', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'Water-resistant flooring', priority: 'suggested' },
  ],
  toilet: [
    { categoryId: 'plumbing', reason: 'Toilet cistern, water supply, drainage', priority: 'auto' },
    { categoryId: 'waterproofing', reason: 'Floor waterproofing if required', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'Exhaust fan, lighting', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Wall and ceiling painting', priority: 'suggested' },
  ],
  kitchen: [
    { categoryId: 'plumbing', reason: 'Sink, dishwasher, gas connection', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Rangehood, oven circuit, lighting, power points', priority: 'auto' },
    { categoryId: 'cabinetry', reason: 'Kitchen cabinetry, benchtop, pantry', priority: 'auto' },
    { categoryId: 'demolition', reason: 'Strip-out existing kitchen', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'Kitchen flooring replacement', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Walls and ceiling painting', priority: 'suggested' },
    { categoryId: 'waterproofing', reason: 'Splashback waterproofing behind sink', priority: 'suggested' },
  ],
  flooring: [
    { categoryId: 'demolition', reason: 'Remove existing floor coverings', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Skirting boards and door frames', priority: 'suggested' },
  ],
  painting: [
    { categoryId: 'ceilings', reason: 'Ceiling repairs before painting', priority: 'suggested' },
    { categoryId: 'rendering', reason: 'External render repairs before painting', priority: 'suggested' },
  ],
  windowsDoors: [
    { categoryId: 'structural', reason: 'Lintel installation for new openings', priority: 'suggested' },
    { categoryId: 'rendering', reason: 'External patching around new windows', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Paint new frames and trims', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'Relocate switches or wiring', priority: 'suggested' },
  ],
  brickwork: [
    { categoryId: 'rendering', reason: 'Render finish over new brickwork', priority: 'suggested' },
    { categoryId: 'structural', reason: 'Structural support if load-bearing', priority: 'suggested' },
    { categoryId: 'waterproofing', reason: 'Damp course and moisture barriers', priority: 'suggested' },
  ],
  cabinetry: [
    { categoryId: 'painting', reason: 'Paint or finish surrounding walls', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'LED lighting, power for built-ins', priority: 'suggested' },
  ],
  ceilings: [
    { categoryId: 'painting', reason: 'Paint new or repaired ceilings', priority: 'auto' },
    { categoryId: 'insulation', reason: 'Ceiling insulation access while open', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'Relocate or install downlights', priority: 'suggested' },
  ],
  internalWalls: [
    { categoryId: 'structural', reason: 'Check if load-bearing before removal', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Relocate switches, wiring in walls', priority: 'auto' },
    { categoryId: 'painting', reason: 'Paint new plasterboard walls', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Acoustic or thermal insulation in walls', priority: 'suggested' },
  ],
  demolition: [
    { categoryId: 'structural', reason: 'Engineer assessment for load-bearing elements', priority: 'suggested' },
  ],
  structural: [
    { categoryId: 'steelFraming', reason: 'Steel beams for wall removal support', priority: 'auto' },
    { categoryId: 'concreting', reason: 'New footings or pad footings for posts', priority: 'suggested' },
    { categoryId: 'demolition', reason: 'Remove existing structure', priority: 'suggested' },
  ],
  underpinning: [
    { categoryId: 'concreting', reason: 'Concrete underpinning pours', priority: 'auto' },
    { categoryId: 'structural', reason: 'Structural engineering supervision', priority: 'auto' },
  ],
  retainingWalls: [
    { categoryId: 'concreting', reason: 'Concrete footings and core filling', priority: 'auto' },
    { categoryId: 'waterproofing', reason: 'Waterproof membrane behind retaining wall', priority: 'auto' },
    { categoryId: 'landscaping', reason: 'Backfill, drainage, and garden restoration', priority: 'suggested' },
  ],
  steelFraming: [
    { categoryId: 'concreting', reason: 'Concrete footings for steel posts', priority: 'auto' },
    { categoryId: 'structural', reason: 'Engineering certification', priority: 'auto' },
  ],
  extensions: [
    { categoryId: 'structural', reason: 'Structural design and engineering', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Power, lighting, switchboard upgrade', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Extend services to new area', priority: 'auto' },
    { categoryId: 'concreting', reason: 'Slab or footings for extension', priority: 'auto' },
    { categoryId: 'roofing', reason: 'Roof tie-in and new roofing', priority: 'suggested' },
    { categoryId: 'cladding', reason: 'External cladding for new walls', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Wall and ceiling insulation', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Internal and external painting', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'Flooring for new rooms', priority: 'suggested' },
    { categoryId: 'hvac', reason: 'Extend heating/cooling to new area', priority: 'suggested' },
  ],
  secondStorey: [
    { categoryId: 'structural', reason: 'Major structural engineering required', priority: 'auto' },
    { categoryId: 'steelFraming', reason: 'Steel beams and columns', priority: 'auto' },
    { categoryId: 'roofing', reason: 'Complete new roof structure', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Full electrical for upper level', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Plumbing risers if wet areas upstairs', priority: 'auto' },
    { categoryId: 'concreting', reason: 'Strengthened footings', priority: 'auto' },
    { categoryId: 'cladding', reason: 'External cladding all new walls', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Full insulation package', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Internal and external painting', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'Upper level flooring', priority: 'suggested' },
    { categoryId: 'hvac', reason: 'Heating/cooling for upper level', priority: 'suggested' },
    { categoryId: 'windowsDoors', reason: 'New windows and doors', priority: 'suggested' },
  ],
  newHomeBuild: [
    { categoryId: 'concreting', reason: 'Slab and footings', priority: 'auto' },
    { categoryId: 'structural', reason: 'Full structural engineering', priority: 'auto' },
    { categoryId: 'steelFraming', reason: 'Structural steel and framing', priority: 'auto' },
    { categoryId: 'roofing', reason: 'Complete roof system', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Full electrical installation', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Full plumbing and drainage', priority: 'auto' },
    { categoryId: 'cladding', reason: 'External wall cladding', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Full insulation package', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Full internal and external painting', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'All floor coverings', priority: 'suggested' },
    { categoryId: 'hvac', reason: 'Heating and cooling system', priority: 'suggested' },
    { categoryId: 'windowsDoors', reason: 'All windows and external doors', priority: 'suggested' },
    { categoryId: 'cabinetry', reason: 'Built-in robes and storage', priority: 'suggested' },
    { categoryId: 'landscaping', reason: 'Driveway, paths, garden', priority: 'suggested' },
    { categoryId: 'fencing', reason: 'Boundary and pool fencing', priority: 'suggested' },
  ],
  multiUnit: [
    { categoryId: 'concreting', reason: 'Slabs, footings, driveways', priority: 'auto' },
    { categoryId: 'structural', reason: 'Structural engineering for all units', priority: 'auto' },
    { categoryId: 'steelFraming', reason: 'Steel and timber framing', priority: 'auto' },
    { categoryId: 'roofing', reason: 'Roofing for all units', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Electrical for all units + common areas', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Plumbing for all units + mains connections', priority: 'auto' },
    { categoryId: 'cladding', reason: 'External cladding all units', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Thermal and acoustic insulation', priority: 'suggested' },
    { categoryId: 'fencing', reason: 'Boundary, dividing, and pool fencing', priority: 'suggested' },
    { categoryId: 'landscaping', reason: 'Common areas, driveways, paths', priority: 'suggested' },
    { categoryId: 'fireSafety', reason: 'Fire separation walls, smoke alarms, compliance', priority: 'suggested' },
    { categoryId: 'acoustic', reason: 'Party wall acoustic treatment', priority: 'suggested' },
  ],
  grannyFlat: [
    { categoryId: 'concreting', reason: 'Slab and footings', priority: 'auto' },
    { categoryId: 'structural', reason: 'Structural design', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Separate meter and full electrical', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Full plumbing and sewer connection', priority: 'auto' },
    { categoryId: 'roofing', reason: 'Complete roof', priority: 'auto' },
    { categoryId: 'cladding', reason: 'External wall cladding', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Full insulation', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Internal and external painting', priority: 'suggested' },
    { categoryId: 'flooring', reason: 'Floor coverings', priority: 'suggested' },
    { categoryId: 'hvac', reason: 'Heating/cooling system', priority: 'suggested' },
    { categoryId: 'kitchen', reason: 'Kitchenette or full kitchen', priority: 'suggested' },
    { categoryId: 'bathroom', reason: 'Bathroom fit-out', priority: 'suggested' },
  ],
  decking: [
    { categoryId: 'concreting', reason: 'Concrete footings for deck posts', priority: 'auto' },
    { categoryId: 'steelFraming', reason: 'Steel posts and bearers if elevated', priority: 'suggested' },
    { categoryId: 'fencing', reason: 'Balustrade and handrails', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'Deck lighting and power points', priority: 'suggested' },
    { categoryId: 'pergola', reason: 'Pergola or shade structure over deck', priority: 'suggested' },
  ],
  pergola: [
    { categoryId: 'concreting', reason: 'Concrete footings for posts', priority: 'auto' },
    { categoryId: 'steelFraming', reason: 'Steel posts and beams', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'Lighting, fans, power points', priority: 'suggested' },
    { categoryId: 'decking', reason: 'Decking under pergola', priority: 'suggested' },
  ],
  paving: [
    { categoryId: 'concreting', reason: 'Concrete base or edge restraints', priority: 'auto' },
    { categoryId: 'landscaping', reason: 'Garden bed edges and drainage', priority: 'suggested' },
    { categoryId: 'demolition', reason: 'Remove existing paving or concrete', priority: 'suggested' },
  ],
  concreting: [
    { categoryId: 'demolition', reason: 'Remove existing concrete', priority: 'suggested' },
    { categoryId: 'steelFraming', reason: 'Reinforcement steel and mesh', priority: 'suggested' },
  ],
  fencing: [
    { categoryId: 'concreting', reason: 'Concrete post footings', priority: 'auto' },
    { categoryId: 'demolition', reason: 'Remove existing fencing', priority: 'suggested' },
    { categoryId: 'landscaping', reason: 'Garden restoration along fence line', priority: 'suggested' },
  ],
  landscaping: [
    { categoryId: 'concreting', reason: 'Paths, edging, garden walls', priority: 'suggested' },
    { categoryId: 'fencing', reason: 'Garden fencing', priority: 'suggested' },
    { categoryId: 'retainingWalls', reason: 'Retaining walls for level changes', priority: 'suggested' },
    { categoryId: 'paving', reason: 'Paved areas and paths', priority: 'suggested' },
  ],
  pools: [
    { categoryId: 'concreting', reason: 'Pool shell and surrounds', priority: 'auto' },
    { categoryId: 'fencing', reason: 'Pool fencing compliance AS1926', priority: 'auto' },
    { categoryId: 'electrical', reason: 'Pool pump, lighting, safety switch', priority: 'auto' },
    { categoryId: 'plumbing', reason: 'Pool plumbing and filtration', priority: 'auto' },
    { categoryId: 'landscaping', reason: 'Pool surrounds and garden', priority: 'suggested' },
    { categoryId: 'paving', reason: 'Pool deck paving', priority: 'suggested' },
    { categoryId: 'waterproofing', reason: 'Pool waterproofing membrane', priority: 'suggested' },
  ],
  roofing: [
    { categoryId: 'guttersFascia', reason: 'Gutters, fascia, and downpipes', priority: 'auto' },
    { categoryId: 'insulation', reason: 'Roof insulation while exposed', priority: 'suggested' },
    { categoryId: 'electrical', reason: 'Solar prep, antenna, whirlybirds', priority: 'suggested' },
    { categoryId: 'ceilings', reason: 'Ceiling repairs from inside', priority: 'suggested' },
  ],
  roofRepairs: [
    { categoryId: 'guttersFascia', reason: 'Gutter and fascia repairs', priority: 'suggested' },
    { categoryId: 'ceilings', reason: 'Interior ceiling damage repair', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Repaint affected areas', priority: 'suggested' },
  ],
  guttersFascia: [
    { categoryId: 'roofing', reason: 'Roof repairs while accessing gutters', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Paint new fascia boards', priority: 'suggested' },
  ],
  electrical: [
    { categoryId: 'ceilings', reason: 'Ceiling access for wiring', priority: 'suggested' },
    { categoryId: 'painting', reason: 'Patch and paint after electrical work', priority: 'suggested' },
  ],
  plumbing: [
    { categoryId: 'concreting', reason: 'Concrete cutting for under-slab plumbing', priority: 'suggested' },
    { categoryId: 'waterproofing', reason: 'Re-waterproof after plumbing changes', priority: 'suggested' },
  ],
  hvac: [
    { categoryId: 'electrical', reason: 'Dedicated circuits for AC units', priority: 'auto' },
    { categoryId: 'ceilings', reason: 'Ceiling access for ducted systems', priority: 'suggested' },
    { categoryId: 'insulation', reason: 'Duct insulation', priority: 'suggested' },
  ],
  waterproofing: [
    { categoryId: 'plumbing', reason: 'Plumbing penetration sealing', priority: 'suggested' },
  ],
  insulation: [
    { categoryId: 'ceilings', reason: 'Ceiling access for installation', priority: 'suggested' },
  ],
  fireSafety: [
    { categoryId: 'electrical', reason: 'Hardwired smoke alarms, emergency lighting', priority: 'auto' },
  ],
  accessibility: [
    { categoryId: 'bathroom', reason: 'Accessible bathroom modifications', priority: 'suggested' },
    { categoryId: 'concreting', reason: 'Ramp construction', priority: 'suggested' },
  ],
  heritage: [
    { categoryId: 'painting', reason: 'Heritage colour scheme restoration', priority: 'suggested' },
    { categoryId: 'rendering', reason: 'Lime render restoration', priority: 'suggested' },
    { categoryId: 'brickwork', reason: 'Tuckpointing and brick repair', priority: 'suggested' },
  ],
  rendering: [
    { categoryId: 'painting', reason: 'Paint over new render', priority: 'auto' },
    { categoryId: 'waterproofing', reason: 'Waterproof coating on render', priority: 'suggested' },
  ],
  cladding: [
    { categoryId: 'insulation', reason: 'Wall insulation behind cladding', priority: 'auto' },
    { categoryId: 'painting', reason: 'Paint new cladding if timber/fibre cement', priority: 'suggested' },
    { categoryId: 'windowsDoors', reason: 'Flash around windows in new cladding', priority: 'suggested' },
    { categoryId: 'structural', reason: 'Wall framing for cladding substrate', priority: 'suggested' },
  ],
  acoustic: [
    { categoryId: 'insulation', reason: 'Acoustic insulation batts', priority: 'auto' },
    { categoryId: 'ceilings', reason: 'Acoustic ceiling treatments', priority: 'suggested' },
    { categoryId: 'internalWalls', reason: 'Double stud or resilient mount walls', priority: 'suggested' },
  ],
  smartHome: [
    { categoryId: 'electrical', reason: 'Full electrical for smart systems', priority: 'auto' },
  ],
};

export function getRelatedCategories(categoryId: string): CategoryRelation[] {
  return RELATIONS[categoryId] || [];
}

export function getAutoAddCategories(categoryId: string): CategoryRelation[] {
  return getRelatedCategories(categoryId).filter(r => r.priority === 'auto');
}

export function getSuggestedCategories(categoryId: string): CategoryRelation[] {
  return getRelatedCategories(categoryId).filter(r => r.priority === 'suggested');
}

export function buildFullScopeChain(categoryIds: string[]): string[] {
  const allIds = new Set(categoryIds);
  for (const id of categoryIds) {
    const autoAdd = getAutoAddCategories(id);
    for (const rel of autoAdd) {
      allIds.add(rel.categoryId);
    }
  }
  return Array.from(allIds);
}
