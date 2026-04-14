import React, { useState } from "react";
import { Variation, Project } from "../../types/domain";
import { UserCheck, Activity, Printer, CheckCircle, Send, History } from "lucide-react";
import { BuilderView } from "./BuilderView";
import { CustomerView } from "./CustomerView";
import { ProgressHub } from "./ProgressHub";
import { ReportSendModal } from "./ReportSendModal";
import { COMPANIES } from "../../constants/companies";

interface VariationReportProps {
  variation: Variation;
  project: Project;
  companyId?: string;
  onUpdateVariation: (updated: Variation) => void;
  onClose: () => void;
}

export const VariationReport: React.FC<VariationReportProps> = ({
  variation,
  project,
  companyId,
  onUpdateVariation,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"builder" | "customer" | "progress" | "print">("builder");
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const selectedSolution = variation.solutions[variation.selectedSolution] || variation.solutions[0];
  const totalBuilderCost = selectedSolution ? selectedSolution.builderCost : 0;
  const totalClientCost = selectedSolution ? selectedSolution.clientCost : 0;
  const totalMargin = totalClientCost - totalBuilderCost;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-6xl bg-slate-950 h-full flex flex-col shadow-2xl animate-slide-in overflow-hidden border-l border-slate-800">
        
        {/* Top bar with quick stats and tab selectors */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition"
            >
              Back
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {variation.title}
                </h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  variation.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  variation.status === "rejected" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                  "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {variation.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {project.name} • {variation.mode.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center space-x-6 bg-slate-950/50 border border-slate-800/80 rounded-xl px-4 py-2">
            <div>
              <p className="text-xs text-slate-500">Builder Cost</p>
              <p className="text-sm font-semibold text-white">${totalBuilderCost.toLocaleString()}</p>
            </div>
            <div className="h-6 w-[1px] bg-slate-800"></div>
            <div>
              <p className="text-xs text-slate-500">Client Cost</p>
              <p className="text-sm font-semibold text-emerald-400">${totalClientCost.toLocaleString()}</p>
            </div>
            <div className="h-6 w-[1px] bg-slate-800"></div>
            <div>
              <p className="text-xs text-slate-500">Gross Margin</p>
              <p className="text-sm font-semibold text-amber-400">
                ${totalMargin.toLocaleString()} 
                <span className="text-xs text-slate-600 ml-1">
                  ({totalClientCost > 0 ? Math.round((totalMargin / totalClientCost) * 100) : 0}%)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSendModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Report</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-6 flex space-x-1">
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition ${
              activeTab === "builder"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Builder Actions & Logs</span>
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition ${
              activeTab === "customer"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer View & Signing</span>
          </button>
          {variation.status === "approved" && (
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition ${
                activeTab === "progress"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              <History className="w-4 h-4" />
              <span>📸 Progress</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("print")}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition ${
              activeTab === "print"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print & PDF Options</span>
          </button>
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
          {activeTab === "builder" && (
            <BuilderView 
              variation={variation} 
              onUpdateVariation={onUpdateVariation} 
            />
          )}

          {activeTab === "customer" && (
            <CustomerView 
              variation={variation} 
              project={project} 
              companyLogo={companyId ? COMPANIES[companyId]?.logo : Object.values(COMPANIES)[0]?.logo}
              companyName={companyId ? COMPANIES[companyId]?.name : Object.values(COMPANIES)[0]?.name}
              onUpdateVariation={onUpdateVariation} 
            />
          )}

          {activeTab === "progress" && (
            <ProgressHub 
              variation={variation} 
              project={project}
              onUpdateVariation={onUpdateVariation} 
            />
          )}

          {activeTab === "print" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
                <Printer className="w-12 h-12 text-indigo-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">Document Generation Center</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Generate print-ready PDFs and beautifully formatted quotes for distribution. Standard layout includes complete scope, pricing, terms, and signature lines.
                </p>
                <div className="pt-4 flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-600/20"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print Standard Layout</span>
                  </button>
                </div>
              </div>

              {/* Sample print layout rendering */}
              <div className="bg-white text-slate-900 p-12 rounded-xl shadow-2xl space-y-6">
                <div className="border-b-2 border-slate-200 pb-6 flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                      {variation.mode === "quote" ? "PROJECT QUOTE" : "VARIATION REPORT"}
                    </h1>
                    <p className="text-slate-500 mt-1">Ref: {variation.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-slate-700 mt-4 font-medium">{project.name}</p>
                    <p className="text-slate-500">{project.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">Prepared For:</p>
                    <p className="text-slate-700">{project.customerName}</p>
                    <p className="text-slate-500">{project.customerEmail}</p>
                    <p className="text-slate-400 text-sm mt-4">Date: {new Date(variation.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Scope of Works</h3>
                  <p className="text-slate-700 whitespace-pre-wrap">{variation.description}</p>
                  {variation.elaboratedDescription && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-slate-600 text-sm italic">{variation.elaboratedDescription}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Pricing Breakdown</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    {selectedSolution?.stages.map(stage => (
                      <div key={stage.id} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-600">{stage.name}</span>
                        <span className="font-semibold text-slate-800">${stage.clientCost.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t-2 border-slate-200 font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">${totalClientCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {variation.status === "approved" && (
                  <div className="pt-8 border-t border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold">
                      <CheckCircle className="w-5 h-5" />
                      <span>APPROVED & SIGNED</span>
                    </div>
                    {variation.customerSignature && (
                      <div className="border border-slate-200 p-4 rounded-lg max-w-xs bg-slate-50">
                        <img src={variation.customerSignature} alt="Signature" className="h-16 object-contain" />
                        <p className="text-xs text-slate-500 mt-2">Signed securely by customer</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Send Modal */}
        {sendModalOpen && (
          <ReportSendModal 
            variation={variation}
            project={project}
            onUpdateVariation={onUpdateVariation}
            onClose={() => setSendModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
