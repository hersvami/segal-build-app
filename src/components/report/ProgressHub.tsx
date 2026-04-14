import React, { useState, useRef } from "react";
import { Variation, Project, ProgressPhoto, ProgressUpdate } from "../../types/domain";
import { uploadImageToCloudinary } from "../../logic/cloudinaryService";
import {
  Camera,
  Send,
  CheckCircle2,
  Clock,
  ImagePlus,
  Sparkles,
  Trash2,
  MessageSquare,
  Mail,
  Phone,
  ChevronRight,
  BarChart3,
  Upload,
  X,
} from "lucide-react";

interface ProgressHubProps {
  variation: Variation;
  project: Project;
  onUpdateVariation: (updated: Variation) => void;
}

type StageStatus = "not_started" | "in_progress" | "complete";

const STATUS_LABELS: Record<StageStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  complete: "Complete",
};

const STATUS_COLORS: Record<StageStatus, { bg: string; text: string; dot: string }> = {
  not_started: { bg: "bg-slate-700/50", text: "text-slate-400", dot: "bg-slate-500" },
  in_progress: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500" },
  complete: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
};

const NEXT_STATUS: Record<StageStatus, StageStatus> = {
  not_started: "in_progress",
  in_progress: "complete",
  complete: "not_started",
};

export const ProgressHub: React.FC<ProgressHubProps> = ({
  variation,
  project,
  onUpdateVariation,
}) => {
  const [activeSection, setActiveSection] = useState<"photos" | "stages" | "updates">("photos");

  // --- Photo state ---
  const [photoCaption, setPhotoCaption] = useState("");
  const [selectedStageTag, setSelectedStageTag] = useState("General");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analyzingPhotoId, setAnalyzingPhotoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Update state ---
  const [updateMessage, setUpdateMessage] = useState("");
  const [attachPhotoToUpdate, setAttachPhotoToUpdate] = useState<string | null>(null);
  const [sendVia, setSendVia] = useState<"sms" | "whatsapp" | "email" | "copy">("copy");

  const selectedSolution = variation.solutions[variation.selectedSolution] || variation.solutions[0];
  const stages = selectedSolution?.stages?.filter((s) => s.isSelected) || [];
  const stageProgress: Record<string, string> = variation.stageProgress || {};

  const customerFirstName = project.customerName?.split(" ")[0] || "Customer";

  // ==========================================
  // SECTION 1: Progress Photos
  // ==========================================

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async () => {
    if (!photoCaption.trim() && !photoPreview) return;

    setIsUploading(true);
    let uploadedUrl = "";
    let publicId = "";

    try {
      if (photoPreview) {
        const result = await uploadImageToCloudinary(
          photoPreview,
          project.name || "unnamed-project"
        );
        uploadedUrl = result.url;
        publicId = result.publicId;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Photo upload failed. Please try again.");
      setIsUploading(false);
      return;
    }

    const newPhoto: ProgressPhoto = {
      id: crypto.randomUUID(),
      url: uploadedUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80",
      publicId: publicId,
      caption: photoCaption || "Site photo",
      stageTag: selectedStageTag,
      aiAnalysis: "",
      takenAt: new Date().toISOString(),
    };

    onUpdateVariation({
      ...variation,
      progressPhotos: [...(variation.progressPhotos || []), newPhoto],
    });

    setPhotoCaption("");
    setPhotoPreview(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePhoto = (photoId: string) => {
    onUpdateVariation({
      ...variation,
      progressPhotos: (variation.progressPhotos || []).filter((p) => p.id !== photoId),
    });
  };

  const handleAiAnalysis = (photoId: string) => {
    setAnalyzingPhotoId(photoId);
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      const analyses = [
        "AI analysis: Demolition phase appears complete. Structural framework intact. No visible defects detected.",
        "AI analysis: Plastering work in progress. Surface preparation looks adequate. Recommend checking moisture levels before next coat.",
        "AI analysis: Tiling installation approximately 70% complete. Grout lines appear consistent. Waterproofing membrane visible in untiled areas.",
        "AI analysis: Framing completed to standard. Noggins correctly spaced. Ready for sheeting and insulation.",
        "AI analysis: Paint preparation stage. Surfaces sanded and primed. Recommend second primer coat on patched areas.",
        "AI analysis: Electrical rough-in visible. Cable runs comply with AS/NZS 3000 spacing requirements. Await certification.",
      ];
      const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];

      onUpdateVariation({
        ...variation,
        progressPhotos: (variation.progressPhotos || []).map((p) =>
          p.id === photoId ? { ...p, aiAnalysis: randomAnalysis } : p
        ),
      });
      setAnalyzingPhotoId(null);
    }, 1500);
  };

  // ==========================================
  // SECTION 2: Stage Progress Tracker
  // ==========================================

  const handleToggleStageStatus = (stageId: string) => {
    const currentStatus = (stageProgress[stageId] || "not_started") as StageStatus;
    const nextStatus = NEXT_STATUS[currentStatus];

    onUpdateVariation({
      ...variation,
      stageProgress: {
        ...stageProgress,
        [stageId]: nextStatus,
      },
    });
  };

  const completedCount = stages.filter(
    (s) => (stageProgress[s.id] || "not_started") === "complete"
  ).length;
  const inProgressCount = stages.filter(
    (s) => (stageProgress[s.id] || "not_started") === "in_progress"
  ).length;
  const overallPercent =
    stages.length > 0
      ? Math.round(
          ((completedCount + inProgressCount * 0.5) / stages.length) * 100
        )
      : 0;

  // ==========================================
  // SECTION 3: Progress Updates
  // ==========================================

  const generatePrefilledMessage = (): string => {
    const completedStages = stages
      .filter((s) => (stageProgress[s.id] || "not_started") === "complete")
      .map((s) => s.name);
    const inProgressStages = stages
      .filter((s) => (stageProgress[s.id] || "not_started") === "in_progress")
      .map((s) => s.name);

    let msg = `Hi ${customerFirstName}, update on your ${variation.roomType || "project"}:`;

    if (completedStages.length > 0) {
      msg += ` ${completedStages.join(", ")} ${completedStages.length === 1 ? "is" : "are"} complete!`;
    }
    if (inProgressStages.length > 0) {
      msg += ` ${inProgressStages.join(", ")} ${inProgressStages.length === 1 ? "is" : "are"} currently in progress.`;
    }
    if (completedStages.length === 0 && inProgressStages.length === 0) {
      msg += " Work is progressing well. We'll keep you updated!";
    }

    if (attachPhotoToUpdate) {
      msg += " See photo attached.";
    }

    return msg;
  };

  const handleSendUpdate = () => {
    const message = updateMessage.trim() || generatePrefilledMessage();
    if (!message) return;

    const newUpdate: ProgressUpdate = {
      id: crypto.randomUUID(),
      message,
      attachedPhotoUrl: attachPhotoToUpdate || undefined,
      sentAt: new Date().toISOString(),
      sentVia: sendVia,
    };

    onUpdateVariation({
      ...variation,
      progressUpdates: [...(variation.progressUpdates || []), newUpdate],
    });

    setUpdateMessage("");
    setAttachPhotoToUpdate(null);
  };

  const sectionTabs = [
    { key: "photos" as const, label: "📸 Progress Photos", icon: Camera, count: (variation.progressPhotos || []).length },
    { key: "stages" as const, label: "📊 Stage Tracker", icon: BarChart3, count: stages.length },
    { key: "updates" as const, label: "📢 Send Updates", icon: Send, count: (variation.progressUpdates || []).length },
  ];

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex space-x-2">
        {sectionTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === tab.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeSection === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========== SECTION 1: Progress Photos ========== */}
      {activeSection === "photos" && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-indigo-400" />
              <span>Upload Progress Photos</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Upload + Preview */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center space-y-3 transition group cursor-pointer"
                >
                  {photoPreview ? (
                    <div className="relative w-full">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-800 group-hover:bg-indigo-600/20 p-4 rounded-xl transition">
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-300">
                          Take photo or select from gallery
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          JPG, PNG up to 10MB
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Right: Caption + Stage Tag */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Caption / Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Demolition complete, ready for framing..."
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    🏷️ Stage Tag
                  </label>
                  <select
                    value={selectedStageTag}
                    onChange={(e) => setSelectedStageTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="General">General / Overview</option>
                    <option value="Demolition">Demolition</option>
                    <option value="Framing">Framing</option>
                    <option value="Plastering">Plastering</option>
                    <option value="Tiling">Tiling</option>
                    <option value="Painting">Painting</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.name}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    📅 Date
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400">
                    {new Date().toLocaleDateString("en-AU", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <button
                  onClick={handleAddPhoto}
                  disabled={isUploading || (!photoCaption.trim() && !photoPreview)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 disabled:shadow-none"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>{isUploading ? "Uploading..." : "Add Progress Photo"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>
                Photo Gallery ({(variation.progressPhotos || []).length} photos)
              </span>
            </h4>

            {(variation.progressPhotos || []).length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  No progress photos yet. Upload your first site photo above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(variation.progressPhotos || []).map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden group hover:border-indigo-500/50 transition"
                  >
                    {/* Photo */}
                    <div className="relative">
                      <img
                        src={photo.data || photo.url || ""}
                        alt={photo.caption}
                        className="w-full h-40 object-cover"
                      />
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleAiAnalysis(photo.id)}
                          disabled={analyzingPhotoId === photo.id}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg text-xs font-medium flex items-center space-x-1"
                        >
                          <Sparkles className={`w-3 h-3 ${analyzingPhotoId === photo.id ? "animate-spin" : ""}`} />
                          <span>{analyzingPhotoId === photo.id ? "Analyzing..." : "AI Analyze"}</span>
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Date stamp overlay */}
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md font-medium">
                        📅{" "}
                        {new Date(photo.takenAt).toLocaleDateString("en-AU", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="p-3 space-y-2">
                      <span className="inline-block text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                        🏷️ {photo.stageTag}
                      </span>
                      <p className="text-xs text-white font-medium leading-snug">
                        📝 {photo.caption}
                      </p>
                      {photo.aiAnalysis && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 mt-1">
                          <p className="text-[10px] text-emerald-400 font-medium flex items-start space-x-1">
                            <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>{photo.aiAnalysis}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== SECTION 2: Stage Progress Tracker ========== */}
      {activeSection === "stages" && (
        <div className="space-y-6">
          {/* Overall Progress Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Overall Progress</span>
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-emerald-400 font-bold">{completedCount} Complete</span>
                <span className="text-amber-400 font-medium">{inProgressCount} In Progress</span>
                <span className="text-slate-500">{stages.length - completedCount - inProgressCount} Not Started</span>
              </div>
            </div>

            {/* Big progress bar */}
            <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {overallPercent}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Stage List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
              Approved Stages
            </h4>

            {stages.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No stages found in the approved solution.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stages.map((stage, index) => {
                  const status = (stageProgress[stage.id] || "not_started") as StageStatus;
                  const colors = STATUS_COLORS[status];

                  return (
                    <div
                      key={stage.id}
                      className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 hover:border-slate-700 transition group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{stage.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {stage.trade} • {stage.durationDays} days • ${stage.clientCost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStageStatus(stage.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${colors.bg} ${colors.text} hover:brightness-110 border border-transparent hover:border-slate-700`}
                      >
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span>{STATUS_LABELS[status]}</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer visibility note */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-300">Customer Visible</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Stage progress is visible in the Customer View. Your client can track which stages
                are complete at any time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== SECTION 3: Progress Updates (Send to Customer) ========== */}
      {activeSection === "updates" && (
        <div className="space-y-6">
          {/* Compose Update */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Send Progress Update to Customer</span>
            </h3>

            <div className="space-y-4">
              {/* Pre-fill button */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setUpdateMessage(generatePrefilledMessage())}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-lg transition font-medium flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-generate message</span>
                </button>
                <span className="text-xs text-slate-600">
                  Pre-fills based on current stage progress
                </span>
              </div>

              {/* Message textarea */}
              <textarea
                placeholder={`Hi ${customerFirstName}, update on your ${variation.roomType || "project"}...`}
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition min-h-[120px]"
                rows={5}
              />

              {/* Attach Photo */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Attach Photo (optional)
                </label>
                {(variation.progressPhotos || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAttachPhotoToUpdate(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        !attachPhotoToUpdate
                          ? "bg-slate-700 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      None
                    </button>
                    {(variation.progressPhotos || []).map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() =>
                          setAttachPhotoToUpdate(photo.data || photo.url || null)
                        }
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          attachPhotoToUpdate === (photo.data || photo.url)
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        <Camera className="w-3 h-3" />
                        <span>{photo.caption.slice(0, 20)}{photo.caption.length > 20 ? "..." : ""}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">
                    No progress photos uploaded yet. Go to Progress Photos tab to add some.
                  </p>
                )}
              </div>

              {/* Send Via Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Send Via
                </label>
                <div className="flex space-x-2">
                  {[
                    { key: "sms" as const, label: "📱 SMS", icon: Phone },
                    { key: "whatsapp" as const, label: "💬 WhatsApp", icon: MessageSquare },
                    { key: "email" as const, label: "📧 Email", icon: Mail },
                    { key: "copy" as const, label: "📋 Copy", icon: CheckCircle2 },
                  ].map((channel) => (
                    <button
                      key={channel.key}
                      onClick={() => setSendVia(channel.key)}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        sendVia === channel.key
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span>{channel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSendUpdate}
                  disabled={!updateMessage.trim()}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20 disabled:shadow-none"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    Send Update via {sendVia === "sms" ? "SMS" : sendVia === "whatsapp" ? "WhatsApp" : sendVia === "email" ? "Email" : "Clipboard"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Update History */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Update History ({(variation.progressUpdates || []).length})</span>
            </h4>

            {(variation.progressUpdates || []).length === 0 ? (
              <div className="text-center py-8">
                <Send className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No updates sent yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...(variation.progressUpdates || [])]
                  .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                  .map((update) => (
                    <div
                      key={update.id}
                      className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              update.sentVia === "sms"
                                ? "bg-blue-500/10 text-blue-400"
                                : update.sentVia === "whatsapp"
                                ? "bg-green-500/10 text-green-400"
                                : update.sentVia === "email"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {update.sentVia === "sms" ? (
                              <Phone className="w-4 h-4" />
                            ) : update.sentVia === "whatsapp" ? (
                              <MessageSquare className="w-4 h-4" />
                            ) : update.sentVia === "email" ? (
                              <Mail className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-200 leading-relaxed">{update.message}</p>
                            {update.attachedPhotoUrl && (
                              <div className="mt-2">
                                <img
                                  src={update.attachedPhotoUrl}
                                  alt="Attached"
                                  className="h-20 w-auto rounded-lg border border-slate-800"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-400 text-[10px] font-semibold">SENT</span>
                        </div>
                      </div>
                      <div className="mt-2 ml-11">
                        <span className="text-[10px] text-slate-500">
                          Sent via {update.sentVia.toUpperCase()} •{" "}
                          {new Date(update.sentAt).toLocaleString("en-AU", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
