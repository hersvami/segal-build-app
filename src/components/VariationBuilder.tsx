import React, { useState } from "react";
import {
  Ruler,
  Camera,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { generateSolutions, ANSWER_STAGE_RULES } from "../utils/pricing";
import { generateId } from "../utils/id";
import type { Variation, Solution, PhotoItem } from "../types/domain";

interface VariationBuilderProps {
  onSave: (variation: Variation) => void;
  onCancel: () => void;
}

const ROOM_TYPES = [
  "bathroom",
  "kitchen",
  "laundry",
  "living",
  "bedroom",
  "general",
  "flooring",
  "painting",
  "outdoor",
  "roofing",
  "structural",
  "windows",
];

export const VariationBuilder: React.FC<VariationBuilderProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("general");
  const [length, setLength] = useState<number>(4);
  const [width, setWidth] = useState<number>(3);
  const [height, setHeight] = useState<number>(2.4);

  // Photos
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");

  // Answer rules tracking
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Generated Solutions & Selection
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolutionIdx, setSelectedSolutionIdx] = useState<number>(1); // default Standard

  const addPhoto = () => {
    if (!photoDesc) return;
    const newPhoto: PhotoItem = {
      id: generateId(),
      url: photoUrl || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80",
      description: photoDesc,
      aiAnalysis: `AI Analysis: Visual patterns indicate standard material construction appropriate for ${roomType} works.`,
    };
    setPhotos([...photos, newPhoto]);
    setPhotoUrl("");
    setPhotoDesc("");
  };

  const handleGenerate = () => {
    if (!title) {
      alert("Please provide a title");
      return;
    }
    const newSolutions = generateSolutions(roomType, { length, width, height }, answers);
    setSolutions(newSolutions);
  };

  const handleSave = () => {
    if (solutions.length === 0) return;

    const newVariation: Variation = {
      id: generateId(),
      mode: "quote",
      title,
      description,
      elaboratedDescription: `${description}\nDimensions: ${length}m x ${width}m x ${height}m`,
      roomType,
      dimensions: { length, width, height },
      answers: [],
      photos,
      solutions,
      selectedSolution: selectedSolutionIdx,
      status: "draft",
      customerComment: "",
      rejectionReason: "",
      customerSignature: "",
      createdAt: new Date().toISOString(),
    };

    onSave(newVariation);
  };

  const autofillDemo = () => {
    setTitle("Premium Master Ensuite Makeover");
    setDescription("Full gut, re-waterproofing, custom stone vanity, and double shower screen install.");
    setRoomType("bathroom");
    setLength(3.5);
    setWidth(2.5);
    setHeight(2.7);
    setAnswers({
      skip_bin: "Medium skip (4-6m³)",
      site_clean: "Full detail clean (handover quality)",
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Sparkles size={18} /> Modular Quote & Variation Builder
          </h2>
          <p className="text-xs text-indigo-100 mt-1">Configure dimensions, rules, and modules to generate dynamic solutions</p>
        </div>
        <button
          type="button"
          onClick={autofillDemo}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-3 py-1.5 rounded-xl font-medium transition-colors backdrop-blur-sm"
        >
          Autofill Demo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input Specs */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Info size={16} className="text-indigo-600" /> Basic Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Master Bathroom Renovation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Description & Scope
              </label>
              <textarea
                placeholder="Specify requirements and scope of work..."
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Room & Work Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white capitalize"
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Ruler size={16} className="text-indigo-600" /> Dimensions (m)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Length</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Width</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Height</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Wrench size={16} className="text-indigo-600" /> Job Rules & Answers
            </h3>
            {ANSWER_STAGE_RULES.map((rule, idx) => {
              const ruleOptions = Array.isArray(rule.answerMatch) ? rule.answerMatch : [rule.answerMatch];
              return (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                  <div className="text-xs font-semibold text-slate-700 capitalize">
                    {rule.questionId.replace("_", " ")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...answers };
                        delete next[rule.questionId];
                        setAnswers(next);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        !answers[rule.questionId]
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      None / Not Required
                    </button>
                    {ruleOptions.map((opt) => {
                      const isSelected = answers[rule.questionId] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [rule.questionId]: opt })}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Camera size={16} className="text-indigo-600" /> Existing Site Photos
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-1/3 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
              />
              <input
                type="text"
                placeholder="Photo Description..."
                value={photoDesc}
                onChange={(e) => setPhotoDesc(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={addPhoto}
                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-indigo-100 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {photos.map((ph) => (
                <div key={ph.id} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex gap-2 p-2">
                  {ph.url && <img src={ph.url} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-700 truncate">{ph.description}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{ph.aiAnalysis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Generated Solutions & Finish */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <Layers size={18} />
              {solutions.length > 0 ? "Regenerate Solutions" : "Generate Custom Solutions"}
            </button>
          </div>

          {solutions.length > 0 && (
            <div className="space-y-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck size={16} className="text-indigo-600" /> 1. Select Quote Solution
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {solutions.map((sol, idx) => {
                  const isSelected = idx === selectedSolutionIdx;
                  return (
                    <div
                      key={sol.id}
                      onClick={() => setSelectedSolutionIdx(idx)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/20 shadow-md"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            isSelected ? "text-indigo-600" : "text-slate-500"
                          }`}>
                            {sol.title}
                          </span>
                          {isSelected && <CheckCircle2 size={16} className="text-indigo-600" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{sol.description}</p>
                      </div>

                      <div className="space-y-1 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-semibold text-slate-700">{sol.timelineDays} days</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Stages:</span>
                          <span className="font-semibold text-slate-700">{sol.stages.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-1 font-bold">
                          <span className="text-slate-400">Total:</span>
                          <span className="text-indigo-600">${sol.clientCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show Details of selected solution */}
              {solutions[selectedSolutionIdx] && (
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col max-h-[300px] overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Stages & Scope Included ({solutions[selectedSolutionIdx].title})
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {solutions[selectedSolutionIdx].stages.map((stage) => (
                      <div key={stage.id} className="bg-white p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{stage.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{stage.description}</div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-xs font-bold text-slate-700">${stage.clientCost.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">{stage.durationDays} days</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={solutions.length === 0}
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-100 transition-colors"
        >
          Save & Proceed
        </button>
      </div>
    </div>
  );
};
