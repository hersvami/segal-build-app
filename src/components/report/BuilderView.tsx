import React, { useState } from "react";
import { Variation } from "../../types/domain";
import { Save, PlusCircle } from "lucide-react";

interface BuilderViewProps {
  variation: Variation;
  onUpdateVariation: (updated: Variation) => void;
}

export const BuilderView: React.FC<BuilderViewProps> = ({ variation, onUpdateVariation }) => {
  const [description, setDescription] = useState(variation.description || "");
  const [elaboratedDescription, setElaboratedDescription] = useState(variation.elaboratedDescription || "");
  const [newLogText, setNewLogText] = useState("");

  const selectedSolution = variation.solutions[variation.selectedSolution] || variation.solutions[0];

  const handleSaveScope = () => {
    onUpdateVariation({
      ...variation,
      description,
      elaboratedDescription
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

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Scope Editor */}
      <div className="col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Edit Scope & Disclaimers</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                Primary Description / Scope of Works
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                Elaborated Details / Additional Disclaimers
              </label>
              <textarea
                value={elaboratedDescription}
                onChange={(e) => setElaboratedDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveScope}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Scope Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing / Stages Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Trade Breakdown & Internal Pricing</h3>
          {selectedSolution && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                    <th className="py-3 px-4">Stage / Task</th>
                    <th className="py-3 px-4 text-right">Builder Cost</th>
                    <th className="py-3 px-4 text-right">Client Charge</th>
                    <th className="py-3 px-4 text-right">Gross Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedSolution.stages.map(stage => {
                    const margin = stage.clientCost - stage.builderCost;
                    return (
                      <tr key={stage.id} className="text-sm">
                        <td className="py-4 px-4 font-medium text-white">{stage.name}</td>
                        <td className="py-4 px-4 text-slate-400 text-right">${stage.builderCost.toLocaleString()}</td>
                        <td className="py-4 px-4 text-emerald-400 font-semibold text-right">${stage.clientCost.toLocaleString()}</td>
                        <td className="py-4 px-4 text-amber-500 font-semibold text-right">${margin.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Internal Log and Auditing */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[500px]">
          <h3 className="text-lg font-bold text-white mb-4">Internal Action & Activity Logs</h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {(variation.changeLog || []).map(log => (
              <div key={log.id} className="border-l-2 border-indigo-500 pl-4 py-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-indigo-400">{log.actorName}</span>
                  <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-200 mt-1">{log.action}</p>
                {log.detail && <p className="text-xs text-slate-400 mt-0.5">{log.detail}</p>}
              </div>
            ))}
            {(!variation.changeLog || variation.changeLog.length === 0) && (
              <p className="text-slate-500 text-sm italic">No internal logs recorded yet.</p>
            )}
          </div>

          <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
            <input
              type="text"
              placeholder="Add an internal log/note..."
              value={newLogText}
              onChange={(e) => setNewLogText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddLog}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl text-sm transition flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
