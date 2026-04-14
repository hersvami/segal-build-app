import React, { useState } from "react";
import { Variation, Project } from "../../types/domain";
import { CheckCircle, Award } from "lucide-react";
interface CustomerViewProps {
  variation: Variation;
  project: Project;
  companyLogo?: string;
  companyName?: string;
  onUpdateVariation: (updated: Variation) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  variation,
  project,
  companyLogo,
  companyName,
  onUpdateVariation,
}) => {
  const [comment, setComment] = useState(variation.customerComment || "");
  const [rejectReason, setRejectReason] = useState(variation.rejectionReason || "");
  const [signatureName, setSignatureName] = useState("");

  const selectedSolution = variation.solutions[variation.selectedSolution] || variation.solutions[0];
  const totalClientCost = selectedSolution ? selectedSolution.clientCost : 0;

  const handleApprove = () => {
    if (!signatureName.trim()) {
      alert("Please sign (type your full name) to approve the quote/variation.");
      return;
    }

    onUpdateVariation({
      ...variation,
      status: "approved",
      customerComment: comment,
      customerSignature: signatureName,
      approvedAt: new Date().toISOString(),
      changeLog: [
        ...(variation.changeLog || []),
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          actor: "customer",
          actorName: project.customerName,
          action: "Customer approved and signed the document",
        }
      ]
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide feedback for changes.");
      return;
    }

    onUpdateVariation({
      ...variation,
      status: "pending",
      rejectionReason: rejectReason,
      // Clear status-specific timestamps if moving back to pending
      rejectedAt: undefined, 
      customerComment: rejectReason,
      changeLog: [
        ...(variation.changeLog || []),
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          actor: "customer",
          actorName: project.customerName,
          action: `Customer requested revisions: ${rejectReason}`,
        }
      ]
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Visual Quote / Variation Document presentation */}
      <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {companyLogo && (
              <img src={companyLogo} alt={companyName || "Company"} className="h-14 w-14 object-contain rounded-xl border border-slate-700 bg-white p-1 shadow" />
            )}
            <div>
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                {variation.mode === "quote" ? "Project Quote" : "Project Variation"}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{variation.title}</h2>
              <p className="text-slate-400 mt-2 text-sm">{project.name}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              variation.status === "approved" ? "bg-emerald-500/10 text-emerald-400" :
              variation.status === "rejected" ? "bg-rose-500/10 text-rose-400" :
              "bg-amber-500/10 text-amber-400"
            }`}>
              {variation.status}
            </span>
            <p className="text-xs text-slate-500 mt-3">Ref: {variation.id.slice(0,8).toUpperCase()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Scope & Objectives</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{variation.description}</p>
          {variation.elaboratedDescription && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <p className="text-sm text-slate-400 italic leading-relaxed">{variation.elaboratedDescription}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-lg font-bold text-white">Pricing & Stage Breakdown</h3>
          <div className="divide-y divide-slate-800 border-t border-b border-slate-800 py-2">
            {selectedSolution?.stages.map(stage => (
              <div key={stage.id} className="flex justify-between items-center py-3">
                <span className="text-slate-300 text-sm">{stage.name}</span>
                <span className="text-white font-medium">${stage.clientCost.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-white">Total Estimated Cost</span>
            <span className="text-2xl font-black text-indigo-400">${totalClientCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Guarantee/Seal */}
        <div className="bg-slate-950 border border-indigo-500/20 rounded-xl p-4 flex items-center space-x-4">
          <Award className="w-8 h-8 text-indigo-400 flex-shrink-0" />
          <p className="text-xs text-slate-400">
            Work performed meets all local regulations and comes with our standard structural and workmanship guarantee. Valid for 30 days from date of issue.
          </p>
        </div>
      </div>

      {/* Signing & Action Panel */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Customer Sign-off</h3>

          {/* Comment/Feedback input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Customer Feedback / Comment
            </label>
            <textarea
              placeholder="Leave a note or special instructions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
              rows={3}
            />
          </div>

              {variation.status === "approved" ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-400">Successfully Approved</p>
                  <p className="text-xs text-slate-400">Signed by: {variation.customerSignature}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase">
                      Digital Signature (Type Full Name)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleApprove}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve & Sign</span>
                  </button>

                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Notes for builder..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={handleReject}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium py-2 rounded-xl text-xs transition"
                    >
                      Request Changes
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
