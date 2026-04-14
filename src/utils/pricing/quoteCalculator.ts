/**
 * Quote Calculator
 * 
 * Implements the full Australian construction pricing stack:
 * Trade Cost → + Overheads → = True Cost → + Profit → = Client Price → + Contingency → + GST → = Total
 * 
 * Based on Rawlinsons Australian Construction Handbook methodology.
 */

import type { JobStage, QuoteScope, QuotePricing, Variation } from "../../types/domain";

// ========================================
// Stage-level calculations
// ========================================

export interface StageCalculation {
  stage: JobStage;
  tradeCost: number;
  overheadAmount: number;
  trueCost: number;
  profitAmount: number;
  clientPrice: number;
}

export function calculateStage(
  stage: JobStage,
  overheadPercent: number,
  profitPercent: number,
  tradeMargins?: Record<string, { overheadPercent?: number; profitPercent?: number }>
): StageCalculation {
  const tradeCost = stage.builderCost;
  
  // Check for per-trade overrides
  const tradeOverride = tradeMargins?.[stage.trade];
  const ohPercent = tradeOverride?.overheadPercent ?? overheadPercent;
  const prPercent = tradeOverride?.profitPercent ?? profitPercent;
  
  const overheadAmount = tradeCost * (ohPercent / 100);
  const trueCost = tradeCost + overheadAmount;
  const profitAmount = trueCost * (prPercent / 100);
  const clientPrice = trueCost + profitAmount;
  
  return {
    stage,
    tradeCost,
    overheadAmount,
    trueCost,
    profitAmount,
    clientPrice,
  };
}

// ========================================
// Scope-level calculations
// ========================================

export interface ScopeCalculation {
  scope: QuoteScope;
  stageCalcs: StageCalculation[];
  tradeCost: number;
  overheadAmount: number;
  profitAmount: number;
  clientPrice: number;
  pcItemsTotal: number;
}

export function calculateScope(
  scope: QuoteScope,
  overheadPercent: number,
  profitPercent: number,
  tradeMargins?: Record<string, { overheadPercent?: number; profitPercent?: number }>
): ScopeCalculation {
  const selectedStages = scope.stages.filter(s => s.isSelected);
  
  const stageCalcs = selectedStages.map(stage =>
    calculateStage(stage, overheadPercent, profitPercent, tradeMargins)
  );
  
  const tradeCost = stageCalcs.reduce((sum, sc) => sum + sc.tradeCost, 0);
  const overheadAmount = stageCalcs.reduce((sum, sc) => sum + sc.overheadAmount, 0);
  const profitAmount = stageCalcs.reduce((sum, sc) => sum + sc.profitAmount, 0);
  const clientPrice = stageCalcs.reduce((sum, sc) => sum + sc.clientPrice, 0);
  
  // PC items are pass-through costs (no margin applied — they're at allowance)
  const pcItemsTotal = scope.pcItems.reduce((sum, pc) => sum + pc.allowance, 0);
  
  return {
    scope,
    stageCalcs,
    tradeCost,
    overheadAmount,
    profitAmount,
    clientPrice: clientPrice + pcItemsTotal,
    pcItemsTotal,
  };
}

// ========================================
// Full quote calculation
// ========================================

export interface QuoteCalculation {
  scopeCalcs: ScopeCalculation[];
  totalTradeCost: number;
  totalOverhead: number;
  totalProfit: number;
  totalPCItems: number;
  subtotalExGst: number;
  contingencyAmount: number;
  totalBeforeGst: number;
  gstAmount: number;
  totalIncGst: number;
  // Analysis
  effectiveMarginPercent: number;  // profit as % of client price
  overheadPercent: number;
  profitPercent: number;
  contingencyPercent: number;
}

export function calculateQuote(
  scopes: QuoteScope[],
  overheadPercent: number = 12,
  profitPercent: number = 15,
  contingencyPercent: number = 10,
  gstPercent: number = 10,
  tradeMargins?: Record<string, { overheadPercent?: number; profitPercent?: number }>
): QuoteCalculation {
  const scopeCalcs = scopes.map(scope =>
    calculateScope(scope, overheadPercent, profitPercent, tradeMargins)
  );
  
  const totalTradeCost = scopeCalcs.reduce((sum, sc) => sum + sc.tradeCost, 0);
  const totalOverhead = scopeCalcs.reduce((sum, sc) => sum + sc.overheadAmount, 0);
  const totalProfit = scopeCalcs.reduce((sum, sc) => sum + sc.profitAmount, 0);
  const totalPCItems = scopeCalcs.reduce((sum, sc) => sum + sc.pcItemsTotal, 0);
  
  const subtotalExGst = totalTradeCost + totalOverhead + totalProfit + totalPCItems;
  const contingencyAmount = subtotalExGst * (contingencyPercent / 100);
  const totalBeforeGst = subtotalExGst + contingencyAmount;
  const gstAmount = totalBeforeGst * (gstPercent / 100);
  const totalIncGst = totalBeforeGst + gstAmount;
  
  const effectiveMarginPercent = totalBeforeGst > 0
    ? (totalProfit / totalBeforeGst) * 100
    : 0;
  
  return {
    scopeCalcs,
    totalTradeCost,
    totalOverhead,
    totalProfit,
    totalPCItems,
    subtotalExGst,
    contingencyAmount,
    totalBeforeGst,
    gstAmount,
    totalIncGst,
    effectiveMarginPercent,
    overheadPercent,
    profitPercent,
    contingencyPercent,
  };
}

// ========================================
// Generate QuotePricing from calculation
// ========================================

export function generateQuotePricing(
  calc: QuoteCalculation,
  gstPercent: number = 10,
  tradeMargins?: Record<string, { overheadPercent?: number; profitPercent?: number }>
): QuotePricing {
  return {
    overheadPercent: calc.overheadPercent,
    profitPercent: calc.profitPercent,
    contingencyPercent: calc.contingencyPercent,
    gstPercent,
    tradeMargins,
    totalTradeCost: calc.totalTradeCost,
    totalOverhead: calc.totalOverhead,
    totalProfit: calc.totalProfit,
    subtotalExGst: calc.subtotalExGst,
    contingencyAmount: calc.contingencyAmount,
    totalBeforeGst: calc.totalBeforeGst,
    gstAmount: calc.gstAmount,
    totalIncGst: calc.totalIncGst,
  };
}

// ========================================
// Apply pricing to a Variation (updates clientCost fields)
// ========================================

export function applyPricingToVariation(
  variation: Variation,
  overheadPercent: number = 12,
  profitPercent: number = 15,
  contingencyPercent: number = 10,
  tradeMargins?: Record<string, { overheadPercent?: number; profitPercent?: number }>
): Variation {
  // If variation has scopes (new multi-scope mode)
  if (variation.scopes && variation.scopes.length > 0) {
    const calc = calculateQuote(
      variation.scopes,
      overheadPercent,
      profitPercent,
      contingencyPercent,
      10,
      tradeMargins
    );
    
    // Update each scope's calculated totals
    const updatedScopes = variation.scopes.map((scope, idx) => {
      const scopeCalc = calc.scopeCalcs[idx];
      return {
        ...scope,
        tradeCost: scopeCalc.tradeCost,
        overheadAmount: scopeCalc.overheadAmount,
        profitAmount: scopeCalc.profitAmount,
        clientPrice: scopeCalc.clientPrice,
        // Update each stage's clientCost
        stages: scope.stages.map(stage => {
          const stageCalc = scopeCalc.stageCalcs.find(sc => sc.stage.id === stage.id);
          if (stageCalc) {
            return {
              ...stage,
              clientCost: Math.round(stageCalc.clientPrice * 100) / 100,
            };
          }
          return stage;
        }),
      };
    });
    
    return {
      ...variation,
      scopes: updatedScopes,
      pricing: generateQuotePricing(calc, 10, tradeMargins),
    };
  }
  
  // Legacy mode: single solution with stages
  // Apply overhead + profit to each stage's builderCost → clientCost
  const updatedSolutions = variation.solutions.map(solution => {
    const updatedStages = solution.stages.map(stage => {
      const sc = calculateStage(stage, overheadPercent, profitPercent, tradeMargins);
      return {
        ...stage,
        clientCost: Math.round(sc.clientPrice * 100) / 100,
      };
    });
    
    const builderCost = updatedStages.reduce((sum, s) => sum + s.builderCost, 0);
    const clientCost = updatedStages.reduce((sum, s) => sum + s.clientCost, 0);
    
    return {
      ...solution,
      stages: updatedStages,
      builderCost,
      clientCost,
    };
  });
  
  return {
    ...variation,
    solutions: updatedSolutions,
  };
}

// ========================================
// Suggested contingency by work type
// ========================================

export function suggestContingency(categoryIds: string[]): number {
  // Heritage and structural work = higher contingency
  if (categoryIds.some(id => ["heritage", "structural", "underpinning"].includes(id))) {
    return 15;
  }
  // Renovations = 10%
  if (categoryIds.some(id => [
    "wetAreas", "kitchen", "laundry", "toilet", "flooring",
    "painting", "demolition", "ceilings", "internalWalls"
  ].includes(id))) {
    return 10;
  }
  // Extensions = 10%
  if (categoryIds.some(id => ["extensions", "secondStorey"].includes(id))) {
    return 10;
  }
  // New builds = 5%
  if (categoryIds.some(id => ["newHomeBuild", "multiUnit", "grannyFlat"].includes(id))) {
    return 5;
  }
  // External / outdoor = 7.5%
  if (categoryIds.some(id => [
    "decking", "pergola", "paving", "concreting", "fencing", "landscaping", "pools"
  ].includes(id))) {
    return 7.5;
  }
  // Default
  return 10;
}

// ========================================
// Format currency (Australian)
// ========================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ========================================
// Format as compact number
// ========================================

export function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}
