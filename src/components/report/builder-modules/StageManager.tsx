import { useState } from "react";
import type { JobStage } from "../../../types/domain";
import { getAutoPrice, VICTORIAN_TRADE_RATES } from "../../../utils/pricing";
import { generateId } from "../../../utils/id";

interface StageManagerProps {
  stages: JobStage[];
  onStagesChange: (stages: JobStage[]) => void;
  allTrades: string[];
  dimensions: { length: number; width: number; height: number };
  isLocked: boolean;
}

// ── Cascade map: when you add trade X, suggest these related trades ──
const TRADE_CASCADES: Record<string, { trade: string; reason: string }[]> = {
  Carpentry: [
    { trade: "Plastering", reason: "New framing needs plasterboard lining" },
    { trade: "Painting", reason: "New plaster needs painting" },
    { trade: "Insulation", reason: "New walls need insulation" },
  ],
  Structural: [
    { trade: "Engineering", reason: "Structural work needs engineer certification" },
    { trade: "Plastering", reason: "Make good after structural works" },
    { trade: "Painting", reason: "Repaint affected areas" },
  ],
  Demolition: [
    { trade: "Skip Bin", reason: "Waste removal required" },
    { trade: "Plastering", reason: "Make good after demolition" },
  ],
  Tiling: [
    { trade: "Waterproofing", reason: "Wet area tiles need membrane waterproofing" },
    { trade: "Screed", reason: "Floor must be level before tiling" },
  ],
  Plastering: [
    { trade: "Painting", reason: "New plaster needs sealing and painting" },
  ],
  "Plumbing Rough-In": [
    { trade: "Plumbing Fit-Off", reason: "Rough-in needs final fix to complete" },
    { trade: "Waterproofing", reason: "Wet area plumbing needs waterproofing" },
  ],
  "Electrical Rough-In": [
    { trade: "Electrical Fit-Off", reason: "Rough-in needs final fix to complete" },
  ],
  Joinery: [
    { trade: "Stone/Masonry", reason: "Cabinetry usually needs a benchtop" },
    { trade: "Painting", reason: "Surrounding walls need painting" },
  ],
  Roofing: [
    { trade: "Guttering", reason: "New roof needs new gutters and downpipes" },
    { trade: "Scaffolding", reason: "Roof work requires safe scaffold access" },
  ],
  Concrete: [
    { trade: "Site Works", reason: "Earthworks needed before concrete" },
    { trade: "Structural", reason: "Reinforcement needed for concrete slabs" },
  ],
  Decking: [
    { trade: "Concrete", reason: "Footings and pads needed for deck structure" },
    { trade: "Carpentry", reason: "Framing, bearers and joists needed" },
  ],
};

interface CascadeSuggestion {
  trade: string;
  reason: string;
  dims: { length: number; width: number; height: number };
  checked: boolean;
}

export function StageManager({
  stages,
  onStagesChange,
  allTrades,
  dimensions,
  isLocked,
}: StageManagerProps) {
  const [newStageName, setNewStageName] = useState("");
  const [newStageTrade, setNewStageTrade] = useState(allTrades[0] || "General");

  // ── Custom dimensions for the new stage ──
  const [customDims, setCustomDims] = useState({
    length: dimensions.length.toString(),
    width: dimensions.width.toString(),
    height: dimensions.height.toString(),
  });
  const [useCustomDims, setUseCustomDims] = useState(false);

  // ── Cascade suggestions state ──
  const [cascadeSuggestions, setCascadeSuggestions] = useState<CascadeSuggestion[]>([]);
  const [showCascade, setShowCascade] = useState(false);

  const handleToggleStage = (stageId: string) => {
    if (isLocked) return;
    onStagesChange(stages.map((s) => s.id === stageId ? { ...s, isSelected: !s.isSelected } : s));
  };

  const handleDeleteStage = (stageId: string) => {
    if (isLocked) return;
    onStagesChange(stages.filter((s) => s.id !== stageId));
  };

  const buildStage = (
    name: string,
    trade: string,
    dims: { length: number; width: number; height: number }
  ): JobStage => {
    const pricing = getAutoPrice(trade, dims);
    return {
      id: generateId(),
      name,
      description: `${trade} works`,
      durationDays: pricing.durationDays,
      builderCost: pricing.builderCost,
      clientCost: pricing.clientCost,
      trade,
      code: pricing.code,
      isSelected: true,
    };
  };

  const handleAddStage = () => {
    if (isLocked || !newStageName.trim()) return;

    const effectiveDims = useCustomDims
      ? {
          length: Number(customDims.length) || dimensions.length,
          width: Number(customDims.width) || dimensions.width,
          height: Number(customDims.height) || dimensions.height,
        }
      : dimensions;

    const newStage = buildStage(newStageName, newStageTrade, effectiveDims);

    // Check for cascade suggestions
    const cascades = TRADE_CASCADES[newStageTrade] ?? [];
    const existingTrades = new Set(stages.map((s) => s.trade));

    const suggestions: CascadeSuggestion[] = cascades
      .filter((c) => !existingTrades.has(c.trade))
      .map((c) => ({
        ...c,
        dims: effectiveDims,
        checked: true, // default all suggestions to checked
      }));

    onStagesChange([...stages, newStage]);
    setNewStageName("");

    if (suggestions.length > 0) {
      setCascadeSuggestions(suggestions);
      setShowCascade(true);
    }
  };

  const handleConfirmCascade = () => {
    const newStages = cascadeSuggestions
      .filter((s) => s.checked)
      .map((s) =>
        buildStage(`${s.trade} works`, s.trade, s.dims)
      );
    if (newStages.length > 0) {
      onStagesChange([...stages, ...newStages]);
    }
    setShowCascade(false);
    setCascadeSuggestions([]);
  };

  const handleDismissCascade = () => {
    setShowCascade(false);
    setCascadeSuggestions([]);
  };

  const toggleCascadeSuggestion = (trade: string) => {
    setCascadeSuggestions((prev) =>
      prev.map((s) => s.trade === trade ? { ...s, checked: !s.checked } : s)
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-600">
        Stages & Works
      </h4>

      {/* ── Existing stages list ── */}
      <div className="mb-3 space-y-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`flex items-center justify-between rounded-lg border p-2 ${
              stage.isSelected
                ? "border-slate-200 bg-white"
                : "border-slate-100 bg-slate-50 opacity-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={stage.isSelected}
                onChange={() => handleToggleStage(stage.id)}
                disabled={isLocked}
                className="h-4 w-4 rounded border-slate-300"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{stage.name}</p>
                <p className="text-xs text-slate-500">
                  {stage.trade} · {stage.durationDays} days · $
                  {stage.clientCost.toLocaleString()}
                </p>
              </div>
            </div>
            {!isLocked && (
              <button
                onClick={() => handleDeleteStage(stage.id)}
                className="rounded bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── Add new stage ── */}
      {!isLocked && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Add Stage
          </p>

          {/* Trade + Name */}
          <div className="flex gap-2">
            <select
              value={newStageTrade}
              onChange={(e) => setNewStageTrade(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
            >
              {Object.keys(VICTORIAN_TRADE_RATES).sort().map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddStage()}
              placeholder="Stage name (e.g. New wall to bedroom)"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
            />
          </div>

          {/* Custom dimensions toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useCustomDims"
              checked={useCustomDims}
              onChange={(e) => setUseCustomDims(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label htmlFor="useCustomDims" className="text-xs font-semibold text-slate-600">
              Use custom dimensions for this stage (different from room size)
            </label>
          </div>

          {useCustomDims && (
            <div className="grid grid-cols-3 gap-2">
              {(["length", "width", "height"] as const).map((field) => (
                <label key={field} className="space-y-1">
                  <span className="text-xs font-semibold capitalize text-slate-500">
                    {field} (m)
                  </span>
                  <input
                    type="number"
                    value={customDims[field]}
                    onChange={(e) =>
                      setCustomDims((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm"
                  />
                </label>
              ))}
            </div>
          )}

          {/* Price preview */}
          {newStageTrade && (
            <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
              <p className="text-xs text-slate-500">
                Estimated price using{" "}
                <span className="font-semibold text-slate-700">{newStageTrade}</span> rate:
              </p>
              {(() => {
                const dims = useCustomDims
                  ? {
                      length: Number(customDims.length) || dimensions.length,
                      width: Number(customDims.width) || dimensions.width,
                      height: Number(customDims.height) || dimensions.height,
                    }
                  : dimensions;
                const pricing = getAutoPrice(newStageTrade, dims);
                return (
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-slate-600">
                      Builder: <strong>${pricing.builderCost.toLocaleString()}</strong>
                    </span>
                    <span className="text-xs text-red-700">
                      Client: <strong>${pricing.clientCost.toLocaleString()}</strong>
                    </span>
                    <span className="text-xs text-slate-500">
                      {pricing.durationDays} days
                    </span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Cascade hint */}
          {TRADE_CASCADES[newStageTrade] && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              💡 Adding <strong>{newStageTrade}</strong> will suggest related trades
              ({TRADE_CASCADES[newStageTrade].map((c) => c.trade).join(", ")})
            </p>
          )}

          <button
            onClick={handleAddStage}
            disabled={!newStageName.trim()}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            ➕ Add Stage
          </button>
        </div>
      )}

      {/* ── Cascade suggestions modal ── */}
      {showCascade && cascadeSuggestions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                💡 Related Trades Suggested
              </p>
              <h3 className="text-lg font-black tracking-tight text-slate-900 mt-1">
                Add related stages?
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Based on your selection, these trades are typically required.
                Tick the ones you want to include — prices are auto-calculated.
              </p>
            </div>

            <div className="space-y-2">
              {cascadeSuggestions.map((suggestion) => {
                const pricing = getAutoPrice(suggestion.trade, suggestion.dims);
                return (
                  <div
                    key={suggestion.trade}
                    onClick={() => toggleCascadeSuggestion(suggestion.trade)}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      suggestion.checked
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={suggestion.checked}
                        onChange={() => toggleCascadeSuggestion(suggestion.trade)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900">
                            {suggestion.trade}
                          </p>
                          <p className="text-sm font-bold text-red-700">
                            ${pricing.clientCost.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{suggestion.reason}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {pricing.durationDays} days · Builder: $
                          {pricing.builderCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total if all checked */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {cascadeSuggestions.filter((s) => s.checked).length} stages selected
                </span>
                <span className="font-bold text-red-700">
                  +$
                  {cascadeSuggestions
                    .filter((s) => s.checked)
                    .reduce(
                      (sum, s) => sum + getAutoPrice(s.trade, s.dims).clientCost,
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismissCascade}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                Skip — Add manually
              </button>
              <button
                onClick={handleConfirmCascade}
                disabled={cascadeSuggestions.filter((s) => s.checked).length === 0}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                ✅ Add Selected Stages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
