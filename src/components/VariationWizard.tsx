import { useMemo, useState, useEffect } from "react";
import type { PhotoItem, Project, SmartAnswer, Variation } from "../types/domain";
import { compressImageToDataUrl, uploadPhotoToCloudinary } from "../logic/photoService";
import { generateId } from "../utils/id";
import { generateSolutions } from "../utils/pricing";
import { detectRoomType, getSmartQuestions } from "../utils/smartQuestions";
import { analyzePhotoWithAI } from "../gemini";
import { DimensionsStep } from "./DimensionsStep";
import { OverviewStep } from "./OverviewStep";
import { QuestionsStep } from "./QuestionsStep";
import { ReviewStep } from "./ReviewStep";
import { LoadingSpinner } from "./LoadingSpinner";

interface VariationWizardProps {
  mode: "quote" | "variation";
  project: Project;
  onClose: () => void;
  onSave: (variation: Variation) => void;
  companyId?: string;
}

// ── Draft persistence helpers ──
function getDraftKey(projectId: string, mode: string) {
  return `wizard_draft_${projectId}_${mode}`;
}

function loadDraft(projectId: string, mode: string) {
  try {
    const raw = localStorage.getItem(getDraftKey(projectId, mode));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(projectId: string, mode: string, data: object) {
  localStorage.setItem(getDraftKey(projectId, mode), JSON.stringify(data));
}

function clearDraft(projectId: string, mode: string) {
  localStorage.removeItem(getDraftKey(projectId, mode));
}

export function VariationWizard({ mode, project, onClose, onSave, companyId }: VariationWizardProps) {
  // Load any existing draft on first render
  const draft = loadDraft(project.id, mode);

  const [step, setStep] = useState<number>(draft?.step ?? 1);
  const [title, setTitle] = useState<string>(draft?.title ?? "");
  const [description, setDescription] = useState<string>(draft?.description ?? "");
  const [roomType, setRoomType] = useState<string>(draft?.roomType ?? "general");
  const [dimensions, setDimensions] = useState<{ length: string; width: string; height: string }>(
    draft?.dimensions ?? { length: "3", width: "3", height: "2.4" }
  );
  const [answers, setAnswers] = useState<Record<string, string>>(draft?.answers ?? {});
  const [photos, setPhotos] = useState<PhotoItem[]>(draft?.photos ?? []);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const templates = useMemo(() => getSmartQuestions(roomType), [roomType]);

  // ── Auto-save draft to localStorage whenever state changes ──
  useEffect(() => {
    saveDraft(project.id, mode, {
      step,
      title,
      description,
      roomType,
      dimensions,
      answers,
      // Only save photos that have a URL (already uploaded) — skip large dataUrls to avoid quota issues
      photos: photos.map((p) => ({ ...p, data: undefined })),
    });
  }, [step, title, description, roomType, dimensions, answers, photos, project.id, mode]);

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const nextPhotos: PhotoItem[] = [...photos];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      try {
        const dataUrl = await compressImageToDataUrl(file);
        let url = dataUrl;
        try {
          const uploaded = await uploadPhotoToCloudinary(dataUrl, project.name, "wizard-photos");
          url = uploaded.url;
        } catch {
          console.warn("Cloudinary upload failed, using local dataUrl");
        }

        // ── Auto AI photo analysis ──
        let aiAnalysis = "";
        try {
          aiAnalysis = await analyzePhotoWithAI(
            dataUrl,
            "Site photo",
            roomType,
            title || "New quote",
            description || "Site inspection photo"
          );
        } catch {
          aiAnalysis = "Photo uploaded — AI analysis unavailable right now.";
        }

        nextPhotos.push({
          id: generateId(),
          data: dataUrl,
          url,
          description: "",
          aiAnalysis,
        });
      } catch (err) {
        console.error("Photo upload failed", err);
      }
    }

    setPhotos(nextPhotos);
    setUploading(false);
  };

  const save = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 500));

    const parsedDimensions = {
      length: Number(dimensions.length) || 3,
      width: Number(dimensions.width) || 3,
      height: Number(dimensions.height) || 2.4,
    };

    const mappedAnswers: SmartAnswer[] = templates.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      category: question.category,
      answer: answers[question.id] ?? "Not specified",
    }));

    const variation: Variation = {
      id: generateId(),
      mode,
      title,
      description,
      elaboratedDescription: description,
      roomType,
      dimensions: parsedDimensions,
      answers: mappedAnswers,
      photos,
      solutions: generateSolutions(roomType, parsedDimensions, answers),
      selectedSolution: 1,
      status: "draft",
      customerComment: "",
      rejectionReason: "",
      customerSignature: "",
      createdAt: new Date().toISOString(),
    };

    // Clear the draft on successful save
    clearDraft(project.id, mode);

    onSave(variation);
    setGenerating(false);
  };

  const handleClose = () => {
    // Draft is preserved in localStorage so the user can resume later
    onClose();
  };

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] && answers[k] !== "Not specified"
  ).length;

  const hasDraft = !!(draft?.title || draft?.description);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-700">
              {mode === "quote" ? "New Quote" : "New Variation"}
            </p>
            <h3 className="text-xl font-black tracking-tight text-slate-900">{project.name}</h3>
            {hasDraft && (
              <p className="text-xs text-amber-600 font-semibold mt-0.5">
                📝 Draft restored — your progress has been saved
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasDraft && (
              <button
                onClick={() => {
                  clearDraft(project.id, mode);
                  setStep(1);
                  setTitle("");
                  setDescription("");
                  setRoomType("general");
                  setDimensions({ length: "3", width: "3", height: "2.4" });
                  setAnswers({});
                  setPhotos([]);
                }}
                className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-red-100 hover:text-red-700"
              >
                Clear Draft
              </button>
            )}
            <button
              onClick={handleClose}
              className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Step indicator */}
          <div className="flex gap-2">
            {["Overview", "Dimensions", "Questions", "Review"].map((label, idx) => (
              <div key={label} className="flex-1">
                <div className={`h-2 rounded-full ${step >= idx + 1 ? "bg-red-700" : "bg-slate-200"}`} />
                <p
                  className={`mt-1 text-center text-xs font-semibold ${
                    step >= idx + 1 ? "text-red-700" : "text-slate-400"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Step 1: Overview + Photos */}
          {step === 1 && (
            <section className="space-y-4">
              <OverviewStep
                title={title}
                description={description}
                onTitleChange={(value) => setTitle(value)}
                onDescriptionChange={(value) => {
                  setDescription(value);
                  setRoomType(detectRoomType(title, value));
                }}
              />

              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-600">
                  Site Photos
                </h4>

                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                    📷 Upload Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e.target.files)}
                    />
                  </label>

                  <label className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
                    📸 Take Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e.target.files)}
                    />
                  </label>

                  {uploading && (
                    <span className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800">
                      Uploading...
                    </span>
                  )}
                </div>

                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src={photo.url || photo.data}
                          alt="Site"
                          className="h-28 w-full object-cover"
                        />
                        <button
                          onClick={() => setPhotos(photos.filter((p) => p.id !== photo.id))}
                          className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Step 2: Dimensions */}
          {step === 2 && (
            <DimensionsStep
              roomType={roomType}
              dimensions={dimensions}
              onRoomTypeChange={(value) => setRoomType(value)}
              onDimensionChange={(field, value) =>
                setDimensions((prev) => ({ ...prev, [field]: value }))
              }
            />
          )}

          {/* Step 3: Smart Questions */}
          {step === 3 && (
            <div className="space-y-3">
              <QuestionsStep
                templates={templates}
                answers={answers}
                onPickAnswer={(questionId, answer) =>
                  setAnswers((prev) => ({ ...prev, [questionId]: answer }))
                }
              />
              <p className="text-xs text-slate-500">
                {answeredCount}/{templates.length} questions answered — answers affect quote pricing
                and scope
              </p>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <ReviewStep
              title={title}
              mode={mode}
              roomType={roomType}
              description={description}
              dimensions={{
                length: Number(dimensions.length) || 3,
                width: Number(dimensions.width) || 3,
                height: Number(dimensions.height) || 2.4,
              }}
              answers={answers}
              templates={templates}
              photos={photos}
            />
          )}

          {/* Navigation */}
          <footer className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={() => (step === 1 ? handleClose() : setStep((prev) => prev - 1))}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep((prev) => Math.min(4, prev + 1))}
                disabled={step === 1 && !title.trim()}
                className="rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={save}
                disabled={generating}
                className="rounded-lg bg-green-700 px-6 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {generating ? "⏳ Generating..." : "✅ Generate Document"}
              </button>
            )}
          </footer>
        </div>

        {generating && (
          <LoadingSpinner companyId={companyId} message="Generating your quote..." />
        )}
      </div>
    </div>
  );
}
