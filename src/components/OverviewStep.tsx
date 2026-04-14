import { useState } from "react";
import { enhanceTextWithAI } from "../gemini";

interface OverviewStepProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function OverviewStep({ title, description, onTitleChange, onDescriptionChange }: OverviewStepProps) {
  const [enhancing, setEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!description.trim()) return;
    setEnhancing(true);
    try {
      const enhanced = await enhanceTextWithAI(
        description,
        "scope",
        title || "General building work"
      );
      onDescriptionChange(enhanced);
    } catch (err) {
      console.error("AI enhance failed:", err);
    }
    setEnhancing(false);
  };

  return (
    <section className="space-y-4">
      <h4 className="text-lg font-bold text-slate-900">Overview</h4>
      <input
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2"
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        className="h-32 w-full rounded-lg border border-slate-200 px-3 py-2"
        placeholder="Scope notes — type your rough notes and click AI Enhance to clean them up"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleEnhance}
          disabled={enhancing || !description.trim()}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enhancing ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enhancing...
            </span>
          ) : (
            "✨ AI Enhance Notes"
          )}
        </button>
        {!description.trim() && (
          <p className="text-xs text-slate-400">Type some notes first, then click to enhance</p>
        )}
      </div>
    </section>
  );
}