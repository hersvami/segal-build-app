export { generateSolutions, generateSolutionsFromScope } from "./engine";
export {
  OVERHEAD,
  MARGIN,
  toClient,
  FIXED_COST_TRADES,
  VICTORIAN_TRADE_RATES,
  getTradeRate,
  getAutoPrice,
} from "./constants";
export { ROOM_STAGE_MAP } from "./templates";
export type { StageTemplate } from "./templates/types";
export { ANSWER_STAGE_RULES } from "./answerRules";
export type { AnswerStageRule } from "./answerRules";
export {
  WORK_CATEGORIES,
  recogniseScopeFromText,
  recogniseScopeWithAI,
} from "./scopeRecogniser";
export type {
  WorkCategory,
  ScopeQuestion,
  RecognisedScope,
} from "./scopeRecogniser";
export {
  calculateStage,
  calculateScope,
  calculateQuote,
  generateQuotePricing,
  applyPricingToVariation,
  suggestContingency,
  formatCurrency,
  formatCompact,
} from "./quoteCalculator";
export type {
  StageCalculation,
  ScopeCalculation,
  QuoteCalculation,
} from "./quoteCalculator";
export {
  ALL_CATEGORIES,
  CATEGORY_MAP,
  getCategoryById,
  searchCategories,
  CATEGORY_GROUPS,
} from "./categories";
export {
  getRelatedCategories,
  getAutoAddCategories,
  getSuggestedCategories,
  buildFullScopeChain,
} from "./categoryRelations";
export type { CategoryRelation } from "./categoryRelations";
export {
  getDefaultPCItems,
  getDefaultInclusions,
  getDefaultExclusions,
} from "./quoteDefaults";
