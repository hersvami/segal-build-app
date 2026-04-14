import type { QuestionTemplate } from "../utils/smartQuestions";
import type { PhotoItem } from "../types/domain";

interface ReviewStepProps {
  title: string;
  mode: "quote" | "variation";
  roomType: string;
  description: string;
  dimensions: { length: number; width: number; height: number };
  answers: Record<string, string>;
  templates: QuestionTemplate[];
  photos: PhotoItem[];
}

export function ReviewStep({
  title,
  mode,
  roomType,
  description,
  dimensions,
  answers,
  templates,
  photos,
}: ReviewStepProps) {
  const area = dimensions.length * dimensions.width;
  const answeredQuestions = templates.filter(
    (t) => answers[t.id] && answers[t.id] !== "Not specified"
  );

  return (
    <section className="space-y-5">
      <h4 className="text-lg font-bold text-slate-900">Review Before Generating</h4>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h5>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-semibold text-slate-700">Title:</span>{" "}
            <span className="text-slate-900">{title || "Untitled"}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Type:</span>{" "}
            <span className="capitalize text-slate-900">{mode}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Room/Area:</span>{" "}
            <span className="capitalize text-slate-900">{roomType}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Floor Area:</span>{" "}
            <span className="text-slate-900">{area.toFixed(1)} m²</span>
          </div>
        </div>
        {description && (
          <div className="mt-2 rounded-lg bg-white p-3 text-sm text-slate-600 border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-1">Notes:</p>
            {description}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Dimensions</h5>
        <div className="flex gap-4 text-sm">
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Length</p>
            <p className="text-lg font-bold text-slate-900">{dimensions.length}m</p>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Width</p>
            <p className="text-lg font-bold text-slate-900">{dimensions.width}m</p>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Height</p>
            <p className="text-lg font-bold text-slate-900">{dimensions.height}m</p>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-center">
            <p className="text-xs text-red-600">Area</p>
            <p className="text-lg font-bold text-red-800">{area.toFixed(1)} m²</p>
          </div>
        </div>
      </div>

      {answeredQuestions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Your Selections ({answeredQuestions.length}/{templates.length})
          </h5>
          <div className="space-y-1">
            {answeredQuestions.map((t) => {
              const answer = answers[t.id];
              const isImpactful = [
                "flooring_type",
                "waterproofing",
                "tiling",
                "cabinetry",
                "services",
                "window_type",
                "engineering",
                "building_age",
                "demolition",
                "access",
                "joinery",
              ].includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    isImpactful ? "bg-amber-50 border border-amber-200" : "bg-white border border-slate-200"
                  }`}
                >
                  <span className="text-slate-700">{t.question}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{answer}</span>
                    {isImpactful && (
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
                        Affects pricing
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {templates.length > answeredQuestions.length && (
        <p className="text-xs text-slate-400">
          {templates.length - answeredQuestions.length} question(s) not answered — defaults will be used.
        </p>
      )}

      {photos.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Site Photos ({photos.length})
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={photo.url || photo.data}
                  alt="Site"
                  className="h-24 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-1">Ready to Generate</h5>
        <p className="text-sm text-green-700">
          Click <strong>"Generate Document"</strong> below to create 3 quote options (Essential, Standard, Premium)
          based on your selections. Pricing uses Victorian construction rates and your answers will trigger
          relevant trade stages automatically.
        </p>
      </div>
    </section>
  );
}