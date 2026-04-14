import { useState, useRef } from "react";
import type { Variation, Project, ProgressPhoto, ProgressUpdate } from "../../types/domain";
import { compressImageToDataUrl, uploadPhotoToFirebase } from "../../logic/photoService";
import { analyzePhotoWithAI } from "../../gemini";
import { generateId } from "../../utils/id";

interface ProgressHubProps {
  variation: Variation;
  project: Project;
  onUpdateVariation: (updated: Variation) => void;
}

const STAGE_STATUS = ["Not Started", "In Progress", "Complete"] as const;
type StageStatus = typeof STAGE_STATUS[number];

const STATUS_COLORS: Record<StageStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Complete": "bg-green-100 text-green-700",
};

const STATUS_ICONS: Record<StageStatus, string> = {
  "Not Started": "○",
  "In Progress": "◑",
  "Complete": "✅",
};

export function ProgressHub({ variation, project, onUpdateVariation }: ProgressHubProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "stages" | "updates">("photos");
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressPhotos = variation.progressPhotos ?? [];
  const progressUpdates = variation.progressUpdates ?? [];
  const stageProgress = variation.stageProgress ?? {};
  const selectedSolution = variation.solutions[variation.selectedSolution];
  const activeStages = selectedSolution?.stages.filter((s) => s.isSelected) ?? [];

  // ── Calculate overall progress ──
  const completedCount = activeStages.filter(
    (s) => stageProgress[s.id] === "Complete"
  ).length;
  const progressPct = activeStages.length
    ? Math.round((completedCount / activeStages.length) * 100)
    : 0;

  // ── Photo Upload ──
  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newPhotos: ProgressPhoto[] = [...progressPhotos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const dataUrl = await compressImageToDataUrl(file);
        const url = await uploadPhotoToFirebase(dataUrl, project.id, variation.id);
        newPhotos.push({
          id: generateId(),
          url,
          data: dataUrl,
          caption: "",
          stageTag: "",
          aiAnalysis: "",
          takenAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Photo upload failed:", err);
      }
    }

    onUpdateVariation({ ...variation, progressPhotos: newPhotos });
    setUploading(false);
  };

  // ── AI Analysis ──
  const handleAnalyze = async (photo: ProgressPhoto) => {
    setAnalyzingId(photo.id);
    try {
      const analysis = await analyzePhotoWithAI(
        photo.data ?? photo.url ?? "",
        photo.caption || "Progress photo",
        variation.roomType,
        variation.title,
        variation.description
      );
      const updated = progressPhotos.map((p) =>
        p.id === photo.id ? { ...p, aiAnalysis: analysis } : p
      );
      onUpdateVariation({ ...variation, progressPhotos: updated });
    } catch (err) {
      console.error("AI analysis failed:", err);
    }
    setAnalyzingId(null);
  };

  // ── Update Caption ──
  const handleCaptionChange = (photoId: string, caption: string) => {
    const updated = progressPhotos.map((p) =>
      p.id === photoId ? { ...p, caption } : p
    );
    onUpdateVariation({ ...variation, progressPhotos: updated });
  };

  // ── Update Stage Tag ──
  const handleStageTag = (photoId: string, stageTag: string) => {
    const updated = progressPhotos.map((p) =>
      p.id === photoId ? { ...p, stageTag } : p
    );
    onUpdateVariation({ ...variation, progressPhotos: updated });
  };

  // ── Delete Photo ──
  const handleDeletePhoto = (photoId: string) => {
    const updated = progressPhotos.filter((p) => p.id !== photoId);
    onUpdateVariation({ ...variation, progressPhotos: updated });
  };

  // ── Stage Progress Toggle ──
  const handleStageToggle = (stageId: string) => {
    const current = (stageProgress[stageId] as StageStatus) ?? "Not Started";
    const currentIdx = STAGE_STATUS.indexOf(current);
    const next = STAGE_STATUS[(currentIdx + 1) % STAGE_STATUS.length];
    onUpdateVariation({
      ...variation,
      stageProgress: { ...stageProgress, [stageId]: next },
    });
  };

  // ── Send Progress Update ──
  const handleSendUpdate = (method: "sms" | "whatsapp" | "email" | "copy") => {
    if (!updateText.trim()) return;
    setSending(true);

    const update: ProgressUpdate = {
      id: generateId(),
      message: updateText,
      attachedPhotoUrl: updatePhoto ?? undefined,
      sentAt: new Date().toISOString(),
      sentVia: method,
    };

    const fullMessage = `Hi ${project.customerName},\n\nProgress update on ${project.name}:\n\n${updateText}\n\nKind regards,\nJames Segal\nSegal Build Pty Ltd\n📞 0414 222 203`;
    const encoded = encodeURIComponent(fullMessage);
    const phone = "61414222203";

    if (method === "sms") {
      window.location.href = `sms:${project.customerEmail}?body=${encoded}`;
    } else if (method === "whatsapp") {
      window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    } else if (method === "email") {
      const subject = encodeURIComponent(`Project Update — ${project.name}`);
      window.location.href = `mailto:${project.customerEmail}?subject=${subject}&body=${encoded}`;
    } else if (method === "copy") {
      navigator.clipboard.writeText(fullMessage).then(() =>
        alert("Update copied to clipboard!")
      );
    }

    const updatedUpdates = [update, ...progressUpdates];
    onUpdateVariation({ ...variation, progressUpdates: updatedUpdates });
    setUpdateText("");
    setUpdatePhoto(null);
    setSending(false);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">📸 Project Progress</h3>
          <p className="text-xs text-slate-500">{project.name} · {project.customerName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-red-800">{progressPct}%</p>
          <p className="text-xs text-slate-500">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full rounded-full bg-slate-100">
        <div
          className="h-3 rounded-full bg-red-700 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {completedCount} of {activeStages.length} stages complete
      </p>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { key: "photos", label: "📸 Photos", count: progressPhotos.length },
          { key: "stages", label: "📊 Stages", count: null },
          { key: "updates", label: "📢 Updates", count: progressUpdates.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === key
                ? "bg-red-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
            {count !== null && count > 0 && (
              <span className="ml-1 rounded-full bg-white/30 px-1.5 text-xs">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB: PHOTOS ── */}
      {activeTab === "photos" && (
        <div className="space-y-4">
          {/* Upload Buttons */}
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
              📷 Upload Photos
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handlePhotoUpload(e.target.files)}
              />
            </label>
            <label className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
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
                ⏳ Uploading...
              </span>
            )}
          </div>

          {/* Photo Grid */}
          {progressPhotos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
              <p className="text-sm text-slate-400">No progress photos yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload photos to document site progress</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {progressPhotos.map((photo) => (
                <div key={photo.id} className="rounded-xl border border-slate-200 overflow-hidden">
                  {/* Photo */}
                  <div className="relative">
                    <img
                      src={photo.url || photo.data}
                      alt="Progress"
                      className="h-48 w-full object-cover"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                      {new Date(photo.takenAt).toLocaleDateString("en-AU")}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-3 space-y-2">
                    {/* Stage Tag */}
                    <select
                      value={photo.stageTag}
                      onChange={(e) => handleStageTag(photo.id, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    >
                      <option value="">— Tag a stage —</option>
                      {activeStages.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>

                    {/* Caption */}
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                      placeholder="Add a caption..."
                      className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    />

                    {/* AI Analysis */}
                    {photo.aiAnalysis ? (
                      <div className="rounded-lg bg-purple-50 p-2 text-xs text-purple-800">
                        <p className="font-bold mb-1">🤖 AI Analysis:</p>
                        <p className="line-clamp-3">{photo.aiAnalysis}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAnalyze(photo)}
                        disabled={analyzingId === photo.id}
                        className="w-full rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-200 disabled:opacity-50"
                      >
                        {analyzingId === photo.id ? "⏳ Analysing..." : "🤖 AI Analyse Photo"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: STAGES ── */}
      {activeTab === "stages" && (
        <div className="space-y-2">
          {activeStages.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No active stages found</p>
          ) : (
            activeStages.map((stage) => {
              const status = (stageProgress[stage.id] as StageStatus) ?? "Not Started";
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageToggle(stage.id)}
                  className={`w-full rounded-xl border p-3 text-left transition hover:opacity-80 ${
                    status === "Complete"
                      ? "border-green-300 bg-green-50"
                      : status === "In Progress"
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{STATUS_ICONS[status]}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{stage.name}</p>
                        <p className="text-xs text-slate-500">{stage.trade} · {stage.durationDays} days</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_COLORS[status]}`}>
                      {status}
                    </span>
                  </div>
                </button>
              );
            })
          )}
          <p className="text-xs text-slate-400 text-center pt-2">
            Tap any stage to cycle: Not Started → In Progress → Complete
          </p>
        </div>
      )}

      {/* ── TAB: UPDATES ── */}
      {activeTab === "updates" && (
        <div className="space-y-4">
          {/* Compose Update */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-700">📢 Send Progress Update</h4>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder={`Hi ${project.customerName}, here's your latest site update...`}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
              rows={3}
            />

            {/* Attach Photo */}
            {progressPhotos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Attach a photo (optional):</p>
                <div className="flex flex-wrap gap-2">
                  {progressPhotos.slice(0, 6).map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setUpdatePhoto(
                        updatePhoto === (photo.url || photo.data)
                          ? null
                          : (photo.url || photo.data || null)
                      )}
                      className={`relative rounded-lg overflow-hidden border-2 transition ${
                        updatePhoto === (photo.url || photo.data)
                          ? "border-red-600"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={photo.url || photo.data}
                        alt=""
                        className="h-14 w-14 object-cover"
                      />
                      {updatePhoto === (photo.url || photo.data) && (
                        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Send Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSendUpdate("sms")}
                disabled={!updateText.trim() || sending}
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-50"
              >
                📱 SMS Customer
              </button>
              <button
                onClick={() => handleSendUpdate("whatsapp")}
                disabled={!updateText.trim() || sending}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                💬 WhatsApp
              </button>
              <button
                onClick={() => handleSendUpdate("email")}
                disabled={!updateText.trim() || sending}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                📧 Email Customer
              </button>
              <button
                onClick={() => handleSendUpdate("copy")}
                disabled={!updateText.trim() || sending}
                className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                📋 Copy
              </button>
            </div>
          </div>

          {/* Updates Timeline */}
          {progressUpdates.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700">📋 Update History</h4>
              {progressUpdates.map((update) => (
                <div key={update.id} className="rounded-xl border border-slate-200 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(update.sentAt).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                      via {update.sentVia.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{update.message}</p>
                  {update.attachedPhotoUrl && (
                    <img
                      src={update.attachedPhotoUrl}
                      alt="Attached"
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {progressUpdates.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
              <p className="text-sm text-slate-400">No updates sent yet</p>
              <p className="text-xs text-slate-400 mt-1">Send your first progress update above</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
