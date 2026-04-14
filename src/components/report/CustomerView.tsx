import React, { useState, useMemo } from "react";
import { Variation, Project } from "../../types/domain";
import { CheckCircle, Award, FileText, Shield } from "lucide-react";
import { calculateQuote, formatCurrency, type QuoteCalculation } from "../../utils/pricing/quoteCalculator";

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

  // Calculate pricing for display
  const pricing = variation.pricing;
  const quoteCalc: QuoteCalculation | null = useMemo(() => {
    if (variation.scopes && variation.scopes.length > 0) {
      return calculateQuote(
        variation.scopes,
        pricing?.overheadPercent || 12,
        pricing?.profitPercent || 15,
        pricing?.contingencyPercent || 10
      );
    }
    return null;
  }, [variation.scopes, pricing]);

  // Legacy fallback
  const selectedSolution = variation.solutions[variation.selectedSolution] || variation.solutions[0];
  const legacyTotal = selectedSolution ? selectedSolution.clientCost : 0;

  // Use saved pricing or calculated
  const displayTotal = pricing?.totalIncGst || quoteCalc?.totalIncGst || legacyTotal || 0;
  const displaySubtotal = pricing?.subtotalExGst || quoteCalc?.subtotalExGst || legacyTotal || 0;
  const displayGst = pricing?.gstAmount || quoteCalc?.gstAmount || 0;
  const displayContingency = pricing?.contingencyAmount || quoteCalc?.contingencyAmount || 0;

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

  const handleRequestChanges = () => {
    if (!rejectReason.trim()) {
      alert("Please provide feedback for changes.");
      return;
    }

    onUpdateVariation({
      ...variation,
      status: "pending",
      rejectionReason: rejectReason,
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

  // Collect all inclusions, exclusions, PC items across scopes
  const allInclusions = [
    ...(variation.scopes?.flatMap(s => s.inclusions) || []),
    ...(variation.globalInclusions || []),
  ];
  const allExclusions = [
    ...(variation.scopes?.flatMap(s => s.exclusions) || []),
    ...(variation.globalExclusions || []),
  ];
  const allPCItems = [
    ...(variation.scopes?.flatMap(s => s.pcItems) || []),
    ...(variation.globalPCItems || []),
  ];

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Quote Document — 2 columns */}
      <div className="col-span-2 space-y-0">
        {/* Document Container — white professional look */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">

          {/* Letterhead */}
          <div className="bg-slate-900 p-8 flex justify-between items-start">
            <div className="flex items-center gap-4">
              {companyLogo && (
                <img src={companyLogo} alt={companyName || "Company"} className="h-16 w-16 object-contain rounded-xl bg-white p-1.5 shadow-lg" />
              )}
              <div>
                <h1 className="text-xl font-black text-white">{companyName || "Builder"}</h1>
                <p className="text-xs text-slate-400 mt-1">ABN: 12 345 678 901 | Lic: DB-U 12345</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {variation.mode === "quote" ? "Quote" : "Variation"}
              </span>
              <p className="text-xs text-slate-400 mt-2">Ref: {variation.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-slate-400">{new Date(variation.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Client & Project Info */}
          <div className="grid grid-cols-2 gap-6 p-8 border-b border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prepared For</p>
              <p className="text-sm font-bold text-slate-900">{project.customerName}</p>
              <p className="text-xs text-slate-500">{project.customerEmail}</p>
              {project.customers?.[0]?.phone && <p className="text-xs text-slate-500">{project.customers[0].phone}</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project</p>
              <p className="text-sm font-bold text-slate-900">{project.name}</p>
              <p className="text-xs text-slate-500">{project.address}</p>
            </div>
          </div>

          {/* Title */}
          <div className="px-8 pt-6 pb-4">
            <h2 className="text-lg font-black text-slate-900">{variation.title}</h2>
            {variation.description && (
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{variation.description}</p>
            )}
          </div>

          {/* Scope Breakdown — multi-scope or legacy */}
          <div className="px-8 pb-6">
            {variation.scopes && variation.scopes.length > 0 ? (
              <div className="space-y-6">
                {variation.scopes.map((scope, idx) => {
                  const scopeCalc = quoteCalc?.scopeCalcs[idx];
                  return (
                    <div key={scope.id}>
                      <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        {scope.label}
                      </h3>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                              <th className="py-2 px-4 text-left">Description</th>
                              <th className="py-2 px-4 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(scopeCalc?.stageCalcs || []).map((calc, i) => (
                              <tr key={i} className="text-sm">
                                <td className="py-3 px-4 text-slate-700">{calc.stage.name}</td>
                                <td className="py-3 px-4 text-right font-medium text-slate-900">{formatCurrency(calc.clientPrice)}</td>
                              </tr>
                            ))}
                            {/* If no quoteCalc, show stages with builderCost as fallback */}
                            {!scopeCalc && scope.stages.map((stage, i) => (
                              <tr key={i} className="text-sm">
                                <td className="py-3 px-4 text-slate-700">{stage.name}</td>
                                <td className="py-3 px-4 text-right font-medium text-slate-900">{formatCurrency(stage.clientCost || stage.builderCost)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Legacy single solution view */
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedSolution?.stages.map(stage => (
                      <tr key={stage.id} className="text-sm">
                        <td className="py-3 px-4 text-slate-700">{stage.name}</td>
                        <td className="py-3 px-4 text-right font-medium text-slate-900">{formatCurrency(stage.clientCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PC Items */}
          {allPCItems.length > 0 && (
            <div className="px-8 pb-6">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Prime Cost (PC) Items — Allowances</h3>
              <div className="border border-amber-200 bg-amber-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] uppercase text-amber-700 font-bold tracking-wider bg-amber-100">
                      <th className="py-2 px-4 text-left">Item</th>
                      <th className="py-2 px-4 text-center">Unit</th>
                      <th className="py-2 px-4 text-right">Allowance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {allPCItems.map((pc, i) => (
                      <tr key={i} className="text-sm">
                        <td className="py-2.5 px-4 text-amber-900">{pc.description}</td>
                        <td className="py-2.5 px-4 text-center text-amber-700 text-xs">{pc.unit}</td>
                        <td className="py-2.5 px-4 text-right font-medium text-amber-900">{formatCurrency(pc.allowance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-4 py-2 text-[10px] text-amber-600 bg-amber-50 border-t border-amber-200">
                  Note: If customer selects items above the allowance, the difference will be charged. Below allowance amounts will be credited.
                </p>
              </div>
            </div>
          )}

          {/* Pricing Totals */}
          <div className="px-8 pb-6">
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal (ex GST)</span>
                  <span className="text-slate-900 font-medium">{formatCurrency(displaySubtotal)}</span>
                </div>
                {displayContingency > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Contingency ({pricing?.contingencyPercent || 10}%)</span>
                    <span className="text-slate-900 font-medium">{formatCurrency(displayContingency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST (10%)</span>
                  <span className="text-slate-900 font-medium">{formatCurrency(displayGst)}</span>
                </div>
                <div className="border-t border-slate-300 pt-3 mt-3 flex justify-between">
                  <span className="text-lg font-black text-slate-900">Total (inc GST)</span>
                  <span className="text-2xl font-black text-indigo-600">{formatCurrency(displayTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          {(allInclusions.length > 0 || allExclusions.length > 0) && (
            <div className="px-8 pb-6 grid grid-cols-2 gap-4">
              {/* Inclusions */}
              {allInclusions.length > 0 && (
                <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2">✓ Inclusions</h4>
                  <ul className="space-y-1">
                    {allInclusions.map((inc, i) => (
                      <li key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{inc.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              {allExclusions.length > 0 && (
                <div className="border border-rose-200 bg-rose-50 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-rose-800 uppercase mb-2">✗ Exclusions</h4>
                  <ul className="space-y-1">
                    {allExclusions.map((exc, i) => (
                      <li key={i} className="text-xs text-rose-900 flex items-start gap-1.5">
                        <span className="text-rose-500 mt-0.5 flex-shrink-0">✗</span>
                        <span>{exc.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Terms & Guarantee */}
          <div className="px-8 pb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">Terms & Conditions</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  This quote is valid for 30 days from the date of issue. All work performed will comply with the Building Code of Australia (BCA) 
                  and relevant Australian Standards. Payment terms: 10% deposit upon acceptance, progress payments as per schedule, 
                  final payment on completion. Domestic building warranty insurance included for projects over $16,000.
                </p>
              </div>
            </div>
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
              <Award className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">Workmanship Guarantee</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  All work comes with our standard structural and workmanship guarantee as required by the 
                  Domestic Building Contracts Act 1995 (Vic). 6-year structural warranty and 2-year non-structural warranty apply.
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {variation.status === "approved" && (
            <div className="px-8 pb-8">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-6 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-lg font-black text-emerald-700">APPROVED</p>
                <p className="text-sm text-emerald-600 mt-1">Signed by: {variation.customerSignature}</p>
                <p className="text-xs text-emerald-500 mt-0.5">
                  {variation.approvedAt && new Date(variation.approvedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Sign-off Panel */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Customer Sign-off</h3>

          {/* Comment/Feedback */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Customer Feedback / Comment
            </label>
            <textarea
              placeholder="Leave a note or special instructions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-indigo-500"
              rows={3}
            />
          </div>

          {variation.status === "approved" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-emerald-400">Successfully Approved</p>
              <p className="text-xs text-slate-400">Signed by: {variation.customerSignature}</p>
              {variation.approvedAt && (
                <p className="text-[10px] text-slate-500">
                  {new Date(variation.approvedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Signature */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Digital Signature (Type Full Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. James Smith"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {signatureName && (
                  <div className="bg-slate-950 border border-dashed border-slate-700 rounded-lg p-4 text-center">
                    <p className="text-2xl italic text-indigo-400 font-serif">{signatureName}</p>
                    <p className="text-[9px] text-slate-500 mt-1">Digital Signature Preview</p>
                  </div>
                )}
              </div>

              {/* Approve */}
              <button
                onClick={handleApprove}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle className="w-5 h-5" />
                Approve & Sign
              </button>

              {/* Request Changes — NOT Decline */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Request Revised Quote
                </label>
                <textarea
                  placeholder="Describe the changes you'd like..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                  rows={3}
                />
                <button
                  onClick={handleRequestChanges}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium py-2.5 rounded-xl text-xs transition"
                >
                  Request Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quote Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Quote Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white">{formatCurrency(displaySubtotal)}</span>
            </div>
            {displayContingency > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Contingency</span>
                <span className="text-white">{formatCurrency(displayContingency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">GST</span>
              <span className="text-white">{formatCurrency(displayGst)}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-white">Total</span>
              <span className="font-black text-indigo-400 text-lg">{formatCurrency(displayTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
