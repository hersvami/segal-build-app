import type { PCItem, InclusionItem, ExclusionItem } from '../../types/domain';
import { generateId } from '../id';

// ─── Common defaults shared across all categories ───

const COMMON_INCLUSIONS: InclusionItem[] = [
  { id: generateId(), text: 'All labour and materials as specified', isDefault: true },
  { id: generateId(), text: 'Site clean and rubbish removal on completion', isDefault: true },
  { id: generateId(), text: 'WorkCover insurance for all workers on site', isDefault: true },
  { id: generateId(), text: '6-year domestic building warranty insurance (where applicable)', isDefault: true },
  { id: generateId(), text: 'All work to comply with BCA/NCC and relevant Australian Standards', isDefault: true },
];

const COMMON_EXCLUSIONS: ExclusionItem[] = [
  { id: generateId(), text: 'Asbestos removal or remediation (if discovered)', isDefault: true },
  { id: generateId(), text: 'Structural engineer fees (unless specified)', isDefault: true },
  { id: generateId(), text: 'Council/building permit application fees', isDefault: true },
  { id: generateId(), text: 'Temporary accommodation during works', isDefault: true },
  { id: generateId(), text: 'Any work not specifically described in this quote', isDefault: true },
  { id: generateId(), text: 'Furniture removal or storage', isDefault: true },
];

// ─── Category-specific PC items ───

const CATEGORY_PC_ITEMS: Record<string, Omit<PCItem, 'id'>[]> = {
  bathroom: [
    { description: 'Wall tiles (supply)', allowance: 80, unit: 'm²' },
    { description: 'Floor tiles (supply)', allowance: 65, unit: 'm²' },
    { description: 'Tapware & mixer set', allowance: 800, unit: 'item' },
    { description: 'Vanity unit with basin', allowance: 1200, unit: 'item' },
    { description: 'Toilet suite', allowance: 600, unit: 'item' },
    { description: 'Shower screen', allowance: 900, unit: 'item' },
    { description: 'Mirror / shaving cabinet', allowance: 400, unit: 'item' },
    { description: 'Towel rails & accessories', allowance: 300, unit: 'item' },
  ],
  laundry: [
    { description: 'Laundry tub', allowance: 450, unit: 'item' },
    { description: 'Tapware', allowance: 350, unit: 'item' },
    { description: 'Floor tiles (supply)', allowance: 65, unit: 'm²' },
    { description: 'Splashback tiles (supply)', allowance: 60, unit: 'm²' },
    { description: 'Benchtop', allowance: 400, unit: 'lm' },
  ],
  toilet: [
    { description: 'Toilet suite', allowance: 600, unit: 'item' },
    { description: 'Floor tiles (supply)', allowance: 65, unit: 'm²' },
    { description: 'Toilet roll holder & accessories', allowance: 100, unit: 'item' },
  ],
  kitchen: [
    { description: 'Benchtop (stone/laminate)', allowance: 450, unit: 'lm' },
    { description: 'Cabinetry (supply)', allowance: 12000, unit: 'allow' },
    { description: 'Splashback tiles (supply)', allowance: 75, unit: 'm²' },
    { description: 'Sink & mixer tap', allowance: 800, unit: 'item' },
    { description: 'Cooktop', allowance: 1200, unit: 'item' },
    { description: 'Oven', allowance: 1500, unit: 'item' },
    { description: 'Rangehood', allowance: 800, unit: 'item' },
    { description: 'Dishwasher', allowance: 900, unit: 'item' },
    { description: 'Handles & hardware', allowance: 300, unit: 'allow' },
  ],
  flooring: [
    { description: 'Floor covering (supply)', allowance: 85, unit: 'm²' },
    { description: 'Underlay (if required)', allowance: 15, unit: 'm²' },
    { description: 'Transition strips', allowance: 25, unit: 'lm' },
  ],
  painting: [
    { description: 'Paint (premium grade)', allowance: 15, unit: 'm²' },
  ],
  windowsDoors: [
    { description: 'Windows (supply)', allowance: 800, unit: 'item' },
    { description: 'External doors (supply)', allowance: 1200, unit: 'item' },
    { description: 'Internal doors (supply)', allowance: 450, unit: 'item' },
    { description: 'Door hardware (handles, locks)', allowance: 150, unit: 'item' },
  ],
  ceilings: [
    { description: 'Cornices (supply)', allowance: 18, unit: 'lm' },
    { description: 'Ceiling roses (if required)', allowance: 80, unit: 'item' },
  ],
  extensions: [
    { description: 'Windows (supply)', allowance: 800, unit: 'item' },
    { description: 'External doors (supply)', allowance: 1500, unit: 'item' },
    { description: 'Floor coverings (supply)', allowance: 85, unit: 'm²' },
    { description: 'Light fittings', allowance: 200, unit: 'item' },
    { description: 'Tapware (if wet area)', allowance: 800, unit: 'allow' },
  ],
  secondStorey: [
    { description: 'Staircase (supply & install)', allowance: 8000, unit: 'item' },
    { description: 'Balustrade (supply)', allowance: 350, unit: 'lm' },
    { description: 'Windows (supply)', allowance: 800, unit: 'item' },
    { description: 'External cladding (supply)', allowance: 95, unit: 'm²' },
  ],
  newHomeBuild: [
    { description: 'Kitchen cabinetry package', allowance: 15000, unit: 'allow' },
    { description: 'Bathroom fixtures package (per bathroom)', allowance: 3500, unit: 'allow' },
    { description: 'Floor coverings (all areas)', allowance: 85, unit: 'm²' },
    { description: 'Light fittings (all)', allowance: 5000, unit: 'allow' },
    { description: 'Window furnishings', allowance: 4000, unit: 'allow' },
    { description: 'Driveway & paths', allowance: 8000, unit: 'allow' },
    { description: 'Landscaping', allowance: 5000, unit: 'allow' },
  ],
  multiUnit: [
    { description: 'Kitchen package (per unit)', allowance: 12000, unit: 'allow' },
    { description: 'Bathroom package (per unit)', allowance: 3000, unit: 'allow' },
    { description: 'Floor coverings (per unit)', allowance: 4000, unit: 'allow' },
    { description: 'Common area finishes', allowance: 8000, unit: 'allow' },
  ],
  grannyFlat: [
    { description: 'Kitchenette/kitchen package', allowance: 8000, unit: 'allow' },
    { description: 'Bathroom fixtures package', allowance: 3500, unit: 'allow' },
    { description: 'Floor coverings', allowance: 85, unit: 'm²' },
    { description: 'Light fittings', allowance: 1500, unit: 'allow' },
    { description: 'Split system AC', allowance: 2500, unit: 'item' },
  ],
  decking: [
    { description: 'Decking boards (supply)', allowance: 120, unit: 'm²' },
    { description: 'Balustrade (supply)', allowance: 280, unit: 'lm' },
    { description: 'Stainless steel screws & fixings', allowance: 15, unit: 'm²' },
  ],
  pergola: [
    { description: 'Roofing sheets (supply)', allowance: 65, unit: 'm²' },
    { description: 'Posts and beams (supply)', allowance: 250, unit: 'item' },
    { description: 'Outdoor fan', allowance: 400, unit: 'item' },
  ],
  paving: [
    { description: 'Pavers (supply)', allowance: 55, unit: 'm²' },
    { description: 'Bedding sand & road base', allowance: 20, unit: 'm²' },
    { description: 'Edge restraints', allowance: 18, unit: 'lm' },
  ],
  concreting: [
    { description: 'Concrete (supply, 32MPa)', allowance: 250, unit: 'm³' },
    { description: 'Steel reinforcement mesh', allowance: 18, unit: 'm²' },
  ],
  fencing: [
    { description: 'Fence panels/sheets (supply)', allowance: 85, unit: 'lm' },
    { description: 'Gate (supply)', allowance: 600, unit: 'item' },
    { description: 'Posts (supply)', allowance: 35, unit: 'item' },
  ],
  roofing: [
    { description: 'Roof sheets/tiles (supply)', allowance: 45, unit: 'm²' },
    { description: 'Ridge capping', allowance: 35, unit: 'lm' },
    { description: 'Roof ventilation (whirlybird)', allowance: 250, unit: 'item' },
  ],
  pools: [
    { description: 'Pool equipment (pump, filter, chlorinator)', allowance: 5000, unit: 'allow' },
    { description: 'Pool interior finish', allowance: 12000, unit: 'allow' },
    { description: 'Pool fencing (supply)', allowance: 250, unit: 'lm' },
    { description: 'Coping stones (supply)', allowance: 120, unit: 'lm' },
  ],
  cladding: [
    { description: 'Cladding boards (supply)', allowance: 85, unit: 'm²' },
    { description: 'Corner trims and flashings', allowance: 25, unit: 'lm' },
    { description: 'Sarking / building wrap', allowance: 8, unit: 'm²' },
  ],
  rendering: [
    { description: 'Render product (supply)', allowance: 25, unit: 'm²' },
    { description: 'Texture coat finish', allowance: 18, unit: 'm²' },
  ],
  cabinetry: [
    { description: 'Cabinetry (supply)', allowance: 5000, unit: 'allow' },
    { description: 'Handles & hardware', allowance: 200, unit: 'allow' },
    { description: 'Benchtop (if applicable)', allowance: 350, unit: 'lm' },
  ],
  electrical: [
    { description: 'Light fittings (supply)', allowance: 200, unit: 'item' },
    { description: 'Power points', allowance: 80, unit: 'item' },
    { description: 'Switchboard (if upgrade)', allowance: 2500, unit: 'item' },
  ],
  plumbing: [
    { description: 'Hot water unit (supply)', allowance: 2200, unit: 'item' },
    { description: 'Tapware & mixers', allowance: 400, unit: 'item' },
  ],
  hvac: [
    { description: 'Split system unit (supply)', allowance: 2500, unit: 'item' },
    { description: 'Ducted system (supply)', allowance: 12000, unit: 'allow' },
  ],
  smartHome: [
    { description: 'Smart hub/controller', allowance: 1500, unit: 'item' },
    { description: 'Smart switches (supply)', allowance: 120, unit: 'item' },
    { description: 'CCTV cameras (supply)', allowance: 350, unit: 'item' },
    { description: 'Video intercom (supply)', allowance: 1200, unit: 'item' },
  ],
};

// ─── Category-specific inclusions ───

const CATEGORY_INCLUSIONS: Record<string, string[]> = {
  bathroom: [
    'Waterproofing to AS3740 with certificate',
    'All tiling labour including preparation',
    'Plumbing rough-in and fit-off',
    'Electrical rough-in and fit-off',
    'All demolition and removal of existing',
  ],
  laundry: [
    'Waterproofing to wet area standards',
    'Tiling labour including preparation',
    'Plumbing connections for appliances',
    'All demolition and removal of existing',
  ],
  toilet: [
    'Toilet installation and connection',
    'Floor tiling labour',
    'All demolition and removal of existing',
  ],
  kitchen: [
    'All demolition and removal of existing kitchen',
    'Plumbing rough-in and fit-off (sink, dishwasher, gas)',
    'Electrical rough-in and fit-off (oven, rangehood, lighting)',
    'Splashback tiling labour',
    'Cabinetry installation',
    'Benchtop templating and installation',
  ],
  flooring: [
    'Floor preparation and levelling (up to 10mm)',
    'Removal of existing floor coverings',
    'Installation of new floor coverings as specified',
    'Scotia/beading or skirting refit',
  ],
  painting: [
    'Surface preparation (fill, sand, prime)',
    'Two coats of premium paint to all specified areas',
    'Protection of floors and furnishings',
    'Colour consultation (up to 3 colours)',
  ],
  extensions: [
    'All structural steelwork as per engineer design',
    'Council/building permit application management',
    'Connection to existing structure',
    'Temporary weather protection during works',
    'All trades as specified in scope',
  ],
  secondStorey: [
    'Full structural engineering design',
    'Temporary roof removal and weather protection',
    'Staircase supply and installation',
    'All external cladding and finishing',
    'Connection of all services to upper level',
  ],
  newHomeBuild: [
    'Complete construction from slab to handover',
    'All council and building permits',
    'Site establishment and temporary fencing',
    'All trades as per specification',
    'Final clean and handover',
    'Builders warranty insurance certificate',
  ],
  multiUnit: [
    'Complete construction of all units',
    'All council permits and compliance',
    'Common area finishes',
    'Individual unit fit-outs as specified',
    'Separate metering for each unit',
  ],
  grannyFlat: [
    'Complete construction from slab to handover',
    'All council permits (CDC or DA)',
    'Connection to existing services (sewer, water, power)',
    'Separate metering',
    'Final clean and handover',
  ],
  decking: [
    'All structural framing (bearers, joists)',
    'Decking board installation with stainless fixings',
    'Balustrade if required by code',
    'Oiling/sealing of timber on completion',
  ],
  concreting: [
    'Excavation to required depth',
    'Formwork and steel reinforcement',
    'Concrete supply and placement',
    'Finishing as specified (broom, exposed, polished)',
    'Control joints as required',
  ],
  roofing: [
    'Removal of existing roof covering (if re-roof)',
    'Supply and install new roof covering',
    'All flashings, ridge capping, and valleys',
    'Roof safety equipment during works',
  ],
  structural: [
    'Structural engineering design and certification',
    'Temporary propping during works',
    'All steel/timber as per engineer specification',
    'Building surveyor inspections',
  ],
  waterproofing: [
    'Surface preparation and priming',
    'Waterproof membrane application (2 coats min)',
    'Bond breakers at all junctions',
    'Flood test (48 hours) with certificate',
  ],
  pools: [
    'Excavation and spoil removal',
    'Pool shell construction',
    'All plumbing and filtration',
    'Pool safety fencing to AS1926',
    'Council inspection and compliance',
  ],
};

// ─── Category-specific exclusions ───

const CATEGORY_EXCLUSIONS: Record<string, string[]> = {
  bathroom: [
    'Floor levelling beyond 10mm variation',
    'Relocation of existing plumbing stack',
    'Window replacement or enlargement',
    'Underfloor heating (unless specified)',
  ],
  kitchen: [
    'Appliance supply (unless specified as PC)',
    'Structural wall removal (quoted separately)',
    'Gas main upgrade or extension',
    'Floor covering beyond kitchen area',
  ],
  flooring: [
    'Floor levelling beyond 10mm variation',
    'Subfloor structural repairs',
    'Asbestos underlay removal',
    'Skirting board replacement (unless specified)',
  ],
  extensions: [
    'Demolition of existing structures (unless specified)',
    'Landscaping restoration',
    'Driveway or crossover modifications',
    'Termite treatment (unless specified)',
    'Connection to existing HVAC system',
  ],
  newHomeBuild: [
    'Land costs and stamp duty',
    'Soil testing and survey (unless specified)',
    'Landscaping beyond basic turf and garden beds',
    'Driveway and crossover beyond basic concrete',
    'Window furnishings and blinds',
    'Fencing (unless specified)',
  ],
  concreting: [
    'Rock excavation or removal',
    'Stormwater drainage modifications',
    'Service relocations (gas, water, sewer)',
    'Retaining walls (unless specified)',
  ],
  roofing: [
    'Structural repairs to roof framing',
    'Ceiling replacement or repairs',
    'Gutter and fascia replacement (unless specified)',
    'Solar panel removal and reinstatement',
  ],
  structural: [
    'Council or building permit fees',
    'Engineer engagement fees',
    'Temporary relocation costs',
    'Making good of finishes (plaster, paint, tile)',
  ],
  pools: [
    'Landscape design fees',
    'Retaining walls around pool area',
    'Pool heating system (unless specified)',
    'Automated pool cover',
  ],
};

// ─── Public API ───

export function getDefaultPCItems(categoryId: string): PCItem[] {
  const items = CATEGORY_PC_ITEMS[categoryId] || [];
  return items.map(item => ({
    ...item,
    id: generateId(),
  }));
}

export function getDefaultInclusions(categoryId: string): InclusionItem[] {
  const categoryItems = CATEGORY_INCLUSIONS[categoryId] || [];
  const combined = [
    ...categoryItems.map(text => ({ id: generateId(), text, isDefault: true })),
    ...COMMON_INCLUSIONS.map(item => ({ ...item, id: generateId() })),
  ];
  return combined;
}

export function getDefaultExclusions(categoryId: string): ExclusionItem[] {
  const categoryItems = CATEGORY_EXCLUSIONS[categoryId] || [];
  const combined = [
    ...categoryItems.map(text => ({ id: generateId(), text, isDefault: true })),
    ...COMMON_EXCLUSIONS.map(item => ({ ...item, id: generateId() })),
  ];
  return combined;
}
