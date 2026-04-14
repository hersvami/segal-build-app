import type { Company, Project, Solution, Variation } from "../../types/domain";

interface ReportSendModalProps {
  project: Project;
  variation: Variation;
  selectedSolution: Solution;
  company: Company;
  onClose: () => void;
  onStatusChange: (status: Variation["status"], comment: string) => void;
}

export function ReportSendModal({
  project,
  variation,
  selectedSolution,
  company,
  onClose,
  onStatusChange,
}: ReportSendModalProps) {
  const activeStages = selectedSolution.stages.filter((s) => s.isSelected);

  const generateEmailBody = () => {
    const stageList = activeStages
      .map((s) => `• ${s.name} (${s.trade}) — $${s.clientCost.toLocaleString()}`)
      .join("\n");

    return `Dear ${project.customerName},

Please find your ${variation.mode === "quote" ? "quotation" : "variation notice"} below for review.

Project: ${project.name}
Address: ${project.address}
Reference: ${variation.id.substring(0, 8).toUpperCase()}
Date: ${new Date().toLocaleDateString("en-AU")}

Option: ${selectedSolution.title}
Total: $${selectedSolution.clientCost.toLocaleString()} (inc GST)
Timeline: ${selectedSolution.timelineDays} working days

Works Schedule:
${stageList}

Please review and reply with your approval or any questions. We're happy to discuss.

Kind regards,
${company.name}
ABN: ${company.abn}
Ph: ${company.phone}
Email: ${company.email}
Registered Building Practitioner — Victoria`;
  };

  const generateSmsBody = () =>
    `Hi ${project.customerName}, your ${variation.mode === "quote" ? "quote" : "variation"} for ${project.name} is ready. Total: $${selectedSolution.clientCost.toLocaleString()} inc GST. Please reply or call to discuss. — ${company.name} ${company.phone}`;

  const generateWhatsAppBody = () =>
    `Hi ${project.customerName} 👋\n\nYour *${variation.mode === "quote" ? "quote" : "variation"}* for *${project.name}* is ready for review.\n\n💰 *Total: $${selectedSolution.clientCost.toLocaleString()} (inc GST)*\n⏱ Timeline: ${selectedSolution.timelineDays} working days\n\nWorks include:\n${activeStages.map((s) => `• ${s.name}`).join("\n")}\n\nPlease reply with any questions. Happy to chat! 😊\n\n— ${company.name}`;

  const subject = encodeURIComponent(
    `${variation.mode === "quote" ? "Quotation" : "Variation"} — ${project.name} | ${company.name}`
  );

  // ── Send handlers ──
  const sendViaEmailApp = () => {
    const body = encodeURIComponent(generateEmailBody());
    window.location.href = `mailto:${project.customerEmail}?subject=${subject}&body=${body}`;
    onStatusChange("pending", "Sent to customer via Email App");
    onClose();
  };

  const sendViaGmail = () => {
    const body = encodeURIComponent(generateEmailBody());
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${project.customerEmail}&su=${subject}&body=${body}`,
      "_blank"
    );
    onStatusChange("pending", "Sent to customer via Gmail");
    onClose();
  };

  const sendViaOutlook = () => {
    const body = encodeURIComponent(generateEmailBody());
    window.open(
      `https://outlook.live.com/mail/0/deeplink/compose?to=${project.customerEmail}&subject=${subject}&body=${body}`,
      "_blank"
    );
    onStatusChange("pending", "Sent to customer via Outlook");
    onClose();
  };

  const sendViaSMS = () => {
    const body = encodeURIComponent(generateSmsBody());
    // Try to get phone from project (future field) or prompt
    window.location.href = `sms:?&body=${body}`;
    onStatusChange("pending", "Sent to customer via SMS");
    onClose();
  };

  const sendViaWhatsApp = () => {
    const body = encodeURIComponent(generateWhatsAppBody());
    window.open(`https://wa.me/?text=${body}`, "_blank");
    onStatusChange("pending", "Sent to customer via WhatsApp");
    onClose();
  };

  const copyToClipboard = () => {
    const text = `To: ${project.customerEmail}\nSubject: ${decodeURIComponent(subject)}\n\n${generateEmailBody()}`;
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
    onStatusChange("pending", "Email copied to clipboard");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm print:hidden">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Send to Customer</p>
          <h3 className="text-lg font-black tracking-tight text-slate-900">
            {variation.mode === "quote" ? "Quotation" : "Variation"} — {selectedSolution.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Sending to <strong>{project.customerName}</strong>
          </p>
          <p className="mt-0.5 text-sm font-bold text-red-800">
            Total: ${selectedSolution.clientCost.toLocaleString()} (inc GST) · {selectedSolution.timelineDays} days
          </p>
        </div>

        {/* Email preview */}
        <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 whitespace-pre-wrap">
          {generateEmailBody()}
        </div>

        {/* ── EMAIL OPTIONS ── */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">📧 Email</p>
          <div className="space-y-2">
            <button
              onClick={sendViaEmailApp}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 flex items-center gap-3"
            >
              <span className="text-xl">📧</span>
              <div className="text-left">
                <p>Open in Email App</p>
                <p className="text-xs font-normal text-blue-200">Opens your default mail app (Outlook, Apple Mail etc.)</p>
              </div>
            </button>
            <button
              onClick={sendViaGmail}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 flex items-center gap-3"
            >
              <span className="text-xl">✉️</span>
              <div className="text-left">
                <p>Open in Gmail</p>
                <p className="text-xs font-normal text-red-200">Opens Gmail in browser with quote pre-filled</p>
              </div>
            </button>
            <button
              onClick={sendViaOutlook}
              className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 flex items-center gap-3"
            >
              <span className="text-xl">📨</span>
              <div className="text-left">
                <p>Open in Outlook Web</p>
                <p className="text-xs font-normal text-blue-200">Opens Outlook.com with quote pre-filled</p>
              </div>
            </button>
          </div>
        </div>

        {/* ── SMS & WHATSAPP ── */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">📱 SMS & Messaging</p>
          <div className="space-y-2">
            <button
              onClick={sendViaSMS}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 flex items-center gap-3"
            >
              <span className="text-xl">📱</span>
              <div className="text-left">
                <p>Send via SMS</p>
                <p className="text-xs font-normal text-emerald-200">Opens native SMS app with short summary</p>
              </div>
            </button>
            <button
              onClick={sendViaWhatsApp}
              className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 flex items-center gap-3"
            >
              <span className="text-xl">💬</span>
              <div className="text-left">
                <p>Send via WhatsApp</p>
                <p className="text-xs font-normal text-green-200">Opens WhatsApp with formatted quote message</p>
              </div>
            </button>
          </div>
        </div>

        {/* ── COPY ── */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">📋 Other</p>
          <button
            onClick={copyToClipboard}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white hover:bg-slate-900 flex items-center gap-3"
          >
            <span className="text-xl">📋</span>
            <div className="text-left">
              <p>Copy to Clipboard</p>
              <p className="text-xs font-normal text-slate-400">Paste into any app manually</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
