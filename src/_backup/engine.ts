import type { JobStage, Solution, TradeLine } from "../../types/domain";
import { generateId } from "../id";
import { toClient, FIXED_COST_TRADES } from "./constants";
import { ROOM_STAGE_MAP } from "./templates";
import type { StageTemplate } from "./templates/types";
import { ANSWER_STAGE_RULES } from "./answerRules";

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

function getAnswerStages(
  answers: Record<string, string>,
  dims: Dimensions,
  multiplier: number
): { extraStages: (JobStage & { _order: number })[]; costMultiplier: number } {
  const area = Math.max(dims.length * dims.width, 1);
  const extraStages: (JobStage & { _order: number })[] = [];
  let totalMultiplier = 1;

  for (const rule of ANSWER_STAGE_RULES) {
    const userAnswer = answers[rule.questionId];
    if (!userAnswer) continue;

    const matches = Array.isArray(rule.answerMatch)
      ? rule.answerMatch.includes(userAnswer)
      : userAnswer === rule.answerMatch;

    if (!matches) continue;

    if (rule.costMultiplier) {
      totalMultiplier *= rule.costMultiplier;
    }

    for (const template of rule.stages) {
      const isFixed = template.isFixed || FIXED_COST_TRADES.has(template.trade);
      const effectiveMultiplier = isFixed ? 1 : multiplier;
      const rawBuilder =
        template.unitType === "area"
          ? area * template.unitRate * effectiveMultiplier
          : template.unitRate * effectiveMultiplier;
      const builderCost = Math.round(rawBuilder);

      extraStages.push({
        id: generateId(),
        name: template.name,
        description: template.description,
        durationDays: template.durationDays,
        builderCost,
        clientCost: toClient(builderCost),
        trade: template.trade,
        code: template.code,
        isSelected: true,
        _order: template.order,
      });
    }
  }

  return { extraStages, costMultiplier: totalMultiplier };
}

function buildStages(
  roomType: string,
  dims: Dimensions,
  multiplier: number,
  answers?: Record<string, string>
): JobStage[] {
  const area = Math.max(dims.length * dims.width, 1);
  const roomStages = ROOM_STAGE_MAP[roomType] ?? ROOM_STAGE_MAP.general;
  const { extraStages, costMultiplier } = answers
    ? getAnswerStages(answers, dims, multiplier)
    : { extraStages: [] as (JobStage & { _order: number })[], costMultiplier: 1 };

  const finalMultiplier = multiplier * costMultiplier;

  const baseStages = roomStages.map((template: StageTemplate) => {
    const isFixed = template.isFixed || FIXED_COST_TRADES.has(template.trade);
    const rawBuilder =
      template.unitType === "area"
        ? area * template.unitRate * (isFixed ? 1 : finalMultiplier)
        : template.unitRate * (isFixed ? 1 : finalMultiplier);
    const builderCost = Math.round(rawBuilder);

    return {
      id: generateId(),
      name: template.name,
      description: template.description,
      durationDays: template.durationDays,
      builderCost,
      clientCost: toClient(builderCost),
      trade: template.trade,
      code: template.code,
      isSelected: true,
      _order: template.order,
    };
  });

  const allStages = [...baseStages, ...extraStages];
  allStages.sort((a, b) => a._order - b._order);

  return allStages.map(({ _order, ...stage }) => stage);
}

function buildTradeLines(stages: JobStage[]): TradeLine[] {
  const totals = new Map<string, number>();
  for (const stage of stages) {
    if (!stage.isSelected) continue;
    totals.set(stage.trade, (totals.get(stage.trade) ?? 0) + stage.builderCost);
  }

  return Array.from(totals.entries()).map(([trade, builderCost]) => ({
    id: generateId(),
    trade,
    description: `${trade} works`,
    builderCost,
    clientCost: toClient(builderCost),
  }));
}

function buildSolution(
  roomType: string,
  dims: Dimensions,
  title: string,
  multiplier: number,
  answers?: Record<string, string>
): Solution {
  const stages = buildStages(roomType, dims, multiplier, answers);
  const tradeLines = buildTradeLines(stages);
  const builderCost = stages.reduce((sum, item) => sum + item.builderCost, 0);
  const clientCost = stages.reduce((sum, item) => sum + item.clientCost, 0);
  const timelineDays = stages.reduce((sum, item) => sum + item.durationDays, 0);

  return {
    id: generateId(),
    title,
    description: `${title} scope for ${roomType}`,
    builderCost,
    clientCost,
    timelineDays,
    stages,
    tradeLines,
  };
}

export function generateSolutions(
  roomType: string,
  dimensions: Dimensions,
  answers?: Record<string, string>
): Solution[] {
  return [
    buildSolution(roomType, dimensions, "Essential", 0.9, answers),
    buildSolution(roomType, dimensions, "Standard", 1, answers),
    buildSolution(roomType, dimensions, "Premium", 1.2, answers),
  ];
}
