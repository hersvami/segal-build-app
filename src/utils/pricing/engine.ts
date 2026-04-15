import type { JobStage, Solution } from '../../types/domain';
import { generateId } from '../id';
import { toClient, FIXED_COST_TRADES } from './constants';
import type { StageTemplate } from './categories/types';
import type { RecognisedScope } from './scopeRecogniser';

// Convert a StageTemplate to a JobStage with cost calculation
function templateToStage(t: StageTemplate, area: number, tier: number): JobStage {
  const qty = t.unitType === 'allow' ? 1 : t.unitType === 'item' ? (t.defaultQty || 1) : area;
  const cost = Math.round(t.unitRate * qty * tier);
  return {
    id: generateId(),
    name: t.name,
    trade: t.trade,
    cost,
    duration: t.duration,
    description: t.description || t.name,
    status: 'not-started' as const,
    quantity: qty,
    unit: t.unitType === 'allow' ? 'allow' : t.unitType === 'item' ? 'item' : t.unitType === 'linear' ? 'lm' : 'm²',
    unitRate: Math.round(t.unitRate * tier),
    rateSource: 'rawlinsons' as const,
  };
}

// Generate solutions from a recognised scope (new category-based system)
export function generateSolutionsFromScope(
  scope: RecognisedScope,
  dimensions: { width: number; length: number; height: number },
  answers: Record<string, string>
): Solution[] {
  const area = dimensions.width * dimensions.length;
  const templates = scope.category?.stages || [];

  // Apply question cost effects
  let adjustedTemplates = [...templates];
  if (scope.category?.questions) {
    for (const q of scope.category.questions) {
      const answer = answers[q.id];
      if (answer && q.costEffect) {
        if (q.costEffect.type === 'add-stage' && q.costEffect.condition === answer && q.costEffect.stage) {
          adjustedTemplates.push(q.costEffect.stage);
        }
      }
    }
  }

  const tiers = [
    { name: 'Essential', factor: 0.85, desc: 'Budget-conscious scope' },
    { name: 'Standard', factor: 1.0, desc: 'Industry standard specification' },
    { name: 'Premium', factor: 1.25, desc: 'High-end finishes and materials' },
  ];

  return tiers.map(tier => {
    const stages = adjustedTemplates.map(t => templateToStage(t, area, tier.factor));
    const totalCost = stages.reduce((sum, s) => sum + s.cost, 0);
    const duration = stages.reduce((sum, s) => sum + s.duration, 0);

    return {
      id: generateId(),
      name: tier.name,
      totalCost,
      duration,
      stages,
      description: `${tier.desc} for ${scope.category?.label || 'construction'}`,
    };
  });
}