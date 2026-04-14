import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ProjectForm } from "./components/ProjectForm";
import { SendWelcomeEmailModal } from "./components/SendWelcomeEmailModal";
import { VariationBuilder } from "./components/VariationBuilder";
import { usePersistedAppState } from "./logic/usePersistedAppState";
import { useProjectWorkspace } from "./logic/useProjectWorkspace";
import { Lock, RotateCcw, PenTool, MessageSquare, History, Mail, FileCheck } from "lucide-react";
import { COMPANIES } from "./constants/companies";

export default function App() {
  const { state, setState } = usePersistedAppState();
  const {
    selectedProject,
    selectedProjectId,
    activeVariationId,
    setSelectedProjectId,
    setActiveVariationId,
    createProject,
    upsertVariation,
    deleteProject,
    updateVariationStatus,
    updateVariation,
    createVariationRevision,
  } = useProjectWorkspace(state, setState);

  const [showNewProject, setShowNewProject] = useState(false);
  const [newlyCreatedProject, setNewlyCreatedProject] = useState<any | null>(null);
  const [showVariationBuilder, setShowVariationBuilder] = useState(false);
  const [customerComment, setCustomerComment] = useState("");
  const [signatureData, setSignatureData] = useState("");
  const [activeTab, setActiveTab] = useState<"builder" | "customer" | "log">("builder");

  const currentCompany = COMPANIES[state.companyId] ?? Object.values(COMPANIES)[0];
  const activeVariation = selectedProject?.variations.find((v) => v.id === activeVariationId);

  const isLocked = activeVariation?.status === "approved" || activeVariation?.status === "rejected";

  const handleApprove = () => {
    if (!activeVariation || !selectedProject) return;
    if (!signatureData) {
      alert("Please sign before approving.");
      return;
    }
    const updated = {
      ...activeVariation,
      status: "approved" as const,
      customerSignature: signatureData,
      customerComment: customerComment,
    };
    updateVariation(selectedProject.id, activeVariation.id, updated);
    updateVariationStatus(selectedProject.id, activeVariation.id, "approved", "Customer approved and signed the quote.");
    setSignatureData("");
    setCustomerComment("");
  };

  const handleRequestRevision = () => {
    if (!activeVariation || !selectedProject) return;
    updateVariationStatus(selectedProject.id, activeVariation.id, "pending", "Customer requested a revised quote.");
    createVariationRevision(selectedProject.id, activeVariation);
    alert("Revision created! A second chance has been given to the builder.");
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800 antialiased select-none">
      <Sidebar
        state={state}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onDeleteProject={deleteProject}
        onCreateProjectClick={() => setShowNewProject(true)}
        onChangeCompany={(id) => setState((prev) => ({ ...prev, companyId: id }))}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header / Banner */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {selectedProject ? selectedProject.name : "Builder Dashboard"}
            </h1>
            <p className="text-xs text-slate-500">
              {selectedProject
                ? `${selectedProject.customerName} - ${selectedProject.address}`
                : "Select or create a project to get started"}
            </p>
          </div>
          {selectedProject && (
            <button
              onClick={() => setShowVariationBuilder(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <FilePlusIcon /> Add Variation / Quote
            </button>
          )}
        </header>

        {/* Content Area */}
        {showNewProject ? (
          <div className="flex-1 p-8 max-w-2xl mx-auto w-full">
            <ProjectForm
              onSubmit={(p) => {
                createProject(p);
                setShowNewProject(false);
                setNewlyCreatedProject(p);
              }}
              onCancel={() => setShowNewProject(false)}
            />
          </div>
        ) : (
          newlyCreatedProject && (
            <SendWelcomeEmailModal
              project={newlyCreatedProject}
              onClose={() => setNewlyCreatedProject(null)}
            />
          )
        )}
        
        {showVariationBuilder && selectedProject ? (
          <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <VariationBuilder
              onSave={(v) => {
                upsertVariation(selectedProject!.id, v);
                setShowVariationBuilder(false);
              }}
              onCancel={() => setShowVariationBuilder(false)}
            />
          </div>
        ) : !selectedProject ? (
          <WelcomeScreen
            companyName={currentCompany.name}
            companyLogo={currentCompany.logo}
            onCreateProjectClick={() => setShowNewProject(true)}
          />
        ) : (
          /* Project Variations Board & Report Panel */
          <div className="flex-1 p-8 flex gap-8">
            {/* Variations Sidebar list inside project */}
            <div className="w-1/3 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col h-full shadow-sm">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Variations / Quotes</h2>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {selectedProject.variations.length === 0 && (
                  <div className="text-center py-12 text-sm text-slate-400">
                    No variations found for this project.
                  </div>
                )}
                {selectedProject.variations.map((v) => {
                  const isActive = v.id === activeVariationId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveVariationId(v.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isActive
                          ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                          : "border-slate-100 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800 text-sm">{v.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                          v.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : v.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{v.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Variation/Report Viewer */}
            {activeVariation ? (
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col h-full overflow-hidden shadow-sm">
                {/* Status Banner */}
                {isLocked && (
                  <div className="bg-green-600 text-white px-6 py-3 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <Lock size={16} /> Locked / Approved Document
                    </div>
                    {activeVariation.customerSignature && (
                      <span className="text-xs bg-green-700 px-3 py-1 rounded-full">✓ Digitally Signed</span>
                    )}
                  </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 gap-2">
                  <button
                    onClick={() => setActiveTab("builder")}
                    className={`py-4 px-4 border-b-2 font-semibold text-sm transition-colors ${
                      activeTab === "builder"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Builder Scope & Solutions
                  </button>
                  <button
                    onClick={() => setActiveTab("customer")}
                    className={`py-4 px-4 border-b-2 font-semibold text-sm transition-colors ${
                      activeTab === "customer"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Interactive Customer View
                  </button>
                  <button
                    onClick={() => setActiveTab("log")}
                    className={`py-4 px-4 border-b-2 font-semibold text-sm transition-colors ${
                      activeTab === "log"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Change Log / History
                  </button>
                </div>

                {/* Tab Views */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {activeTab === "builder" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{activeVariation.title}</h2>
                          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                            Mode: {activeVariation.mode} • Created: {new Date(activeVariation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scope & Details</h3>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{activeVariation.elaboratedDescription || activeVariation.description}</p>
                      </div>

                      {activeVariation.solutions && activeVariation.solutions.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Proposed Solutions & Quotes</h3>
                          <div className="space-y-4">
                            {activeVariation.solutions.map((sol, idx) => {
                              const isSelected = activeVariation.selectedSolution === idx;
                              return (
                                <div key={idx} className={`p-4 rounded-xl border ${
                                  isSelected ? "border-indigo-500 bg-indigo-50/20" : "border-slate-200"
                                }`}>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-800">{sol.title}</span>
                                    <span className="text-lg font-extrabold text-indigo-600">${sol.clientCost.toLocaleString()}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 mb-3">{sol.description}</p>
                                  <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Included Trades & Stages</div>
                                    {sol.stages.map((st, i) => (
                                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                                        <span className="text-slate-600">{st.name}</span>
                                        <span className="font-medium text-slate-700">${st.clientCost.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "customer" && (
                    <div className="space-y-8">
                      {/* Letterhead & Branding */}
                      <div className="border-b-2 border-indigo-600 pb-4 flex justify-between items-end">
                        <div className="flex items-center gap-4">
                          {currentCompany.logo && (
                            <img src={currentCompany.logo} alt={currentCompany.name} className="h-14 w-14 object-contain rounded-xl shadow-md border border-slate-200" />
                          )}
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{currentCompany.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{currentCompany.tagline}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Customer Quote / Variation</p>
                          <h4 className="text-lg font-bold text-indigo-600 mt-1">{activeVariation.title}</h4>
                        </div>
                      </div>

                      {/* Customer / Project Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase">Customer</div>
                          <div className="font-semibold text-slate-800 mt-1">{selectedProject.customerName}</div>
                          <div className="text-slate-500 text-xs">{selectedProject.customerEmail}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase">Site Address</div>
                          <div className="font-semibold text-slate-800 mt-1">{selectedProject.address}</div>
                        </div>
                      </div>

                      {/* Selected Solution Full Breakdown */}
                      {activeVariation.solutions[activeVariation.selectedSolution ?? 0] && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-800">Selected Solution Scope</span>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-semibold">
                              {activeVariation.solutions[activeVariation.selectedSolution ?? 0].title}
                            </span>
                          </div>
                          <div className="p-4 space-y-4">
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{activeVariation.elaboratedDescription}</p>

                            <div className="border border-slate-100 rounded-lg overflow-hidden">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                    <th className="p-3">Stage / Activity</th>
                                    <th className="p-3 text-right">Estimated Cost</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activeVariation.solutions[activeVariation.selectedSolution ?? 0].stages.map((st, i) => (
                                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                      <td className="p-3 text-slate-700">{st.name}</td>
                                      <td className="p-3 text-right font-medium text-slate-800">${st.clientCost.toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                              <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Quote</span>
                              <span className="text-xl font-extrabold text-indigo-600">
                                ${activeVariation.solutions[activeVariation.selectedSolution ?? 0].clientCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Section for Customer Actions & Sign-off */}
                      {!isLocked && (
                        <div className="border border-indigo-100 bg-indigo-50/30 p-6 rounded-2xl space-y-6">
                          <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                            <PenTool size={16} /> Customer Sign-Off & Approval
                          </h4>

                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Leave feedback or comments for the builder</label>
                            <textarea
                              value={customerComment}
                              onChange={(e) => setCustomerComment(e.target.value)}
                              placeholder="Any special requests or instructions before approving..."
                              className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-2">Digital Signature (Type full name to sign)</label>
                            <input
                              type="text"
                              value={signatureData}
                              onChange={(e) => setSignatureData(e.target.value)}
                              placeholder="Type your full legal name to electronically sign..."
                              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 font-medium"
                            />
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={handleApprove}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all text-sm"
                            >
                              <FileCheck size={18} /> Approve & Digitally Sign
                            </button>
                            <button
                              onClick={handleRequestRevision}
                              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-100 transition-all text-sm"
                            >
                              <RotateCcw size={18} /> Request Revised Quote
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Native Communication / Contact shortcuts */}
                      <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Options</h4>
                        <div className="flex gap-3">
                          <a
                            href={`mailto:${selectedProject.customerEmail}?subject=Quote for ${activeVariation.title}`}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Mail size={14} /> Send Email
                          </a>
                          <a
                            href={`sms:?body=Hi ${selectedProject.customerName}, regarding your quote for ${activeVariation.title}`}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <MessageSquare size={14} /> Send SMS
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "log" && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <History size={16} /> Audit & Change Log
                      </h3>
                      <div className="space-y-3">
                        {activeVariation.status === "approved" && (
                          <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm">
                            <div className="font-semibold text-green-800">Quote Approved</div>
                            <div className="text-xs text-green-600 mt-0.5">Customer officially approved and digitally signed.</div>
                            <div className="text-[10px] text-green-500 mt-2">{new Date(activeVariation.createdAt).toLocaleString()}</div>
                          </div>
                        )}
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                          <div className="font-semibold text-slate-800">Variation Initialized</div>
                          <div className="text-xs text-slate-500 mt-0.5">Created by the builder as draft.</div>
                          <div className="text-[10px] text-slate-400 mt-2">{new Date(activeVariation.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                Select a variation to view its breakdown or add a new quote.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilePlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}
