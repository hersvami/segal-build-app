import type { JobStage } from "../../../types/domain";

interface TradeTogglesProps {
  stages: JobStage[];
  onToggleTrade: (trade: string) => void;
  isLocked: boolean;
}

export function TradeToggles({ stages, onToggleTrade, isLocked }: TradeTogglesProps) {
  const trades = Array.from(new Set(stages.map((s) => s.trade))).sort();

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-600">Trade Filters</h4>
      <div className="flex flex-wrap gap-2">
        {trades.map((trade) => {
          const tradeStages = stages.filter((s) => s.trade === trade);
          const isActive = tradeStages.some((s) => s.isSelected);
          const totalCost = tradeStages
            .filter((s) => s.isSelected)
            .reduce((sum, s) => sum + s.clientCost, 0);

          return (
            <button
              key={trade}
              onClick={() => !isLocked && onToggleTrade(trade)}
              disabled={isLocked}
              className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                isActive
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-slate-200 bg-slate-50 text-slate-600 line-through opacity-60"
              } ${isLocked ? "cursor-not-allowed" : "hover:border-red-300 hover:bg-red-50"}`}
            >
              <span className="block">{trade}</span>
              {isActive && <span className="block text-[10px] opacity-80">${totalCost.toLocaleString()}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}