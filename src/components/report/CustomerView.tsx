import { useState, useRef, useEffect, useCallback } from "react";
import type { Variation, Solution, Project, Company, ChangeLogEntry } from "../../types/domain";
import { ReportLetterhead } from "./ReportLetterhead";
import { generateId } from "../../utils/id";

interface CustomerViewProps {
  variation: Variation;
  selectedSolution: Solution;
  project: Project;
  company: Company;
  signatureMode: boolean;
  setSignatureMode: (b: boolean) => void;
  customerSignature: string | undefined;
  onBackToBuilder: () => void;
  onSignatureApprove: (signature: string, log: ChangeLogEntry) => void;
  onStatusChange: (status: Variation["status"], comment?: string, log?: ChangeLogEntry) => void;
}

// ── Canvas Signature Pad ──
function SignaturePad({ onSave, onCancel }: { onSave: (dataUrl: string) => void; onCancel: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawing.current = true;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsEmpty(false);
  }, []);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, []);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseleave", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDraw);
    };
  }, [startDraw, draw, stopDraw]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;
    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-green-800">✍️ Draw Your Signature</p>
      <p className="text-xs text-green-700">
        Draw your signature in the box below using your mouse or finger. By signing, you confirm
        acceptance of the full scope of works and pricing as detailed in this document.
      </p>
      <div className="rounded-lg border-2 border-green-300 bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={560}
          height={160}
          className="w-full touch-none cursor-crosshair"
          style={{ display: "block" }}
        />
      </div>
      <p className="text-xs text-slate-400 text-center">← Draw your signature above →</p>
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={isEmpty}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✅ Confirm & Sign
        </button>
        <button
          onClick={clear}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
        >
          🗑️ Clear
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function CustomerView({
  variation,
  selectedSolution,
  project,
  company,
  signatureMode,
  setSignatureMode,
  customerSignature,
  onBackToBuilder,
  onSignatureApprove,
  onStatusChange,
}: CustomerViewProps) {
  const [requestChangeMode, setRequestChangeMode] = useState(false);
  const [changeComment, setChangeComment] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [revisionComment, setRevisionComment] = useState("");

  const activeStages = selectedSolution.stages.filter((s) => s.isSelected);
  const gst = Math.round(selectedSolution.clientCost / 11);
  const exGst = selectedSolution.clientCost - gst;

  // Group by trade for trade summary
  const tradeMap = new Map<string, number>();
  for (const stage of activeStages) {
    tradeMap.set(stage.trade, (tradeMap.get(stage.trade) ?? 0) + stage.clientCost);
  }

  const makeLog = (action: string, actor: "builder" | "customer", detail?: string): ChangeLogEntry => ({
    id: generateId(),
    timestamp: new Date().toISOString(),
    actor,
    actorName: actor === "customer" ? project.customerName : company.name,
    action,
    detail,
  });

  const handleSignatureSave = (dataUrl: string) => {
    const log = makeLog("Signed & Approved", "customer", `Electronically signed by ${project.customerName}`);
    onSignatureApprove(dataUrl, log);
    setSignatureMode(false);
  };

  const handleRequestChange = () => {
    if (!changeComment.trim()) return;
    const log = makeLog("Requested Changes", "customer", changeComment.trim());
    onStatusChange("pending", changeComment.trim(), log);
    setRequestChangeMode(false);
    setChangeComment("");
  };

  const handleRequestRevision = () => {
    if (!revisionComment.trim()) return;
    const log = makeLog("Requested Revision", "customer", revisionComment.trim());
    onStatusChange("pending", revisionComment.trim(), log);
    setRevisionMode(false);
    setRevisionComment("");
  };

  const isApproved = variation.status === "approved" && !!customerSignature;
  const isPending = variation.status === "pending";
  const changeLog = variation.changeLog ?? [];

  return (
    <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 print:border-none print:shadow-none print:p-0 print:m-0">

      {/* Action Bar — hidden on print */}
      <div className="flex flex-wrap justify-between gap-2 print:hidden">
        <button
          onClick={onBackToBuilder}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
        >
          ← Back to Builder View
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          📄 Save / Print PDF
        </button>
      </div>

      {/* Letterhead */}
      <ReportLetterhead company={company} />

      {/* Document Title */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">
            {variation.mode === "quote" ? "Quotation" : "Variation Notice"}
          </p>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{variation.title}</h2>
          <p className="text-sm text-slate-500 mt-1">
            Ref: {variation.id.substring(0, 8).toUpperCase()} &nbsp;·&nbsp;
            Issued: {new Date(variation.createdAt).toLocaleDateString("en-AU")}
            {variation.sentAt && (
              <> &nbsp;·&nbsp; Sent: {new Date(variation.sentAt).toLocaleDateString("en-AU")}</>
            )}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase print:border print:border-slate-300 ${
          isApproved ? "bg-green-100 text-green-800" :
          isPending ? "bg-amber-100 text-amber-800" :
          "bg-slate-100 text-slate-700"
        }`}>
          {variation.status}
        </span>
      </div>

      {/* Project & Customer Details */}
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Project</p>
          <p className="font-bold text-slate-900">{project.name}</p>
          <p className="text-slate-600">{project.address}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Prepared For</p>
          <p className="font-bold text-slate-900">{project.customerName}</p>
          <p className="text-slate-600">{project.customerEmail}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Prepared By</p>
          <p className="font-bold text-slate-900">{company.name}</p>
          <p className="text-slate-600">ABN: {company.abn}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact</p>
          <p className="text-slate-600">{company.phone}</p>
          <p className="text-slate-600">{company.email}</p>
        </div>
      </div>

      {/* Scope of Works */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-2">
          Scope of Works
        </h3>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {variation.elaboratedDescription || variation.description || "Scope of works as discussed and agreed."}
        </div>
      </div>

      {/* Selected Option Banner */}
      <div className="rounded-xl border-2 border-red-100 bg-red-50 p-4 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-red-600">Selected Option</p>
        <p className="text-lg font-black text-slate-900">{selectedSolution.title}</p>
        <p className="text-sm text-slate-600">
          Estimated duration: <strong>{selectedSolution.timelineDays} working days</strong>
        </p>
      </div>

      {/* Schedule of Works */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-2">
          Schedule of Works
        </h3>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Item / Stage</th>
                <th className="px-4 py-3 text-left font-bold">Trade</th>
                <th className="px-4 py-3 text-left font-bold hidden sm:table-cell">Code</th>
                <th className="px-4 py-3 text-right font-bold">Amount (inc GST)</th>
              </tr>
            </thead>
            <tbody>
              {activeStages.map((stage, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-800 font-medium">{stage.name}</td>
                  <td className="px-4 py-2.5 text-slate-500">{stage.trade}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs hidden sm:table-cell">{stage.code ?? "—"}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800">
                    ${stage.clientCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-2">
          Trade Summary
        </h3>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700">Trade</th>
                <th className="px-4 py-3 text-right font-bold text-slate-700">Subtotal (inc GST)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(tradeMap.entries()).map(([trade, cost], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-800">{trade}</td>
                  <td className="px-4 py-2.5 text-right text-slate-800">${cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5 space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal (ex GST)</span>
          <span>${exGst.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>GST (10%)</span>
          <span>${gst.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-black text-slate-900 border-t-2 border-slate-300 pt-3">
          <span>TOTAL (inc GST)</span>
          <span className="text-red-800">${selectedSolution.clientCost.toLocaleString()}</span>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-2 text-xs text-slate-500 border-t border-slate-200 pt-4">
        <p className="font-bold text-slate-700 text-sm">Terms & Conditions</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>All prices are inclusive of GST unless otherwise stated.</li>
          <li>This {variation.mode === "quote" ? "quotation" : "variation"} is valid for 30 days from the date of issue.</li>
          <li>Works are subject to site access being available and clear of obstructions.</li>
          <li>Any variations to the agreed scope of works will be quoted separately prior to commencement.</li>
          <li>Payment terms: As per the Building Contract or as separately agreed in writing.</li>
          <li>All works carried out in accordance with relevant Australian Standards and NCC 2022.</li>
          <li>{company.name} — ABN: {company.abn} — Registered Building Practitioner, Victoria.</li>
        </ul>
      </div>

      {/* ── Customer Response Section ── */}
      {isApproved ? (
        /* Approved + Signed State */
        <div className="rounded-xl border-2 border-green-400 bg-green-50 p-5 space-y-3 print:border-green-300">
          <p className="text-base font-black text-green-800">✅ Electronically Signed & Approved</p>
          {/* Show signature image if it's a data URL, else show typed name */}
          {customerSignature?.startsWith("data:") ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-green-700">Customer Signature:</p>
              <div className="rounded-lg border border-green-300 bg-white p-2 inline-block">
                <img
                  src={customerSignature}
                  alt="Customer Signature"
                  className="h-20 w-auto"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <p className="text-xs text-green-600">Signed by: <strong>{project.customerName}</strong></p>
            </div>
          ) : (
            <p className="text-sm text-green-700">
              Signed by: <strong>{customerSignature}</strong>
            </p>
          )}
          <p className="text-xs text-green-600">
            Approved on {variation.approvedAt
              ? new Date(variation.approvedAt).toLocaleString("en-AU", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })
              : "—"}
          </p>
        </div>
      ) : isPending && variation.customerComment ? (
        /* Pending — awaiting builder response */
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 space-y-4 print:hidden">
          <p className="text-base font-black text-amber-800">⏳ Awaiting Builder Response</p>
          <p className="text-sm text-amber-700">
            Your request has been saved. {company.name} will review and respond shortly.
          </p>
          <div className="rounded-lg bg-white border border-amber-200 p-3 text-sm text-slate-700">
            <p className="text-xs font-bold text-slate-500 mb-1">Your message:</p>
            {variation.customerComment}
          </div>
          {/* Native contact buttons */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Contact Builder Directly</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${company.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700"
              >
                📞 Call Now
              </a>
              <a
                href={`sms:${company.phone}&body=Hi ${company.name}, regarding the quote for ${project.name} — ${variation.customerComment}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                📱 SMS
              </a>
              <a
                href={`mailto:${company.email}?subject=Re: ${variation.mode === "quote" ? "Quote" : "Variation"} — ${project.name}&body=Hi, regarding the quote for ${project.name}: ${variation.customerComment}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                📧 Email
              </a>
              <a
                href={`https://wa.me/${company.phone.replace(/\D/g, "")}?text=Hi ${company.name}, regarding the quote for ${project.name} — ${variation.customerComment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="rounded-xl border-2 border-slate-200 p-5 space-y-4 print:hidden">
          <div>
            <p className="text-base font-bold text-slate-800">Your Response</p>
            <p className="text-xs text-slate-500 mt-1">
              Please review the scope and pricing above, then let us know how you'd like to proceed.
            </p>
          </div>

          {/* Canvas Signature Pad */}
          {signatureMode ? (
            <div className="rounded-lg border border-green-300 bg-green-50 p-4 space-y-3">
              <SignaturePad
                onSave={handleSignatureSave}
                onCancel={() => setSignatureMode(false)}
              />
            </div>

          /* Request Changes */
          ) : requestChangeMode ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3">
              <p className="text-sm font-bold text-amber-800">💬 Request Changes</p>
              <p className="text-xs text-amber-700">
                Tell the builder what you'd like adjusted — they will update and resubmit for your approval.
              </p>
              <textarea
                placeholder="e.g. Can you add a towel rail? Also can we use a different tile colour?"
                value={changeComment}
                onChange={(e) => setChangeComment(e.target.value)}
                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:outline-none h-24 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRequestChange}
                  disabled={!changeComment.trim()}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  📨 Send to Builder
                </button>
                <button
                  onClick={() => { setRequestChangeMode(false); setChangeComment(""); }}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <a href={`tel:${company.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700">
                  📞 Call Builder
                </a>
                <a href={`sms:${company.phone}&body=Hi, regarding the quote for ${project.name}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                  📱 SMS Builder
                </a>
                <a href={`mailto:${company.email}?subject=Re: Quote — ${project.name}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                  📧 Email Builder
                </a>
                <a href={`https://wa.me/${company.phone.replace(/\D/g, "")}?text=Hi, regarding the quote for ${project.name}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700">
                  💬 WhatsApp
                </a>
              </div>
            </div>

          /* Request Revision */
          ) : revisionMode ? (
            <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 space-y-3">
              <p className="text-sm font-bold text-blue-800">🔄 Request a Revised Quote</p>
              <p className="text-xs text-blue-700">
                Not quite right? Tell us what you need and we'll prepare a revised quote for you.
              </p>
              <textarea
                placeholder="e.g. The budget is too high — can we reduce the scope? Or can you offer a different material option?"
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:outline-none h-24 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRequestRevision}
                  disabled={!revisionComment.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  📨 Send Revision Request
                </button>
                <button
                  onClick={() => { setRevisionMode(false); setRevisionComment(""); }}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <a href={`tel:${company.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700">
                  📞 Call Builder
                </a>
                <a href={`sms:${company.phone}&body=Hi, I'd like a revised quote for ${project.name}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                  📱 SMS Builder
                </a>
                <a href={`mailto:${company.email}?subject=Revision Request — ${project.name}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                  📧 Email Builder
                </a>
                <a href={`https://wa.me/${company.phone.replace(/\D/g, "")}?text=Hi, I'd like a revised quote for ${project.name}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700">
                  💬 WhatsApp
                </a>
              </div>
            </div>

          /* Default — 3 buttons */
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => setSignatureMode(true)}
                className="w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white hover:bg-green-700 flex items-center gap-3"
              >
                <span className="text-2xl">✅</span>
                <div className="text-left">
                  <p className="font-black">Approve & Sign</p>
                  <p className="text-xs font-normal text-green-100">Draw your signature — I'm happy with the scope and price</p>
                </div>
              </button>

              <button
                onClick={() => setRequestChangeMode(true)}
                className="w-full rounded-xl bg-amber-500 px-5 py-4 text-sm font-bold text-white hover:bg-amber-600 flex items-center gap-3"
              >
                <span className="text-2xl">💬</span>
                <div className="text-left">
                  <p className="font-black">Request Changes</p>
                  <p className="text-xs font-normal text-amber-100">I'd like to adjust something before approving</p>
                </div>
              </button>

              <button
                onClick={() => setRevisionMode(true)}
                className="w-full rounded-xl bg-blue-100 px-5 py-4 text-sm font-bold text-blue-800 hover:bg-blue-200 flex items-center gap-3"
              >
                <span className="text-2xl">🔄</span>
                <div className="text-left">
                  <p className="font-black">Request a Revised Quote</p>
                  <p className="text-xs font-normal text-blue-600">The price or scope needs rethinking — please revise</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Change Log / Audit Trail ── */}
      {changeLog.length > 0 && (
        <div className="space-y-3 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            📋 Document History
          </h3>
          <div className="space-y-2">
            {changeLog.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-lg border px-4 py-3 text-sm ${
                  entry.actor === "customer"
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      entry.actor === "customer"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {entry.actor === "customer" ? "👤 Customer" : "🔧 Builder"}
                    </span>
                    <span className="font-semibold text-slate-800">{entry.action}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(entry.timestamp).toLocaleString("en-AU", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                {entry.detail && (
                  <p className="mt-1 text-xs text-slate-600 pl-1 italic">"{entry.detail}"</p>
                )}
                <p className="mt-0.5 text-xs text-slate-400">{entry.actorName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400 print:mt-8">
        <p>{company.name} · ABN {company.abn}</p>
        <p>Ph: {company.phone} · {company.email}</p>
      </div>

    </article>
  );
}
