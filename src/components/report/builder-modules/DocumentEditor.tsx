import { useState } from "react";
import type { Variation, PhotoItem, SmartAnswer, JobStage } from "../../../types/domain";
import { enhanceTextWithAI, elaborateWithAI } from "../../../gemini";

interface DocumentEditorProps {
  variation: Variation;
  projectName: string;
  customerName: string;
  selectedStageNames: string[];
  onSave: (text: string) => void;
  isLocked: boolean;
}

export function DocumentEditor({
  variation,
  projectName,
  customerName,
  selectedStageNames,
  onSave,
  isLocked,
}: DocumentEditorProps) {
  const [draftText, setDraftText] = useState(variation.elaboratedDescription || variation.description);
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleEnhance = async () => {
    setAiLoading(true);
    try {
      const enhanced = await enhanceTextWithAI(draftText, "scope", `${projectName} - ${variation.roomType}`);
      setDraftText(enhanced);
    } catch (err) {
      console.error("Enhance failed:", err);
    }
    setAiLoading(false);
  };

  const handleElaborate = async () => {
    setAiLoading(true);
    try {
      const scopeItems = variation.solutions[variation.selectedSolution]?.stages
        .filter((s: JobStage) => s.isSelected)
        .map((s: JobStage) => `${s.name} (${s.trade}`) ?? [];
      
      const answersList = variation.answers
        .filter((a: SmartAnswer) => a.answer && a.answer !== "Not specified")
        .map((a: SmartAnswer) => ({ question: a.question, answer: a.answer }));
      
      const photosList = variation.photos.map((p: PhotoItem) => ({
        description: p.description,
        aiAnalysis: p.aiAnalysis,
      }));

      const elaborated = await elaborateWithAI(
        variation.description,
        variation.roomType,
        variation.dimensions,
        photosList,
        scopeItems,
        answersList,
        { projectName, customerName, address: "" }
      );
      
      setDraftText(elaborated);
    } catch (err) {
      console.error("Elaborate failed:", err);
    }
    setAiLoading(false);
  };

  const handleSave = () => {
    onSave(draftText);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Scope of Works</h4>
        {!isLocked && (
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleElaborate}
                  disabled={aiLoading}
                  className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 hover:bg-purple-200 disabled:opacity-50"
                >
                  {aiLoading ? "⏳" : "✨"} Generate Full Scope
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEnhance}
                  disabled={aiLoading}
                  className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                >
                  {aiLoading ? "⏳" : "✨"} Enhance Text
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-700"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          className="h-40 w-full rounded-lg border border-slate-300 p-3 text-sm"
          disabled={isLocked}
        />
      ) : (
        <div className="prose prose-sm max-w-none rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          {draftText.split("\n").map((line: string, i: number) => (
            <p key={i} className="mb-1">
              {line}
            </p>
          ))}
        </div>
      )}

      {selectedStageNames.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-500">Active stages:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {selectedStageNames.map((name) => (
              <span key={name} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}