import React, { useState, useMemo } from "react";
import { Variation, JobStage, QuoteScope } from "../../types/domain";
import { Save, PlusCircle, ChevronDown, ChevronRight, Eye, EyeOff, TrendingUp, DollarSign, Percent, AlertTriangle } from "lucide-react";
import { calculateStage, calculateQuote, formatCurrency, type StageCalculation, type QuoteCalculation } from "../../utils/pricing/quoteCalculator";

interface BuilderViewProps {
  variation: Variation;
  onUpdateVariation: (updated: Variation) => void;
}

export const BuilderView: React.FC<BuilderViewProps> = ({ variation, onUpdateVariation }) => {
  const [description, setDescription] = useState(variation.description || "");
  const [elaboratedDescription, setElaboratedDescription] = useState(variation.elaboratedDescription || "");
  const [newLogText, setNewLogText] = useState("");
  const [showCostBreakdown, setShowCostBreakdown] = useState(true);
  const [expandedScopes, setExpandedScopes] = useState<Record<string, boolean>>({});

  // Pricing controls
  const pricing = variation.pricing || {
    overheadPercent: 12,
    profitPercent: 15,
    contingencyPercent: 10,
    gstPercent: 10,
  };
  const [overheadPercent, setOverheadPercent] = useState(pricing.overheadPercent || 12);
  const [profitPercent, setProfitPercent] = useState(pricing.profitPercent || 15);
  const [contingencyPercent, setContingencyPercent] = useState(pricing.contingencyPercent || 10);

  // Build stages from either scopes (new) or solutions (legacy)
  const allStages: JobStage[] = useMemo(() => {
    if (variation.scopes && variation.scopes.length > 0) {
      return variation.scopes.flatMap(s => s.stages);
    }
    const sol = variation.solutions[variation.selectedSolution] || variation.solutions[0];
    return sol?.stages || [];
  }, [variation]);

  // Calculate full pricing
  const quoteCalc: QuoteCalculation | null = useMemo(() => {
    if (variation.scopes && variation.scopes.length > 0) {
      return calculateQuote(variation.scopes, overheadPercent, profitPercent, contingencyPercent);
    }
    // Legacy: wrap stages in a single scope for calculation
    if (allStages.length > 0) {
      const legacyScope: QuoteScope = {
        id: "legacy",
        categoryId: variation.roomType || "general",
        label: variation.title,
        dimensions: variation.dimensions || { length: 0, width: 0, height: 0 },
        answers: [],
        stages: allStages,
        pcItems: [],
        inclusions: [],
        exclusions: [],
        tradeCost: 0,
        overheadAmount: 0,
        profitAmount: 0,
        clientPrice: 0,
      };
      return calculateQuote([legacyScope], overheadPercent, profitPercent, contingencyPercent);
    }
    return null;
  }, [variation, allStages, overheadPercent, profitPercent, contingencyPercent]);

  // Stage calculations for detail view
  const stageCalcs: StageCalculation[] = useMemo(() => {
    return allStages.map(stage => calculateStage(stage, overheadPercent, profitPercent));
  }, [allStages, overheadPercent, profitPercent]);

  const handleSaveScope = () => {
    onUpdateVariation({
      ...variation,
      description,
      elaboratedDescription,
      pricing: {
        ...variation.pricing,
        overheadPercent,
        profitPercent,
        contingencyPercent,
        gstPercent: 10,
        totalTradeCost: quoteCalc?.totalTradeCost || 0,
        totalOverhead: quoteCalc?.totalOverhead || 0,
        totalProfit: quoteCalc?.totalProfit || 0,
        subtotalExGst: quoteCalc?.subtotalExGst || 0,
        contingencyAmount: quoteCalc?.contingencyAmount || 0,
        totalBeforeGst: quoteCalc?.totalBeforeGst || 0,
        gstAmount: quoteCalc?.gstAmount || 0,
        totalIncGst: quoteCalc?.totalIncGst || 0,
      },
      changeLog: [
        ...(variation.changeLog || []),
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          actor: "builder" as const,
          actorName: "Builder Admin",
          action: "Updated pricing: OH " + overheadPercent + "%, Profit " + profitPercent + "%, Contingency " + contingencyPercent + "%",
        }
      ]
    });
  };

  const handleAddLog = () => {
    if (!newLogText.trim()) return;
    const newLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: "builder" as const,
      actorName: "Builder Admin",
      action: newLogText,
      detail: "Manual internal builder note/log"
    };
    onUpdateVariation({
      ...variation,
      changeLog: [...(variation.changeLog || []), newLog]
    });
    setNewLogText("");
  };

  const toggleScope = (scopeId: string) => {
    setExpandedScopes(prev => ({ ...prev, [scopeId]: !prev[scopeId] }));
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content - 2 columns */}
      <div className="col-span-2 space-y-6">

        {/* Pricing Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Pricing Controls
            </h3>
            <button
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              {showCostBreakdown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showCostBreakdown ? "Hide Breakdown" : "Show Breakdown"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Overhead */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Overheads %
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={overheadPercent}
                  onChange={(e) => setOverheadPercent(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-amber-400 font-bold text-sm w-12 text-right">{overheadPercent}%</span>
              </div>
              {quoteCalc && (
                <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(quoteCalc.totalOverhead)}</p>
              )}
            </div>

            {/* Profit */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Profit %
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="0.5"
                  value={profitPercent}
                  onChange={(e) => setProfitPercent(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="text-emerald-400 font-bold text-sm w-12 text-right">{profitPercent}%</span>
              </div>
              {quoteCalc && (
                <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(quoteCalc.totalProfit)}</p>
              )}
            </div>

            {/* Contingency */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Contingency %
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={contingencyPercent}
                  onChange={(e) => setContingencyPercent(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-blue-400 font-bold text-sm w-12 text-right">{contingencyPercent}%</span>
              </div>
              {quoteCalc && (
                <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(quoteCalc.contingencyAmount)}</p>
              )}
            </div>
          </div>

          {/* Save pricing */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveScope}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <Save className="w-4 h-4" />
              Save Pricing
            </button>
          </div>
        </div>

        {/* Pricing Summary Cards */}
        {quoteCalc && (
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Trade Cost</p>
              <p className="text-lg font-black text-white mt-1">{formatCurrency(quoteCalc.totalTradeCost)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">+ Overheads</p>
              <p className="text-lg font-black text-amber-400 mt-1">{formatCurrency(quoteCalc.totalOverhead)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">+ Profit</p>
              <p className="text-lg font-black text-emerald-400 mt-1">{formatCurrency(quoteCalc.totalProfit)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">+ GST</p>
              <p className="text-lg font-black text-indigo-400 mt-1">{formatCurrency(quoteCalc.gstAmount)}</p>
            </div>
            <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-4 text-center">
              <p className="text-[10px] font-bold text-indigo-300 uppercase">Client Total</p>
              <p className="text-lg font-black text-white mt-1">{formatCurrency(quoteCalc.totalIncGst)}</p>
            </div>
          </div>
        )}

        {/* Profit Analysis */}
        {quoteCalc && showCostBreakdown && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Profit Analysis
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase">True Cost</p>
                <p className="text-base font-bold text-white">{formatCurrency(quoteCalc.totalTradeCost + quoteCalc.totalOverhead)}</p>
                <p className="text-[10px] text-slate-500">Trade + Overheads</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Your Profit</p>
                <p className="text-base font-bold text-emerald-400">{formatCurrency(quoteCalc.totalProfit)}</p>
                <p className="text-[10px] text-slate-500">{profitPercent}% on true cost</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Effective Margin</p>
                <p className="text-base font-bold text-amber-400">{quoteCalc.effectiveMarginPercent.toFixed(1)}%</p>
                <p className="text-[10px] text-slate-500">Profit ÷ Client Price</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Contingency</p>
                <p className="text-base font-bold text-blue-400">{formatCurrency(quoteCalc.contingencyAmount)}</p>
                <p className="text-[10px] text-slate-500">{contingencyPercent}% buffer</p>
              </div>
            </div>
          </div>
        )}

        {/* Trade Breakdown Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-400" />
            Trade Breakdown — Full Cost Transparency
          </h3>

          {/* Multi-scope view */}
          {variation.scopes && variation.scopes.length > 0 ? (
            <div className="space-y-4">
              {variation.scopes.map((scope, idx) => {
                const isExpanded = expandedScopes[scope.id] !== false;
                const scopeStageCalcs = scope.stages.map(s => calculateStage(s, overheadPercent, profitPercent));
                const scopeTradeCost = scopeStageCalcs.reduce((sum, c) => sum + c.tradeCost, 0);
                const scopeClientPrice = scopeStageCalcs.reduce((sum, c) => sum + c.clientPrice, 0);

                return (
                  <div key={scope.id} className="border border-slate-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleScope(scope.id)}
                      className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-900 transition"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        <span className="text-sm font-bold text-white">Scope {idx + 1}: {scope.label}</span>
                        <span className="text-xs text-slate-500">({scope.stages.length} stages)</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs">
                        <span className="text-slate-400">Cost: <span className="text-white font-semibold">{formatCurrency(scopeTradeCost)}</span></span>
                        <span className="text-slate-400">Client: <span className="text-emerald-400 font-semibold">{formatCurrency(scopeClientPrice)}</span></span>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                              <th className="py-2 px-4">Stage / Trade</th>
                              <th className="py-2 px-4 text-center">Qty</th>
                              <th className="py-2 px-4 text-center">Unit</th>
                              <th className="py-2 px-4 text-right">Rate</th>
                              <th className="py-2 px-4 text-right">Trade Cost</th>
                              {showCostBreakdown && <th className="py-2 px-4 text-right">OH {overheadPercent}%</th>}
                              {showCostBreakdown && <th className="py-2 px-4 text-right">True Cost</th>}
                              {showCostBreakdown && <th className="py-2 px-4 text-right">Profit {profitPercent}%</th>}
                              <th className="py-2 px-4 text-right">Client Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {scopeStageCalcs.map((calc, i) => (
                              <tr key={i} className="text-sm hover:bg-slate-950/50">
                                <td className="py-3 px-4">
                                  <span className="font-medium text-white">{calc.stage.name}</span>
                                  <span className="ml-2 text-[10px] text-slate-500">{calc.stage.trade}</span>
                                </td>
                                <td className="py-3 px-4 text-center text-slate-400 text-xs">{calc.stage.quantity || 1}</td>
                                <td className="py-3 px-4 text-center text-slate-400 text-xs">{calc.stage.unit || "allow"}</td>
                                <td className="py-3 px-4 text-right text-slate-400 text-xs">{calc.stage.unitRate ? formatCurrency(calc.stage.unitRate) : "—"}</td>
                                <td className="py-3 px-4 text-right text-white">{formatCurrency(calc.tradeCost)}</td>
                                {showCostBreakdown && <td className="py-3 px-4 text-right text-amber-400 text-xs">{formatCurrency(calc.overheadAmount)}</td>}
                                {showCostBreakdown && <td className="py-3 px-4 text-right text-slate-300 text-xs">{formatCurrency(calc.trueCost)}</td>}
                                {showCostBreakdown && <td className="py-3 px-4 text-right text-emerald-400 text-xs">{formatCurrency(calc.profitAmount)}</td>}
                                <td className="py-3 px-4 text-right text-indigo-400 font-semibold">{formatCurrency(calc.clientPrice)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Legacy single-scope view */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2 px-4">Stage / Trade</th>
                    <th className="py-2 px-4 text-right">Trade Cost</th>
                    {showCostBreakdown && <th className="py-2 px-4 text-right">OH {overheadPercent}%</th>}
                    {showCostBreakdown && <th className="py-2 px-4 text-right">True Cost</th>}
                    {showCostBreakdown && <th className="py-2 px-4 text-right">Profit {profitPercent}%</th>}
                    <th className="py-2 px-4 text-right">Client Price</th>
                    <th className="py-2 px-4 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stageCalcs.map((calc, i) => (
                    <tr key={i} className="text-sm hover:bg-slate-950/50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{calc.stage.name}</span>
                        <span className="ml-2 text-[10px] text-slate-500">{calc.stage.trade}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-white">{formatCurrency(calc.tradeCost)}</td>
                      {showCostBreakdown && <td className="py-3 px-4 text-right text-amber-400 text-xs">{formatCurrency(calc.overheadAmount)}</td>}
                      {showCostBreakdown && <td className="py-3 px-4 text-right text-slate-300 text-xs">{formatCurrency(calc.trueCost)}</td>}
                      {showCostBreakdown && <td className="py-3 px-4 text-right text-emerald-400 text-xs">{formatCurrency(calc.profitAmount)}</td>}
                      <td className="py-3 px-4 text-right text-indigo-400 font-semibold">{formatCurrency(calc.clientPrice)}</td>
                      <td className="py-3 px-4 text-right text-amber-500 font-semibold">{formatCurrency(calc.clientPrice - calc.tradeCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PC Items */}
          {variation.scopes && variation.scopes.some(s => s.pcItems.length > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Prime Cost (PC) Items — Customer Selection Allowances
              </h4>
              <div className="space-y-2">
                {variation.scopes.flatMap(s => s.pcItems).map((pc, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-950 rounded-lg px-4 py-2 border border-slate-800">
                    <div>
                      <span className="text-sm text-white">{pc.description}</span>
                      {pc.note && <span className="ml-2 text-xs text-slate-500">{pc.note}</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-amber-400">{formatCurrency(pc.allowance)}</span>
                      <span className="text-xs text-slate-500 ml-1">/{pc.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scope Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-base font-bold text-white mb-4">Scope of Works & Disclaimers</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Primary Description / Scope of Works
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Elaborated Details / Additional Disclaimers
              </label>
              <textarea
                value={elaboratedDescription}
                onChange={(e) => setElaboratedDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveScope}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Inclusions & Exclusions */}
        {variation.scopes && (
          <div className="grid grid-cols-2 gap-4">
            {/* Inclusions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-bold text-emerald-400 uppercase mb-3">✓ Inclusions</h4>
              <ul className="space-y-1.5">
                {variation.scopes.flatMap(s => s.inclusions).map((inc, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{inc.text}</span>
                  </li>
                ))}
                {variation.globalInclusions?.map((inc, i) => (
                  <li key={`g-${i}`} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{inc.text}</span>
                  </li>
                ))}
                {(!variation.scopes.some(s => s.inclusions.length > 0) && !variation.globalInclusions?.length) && (
                  <li className="text-xs text-slate-500 italic">No inclusions defined yet</li>
                )}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-sm font-bold text-rose-400 uppercase mb-3">✗ Exclusions</h4>
              <ul className="space-y-1.5">
                {variation.scopes.flatMap(s => s.exclusions).map((exc, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">✗</span>
                    <span>{exc.text}</span>
                  </li>
                ))}
                {variation.globalExclusions?.map((exc, i) => (
                  <li key={`g-${i}`} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">✗</span>
                    <span>{exc.text}</span>
                  </li>
                ))}
                {(!variation.scopes.some(s => s.exclusions.length > 0) && !variation.globalExclusions?.length) && (
                  <li className="text-xs text-slate-500 italic">No exclusions defined yet</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right Column — Activity Log */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[600px]">
          <h3 className="text-base font-bold text-white mb-4">Internal Action Log</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {(variation.changeLog || []).map(log => (
              <div key={log.id} className="border-l-2 border-indigo-500 pl-3 py-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-indigo-400">{log.actorName}</span>
                  <span className="text-[9px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">{log.action}</p>
                {log.detail && <p className="text-[10px] text-slate-400 mt-0.5">{log.detail}</p>}
              </div>
            ))}
            {(!variation.changeLog || variation.changeLog.length === 0) && (
              <p className="text-slate-500 text-sm italic">No internal logs recorded yet.</p>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 mt-3 space-y-2">
            <input
              type="text"
              placeholder="Add an internal log/note..."
              value={newLogText}
              onChange={(e) => setNewLogText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLog()}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddLog}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
