import { useState } from "react";
import type { Project, Variation, ChangeLogEntry } from "../../types/domain";
import { BuilderView } from "./BuilderView";
import { CustomerView } from "./CustomerView";
import { ProgressHub } from "./ProgressHub";
import { ReportSendModal } from "./ReportSendModal";
import { COMPANIES } from "../../constants/companies";
import { generateId } from "../../utils/id";

type ViewMode = "builder" | "customer" | "progress";

interface VariationReportProps {
  project: Project;
  variation: Variation;
  onStatusChange: (status: Variation["status"], comment?: string) => void;
  onUpdateVariation?: (updated: Variation) => void;
  onCreateRevision?: (variation: Variation) => void;
  companyId?: string;
}

export function VariationReport({
  project,
  variation,
  onStatusChange,
  onUpdateVariation,
  onCreateRevision,
  companyId,
}: VariationReportProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("builder");
  const [showSendModal, setShowSendModal] = useState(false);
  const [signatureMode, setSignatureMode] = useState(false);

  const company = COMPANIES[companyId ?? "segal-build"] ?? COMPANIES["segal-build"];
  const selectedSolution = variation.solutions[variation.selectedSolution];

  const appendLog = (entry: ChangeLogEntry): Variation => ({
    ...variation,
    changeLog: [...(variation.changeLog ?? []), entry],
  });

  const makeBuilderLog = (action: string, detail?: string): ChangeLogEntry => ({
    id: generateId(),
    timestamp: new Date().toISOString(),
    actor: "builder",
    actorName: company.name,
    action,
    detail,
  });

  const handleStatusChange = (
    status: Variation["status"],
    comment = "",
    customerLog?: ChangeLogEntry
  ) => {
    const now = new Date().toISOString();
    const builderLog = makeBuilderLog(`Status changed to ${status}`, comment || undefined);
    const logs = customerLog ? [customerLog, builderLog] : [builderLog];
    const updated: Variation = {
      ...variation,
      status,
      customerComment: comment,
      ...(status === "rejected" ? { rejectionReason: comment, rejectedAt: now } : {}),
      changeLog: [...(variation.changeLog ?? []), ...logs],
    };
    onUpdateVariation?.(updated);
    onStatusChange(status, comment);
  };

  const handleSignatureApprove = (signature: string, customerLog: ChangeLogEntry) => {
    const builderLog = makeBuilderLog("Document locked — awaiting builder acknowledgement");
    const updated: Variation = {
      ...appendLog(customerLog),
      status: "approved",
      customerSignature: signature,
      approvedAt: new Date().toISOString(),
      changeLog: [...(variation.changeLog ?? []), customerLog, builderLog],
    };
    onUpdateVariation?.(updated);
    onStatusChange("approved");
  };

  const handleSendConfirm = (status: Variation["status"], comment: string) => {
    const log = makeBuilderLog("Sent to customer", `Via email to ${project.customerEmail}`);
    const updated: Variation = {
      ...variation,
      status,
      sentAt: new Date().toISOString(),
      changeLog: [...(variation.changeLog ?? []), log],
    };
    onUpdateVariation?.(updated);
    onStatusChange(status, comment);
    setShowSendModal(false);
  };

  const handleBuilderStatusChange = (status: Variation["status"], comment?: string) => {
    const safeComment = comment ?? "";
    const log = makeBuilderLog(`Marked as ${status}`, safeComment || undefined);
    const updated: Variation = {
      ...variation,
      status,
      customerComment: safeComment,
      changeLog: [...(variation.changeLog ?? []), log],
    };
    onUpdateVariation?.(updated);
    onStatusChange(status, safeComment);
  };

  // ── Tab bar ──
  const tabs: { id: ViewMode; label: string; emoji: string }[] = [
    { id: "builder", label: "Builder View", emoji: "🔧" },
    { id: "customer", label: "Customer Preview", emoji: "👤" },
    { id: "progress", label: "Progress", emoji: "📸" },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                viewMode === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode("customer");
              setTimeout(() => window.print(), 500);
            }}
            className="rounded-lg bg-blue-100 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-200"
          >
            💾 Save PDF
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
          >
            📧 Send to Customer
          </button>
        </div>
      </div>

      {/* Builder View */}
      {viewMode === "builder" && (
        <BuilderView
          variation={variation}
          project={project}
          onUpdateVariation={onUpdateVariation!}
          onStatusChange={handleBuilderStatusChange}
          onCreateRevision={onCreateRevision ? () => onCreateRevision(variation) : undefined}
          company={company}
          onSend={() => setShowSendModal(true)}
          setViewMode={(mode) => setViewMode(mode as ViewMode)}
        />
      )}

      {/* Customer View */}
      {viewMode === "customer" && (
        <CustomerView
          variation={variation}
          selectedSolution={selectedSolution}
          project={project}
          company={company}
          signatureMode={signatureMode}
          setSignatureMode={setSignatureMode}
          customerSignature={variation.customerSignature}
          onBackToBuilder={() => setViewMode("builder")}
          onSignatureApprove={handleSignatureApprove}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Progress Hub */}
      {viewMode === "progress" && (
        <ProgressHub
          variation={variation}
          project={project}
          onUpdateVariation={onUpdateVariation!}
        />
      )}

      {/* Send Modal */}
      {showSendModal && (
        <ReportSendModal
          project={project}
          variation={variation}
          selectedSolution={selectedSolution}
          company={company}
          onClose={() => setShowSendModal(false)}
          onStatusChange={handleSendConfirm}
        />
      )}
    </div>
  );
}
