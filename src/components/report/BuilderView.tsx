import { useMemo } from "react";
import type { Variation, Solution, Company, Project, JobStage } from "../../types/domain";
import { isVariationLocked } from "../../utils/variationGuards";
import { DocumentEditor } from "./builder-modules/DocumentEditor";
import { QuoteOptions } from "./builder-modules/QuoteOptions";
import { PricingHeader } from "./builder-modules/PricingHeader";
import { TradeToggles } from "./builder-modules/TradeToggles";
import { StageManager } from "./builder-modules/StageManager";

const recalcSolution = (solution: Solution): Solution => {
  const activeStages = solution.stages.filter((s) => s.isSelected);
  const builderCost = activeStages.reduce((sum, s) => sum + s.builderCost, 0);
  const clientCost = activeStages.reduce((sum, s) => sum + s.clientCost, 0);
  const timelineDays = activeStages.reduce((sum, s) => sum + s.durationDays, 0);

  const byTrade = new Map<string, { builder: number; client: number }>();
  for (const stage of activeStages) {
    const current = byTrade.get(stage.trade) ?? { builder: 0, client: 0 };
    byTrade.set(stage.trade, {
      builder: current.builder + stage.builderCost,
      client: current.client + stage.clientCost,
    });
  }

  const tradeLines = Array.from(byTrade.entries()).map(([trade, costs], idx) => ({
    id: `${trade}-${idx}`,
    trade,
    description: `${trade} works`,
    builderCost: costs.builder,
    clientCost: costs.client,
  }));

  return { ...solution, stages: solution.stages, tradeLines, builderCost, clientCost, timelineDays };
};

interface BuilderViewProps {
  variation: Variation;
  project: Project;
  company: Company;
  onUpdateVariation: (updated: Variation) => void;
  onStatusChange: (status: Variation["status"], comment?: string) => void;
  onCreateRevision?: () => void;
  onSend: () => void;
  setViewMode: (mode: "builder" | "customer") => void;
}

export function BuilderView({
  variation,
  project,
  // @ts-ignore
  company,
  onUpdateVariation,
  onStatusChange,
  onCreateRevision,
  onSend,
  setViewMode,
}: BuilderViewProps) {
  const isLocked = isVariationLocked(variation);
  const selectedSolution = variation.solutions[variation.selectedSolution];

  const allTrades = useMemo(() => {
    const fromRates = ["General", "Carpentry", "Plumbing", "Electrical", "Painting", "Tiling", "Roofing", "Concreting"];
    const fromStages = selectedSolution.stages.map((s) => s.trade);
    return Array.from(new Set([...fromRates, ...fromStages])).sort();
  }, [selectedSolution.stages]);

  const handleSolutionUpdate = (updatedSolution: Solution) => {
    if (isLocked) return;
    const recalced = recalcSolution(updatedSolution);
    const nextSolutions = variation.solutions.map((s, i) =>
      i === variation.selectedSolution ? recalced : s
    );
    onUpdateVariation({ ...variation, solutions: nextSolutions });
  };

  const handleStagesChange = (newStages: JobStage[]) => {
    handleSolutionUpdate({ ...selectedSolution, stages: newStages });
  };

  const handleToggleTrade = (trade: string) => {
    if (isLocked) return;
    const tradeStages = selectedSolution.stages.filter((s) => s.trade === trade);
    const shouldEnable = tradeStages.some((s) => !s.isSelected);
    const nextStages = selectedSolution.stages.map((s) =>
      s.trade === trade ? { ...s, isSelected: shouldEnable } : s
    );
    handleStagesChange(nextStages);
  };

  const handleSelectOption = (idx: number) => {
    if (isLocked) return;
    onUpdateVariation({ ...variation, selectedSolution: idx });
  };

  const handleAddOption = () => {
    if (isLocked) return;
    const newSol: Solution = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
      title: `Option ${variation.solutions.length + 1}`,
      description: "",
      builderCost: 0,
      clientCost: 0,
      timelineDays: 0,
      stages: [],
      tradeLines: [],
    };
    onUpdateVariation({
      ...variation,
      solutions: [...variation.solutions, newSol],
      selectedSolution: variation.solutions.length,
    });
  };

  const handleDeleteOption = (idx: number) => {
    if (isLocked) return;
    if (variation.solutions.length <= 1) return;
    const nextSolutions = variation.solutions.filter((_, i) => i !== idx);
    onUpdateVariation({
      ...variation,
      solutions: nextSolutions,
      selectedSolution: Math.min(variation.selectedSolution, nextSolutions.length - 1),
    });
  };

  const handleRenameOption = (idx: number, newTitle: string) => {
    if (isLocked) return;
    const nextSolutions = variation.solutions.map((s, i) =>
      i === idx ? { ...s, title: newTitle } : s
    );
    onUpdateVariation({ ...variation, solutions: nextSolutions });
  };

  const handlePrintPDF = () => {
    setViewMode("customer");
    setTimeout(() => window.print(), 500);
  };

  const selectedStageNames = selectedSolution.stages
    .filter((s) => s.isSelected)
    .map((s) => s.name);

  return (
    <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("builder")}
            className="rounded-lg px-3 py-1 text-xs font-bold bg-slate-800 text-white"
          >
            🔧 Builder View
          </button>
          <button
            onClick={() => setViewMode("customer")}
            className="rounded-lg px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700"
          >
            👤 Customer Preview
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrintPDF}
            className="rounded-lg bg-blue-100 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-200"
          >
            📄 Save PDF
          </button>
          <button
            onClick={onSend}
            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
          >
            📧 Send to Customer
          </button>
        </div>
      </div>

      {isLocked && (
        <div className="rounded-xl border-2 border-green-400 bg-green-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-green-800">🔒 This document is locked</p>
            <p className="text-xs text-green-700 mt-0.5">
              Approved on {variation.approvedAt ? new Date(variation.approvedAt).toLocaleDateString("en-AU") : "—"}.
            </p>
          </div>
          {onCreateRevision && (
            <button
              onClick={onCreateRevision}
              className="rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white hover:bg-green-800"
            >
              📄 Create Revision
            </button>
          )}
        </div>
      )}

      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">
            {variation.mode === "quote" ? "Quotation" : "Variation"}
          </p>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">{variation.title}</h3>
          <p className="text-sm text-slate-500">
            {project.name} · {project.customerName}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
          {variation.status}
        </span>
      </header>

      <DocumentEditor
        variation={variation}
        projectName={project.name}
        customerName={project.customerName}
        selectedStageNames={selectedStageNames}
        onSave={(text) => onUpdateVariation({ ...variation, elaboratedDescription: text, description: text })}
        isLocked={isLocked}
      />

      <QuoteOptions
        solutions={variation.solutions}
        selectedIndex={variation.selectedSolution}
        onSelect={handleSelectOption}
        onAdd={handleAddOption}
        onDelete={handleDeleteOption}
        onRename={handleRenameOption}
        isLocked={isLocked}
      />

      <PricingHeader
        builderCost={selectedSolution.builderCost}
        clientCost={selectedSolution.clientCost}
      />

      <TradeToggles
        stages={selectedSolution.stages}
        onToggleTrade={handleToggleTrade}
        isLocked={isLocked}
      />

      <StageManager
        stages={selectedSolution.stages}
        onStagesChange={handleStagesChange}
        allTrades={allTrades}
        dimensions={variation.dimensions}
        isLocked={isLocked}
      />

      <section className="space-y-2 rounded-xl border border-slate-200 p-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Status & Actions</h4>
        {isLocked ? (
          <p className="text-xs text-green-700 font-semibold">
            🔒 Document is locked. Use "Create Revision" above to make changes.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange("pending")}
              className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-white"
            >
              Mark Pending
            </button>
            <button
              onClick={() => onStatusChange("approved")}
              className="rounded-lg bg-green-700 px-4 py-2 text-xs font-bold text-white"
            >
              Approve
            </button>
            <button
              onClick={() => onStatusChange("rejected")}
              className="rounded-lg bg-red-700 px-4 py-2 text-xs font-bold text-white"
            >
              Reject
            </button>
            <button
              onClick={() => onStatusChange("invoiced")}
              className="rounded-lg bg-purple-700 px-4 py-2 text-xs font-bold text-white"
            >
              Mark Invoiced
            </button>
          </div>
        )}
      </section>

      {/* ── Change Log ── */}
      {(variation.changeLog ?? []).length > 0 && (
        <section className="space-y-3 rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            📋 Change Log & Audit Trail
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(variation.changeLog ?? []).map((entry) => (
              <div
                key={entry.id}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  entry.actor === "customer"
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-bold ${
                      entry.actor === "customer"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {entry.actor === "customer" ? "👤" : "🔧"} {entry.actorName}
                    </span>
                    <span className="font-semibold text-slate-800">{entry.action}</span>
                  </div>
                  <span className="text-slate-400">
                    {new Date(entry.timestamp).toLocaleString("en-AU", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                {entry.detail && (
                  <p className="mt-1 text-slate-600 pl-2">{entry.detail}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  );
}