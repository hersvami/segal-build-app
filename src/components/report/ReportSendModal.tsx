import React, { useState } from "react";
import { Variation, Project } from "../../types/domain";
import { X, Copy, Check, MessageSquare, Mail, ExternalLink } from "lucide-react";

interface ReportSendModalProps {
  variation: Variation;
  project: Project;
  onUpdateVariation: (updated: Variation) => void;
  onClose: () => void;
}

export const ReportSendModal: React.FC<ReportSendModalProps> = ({
  variation,
  project,
  onUpdateVariation,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  // Generate public viewing link or deep link reference
  const publicUrl = `${window.location.origin}/report/${variation.id}`;

  const messageText = `Hi ${project.customerName},\n\nYour ${
    variation.mode === "quote" ? "Quote" : "Variation"
  } for "${variation.title}" is ready for your review.\n\nView and sign here: ${publicUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAction = (channel: "sms" | "whatsapp" | "email") => {
    // Log the update
    onUpdateVariation({
      ...variation,
      sentAt: new Date().toISOString(),
      progressUpdates: [
        ...(variation.progressUpdates || []),
        {
          id: crypto.randomUUID(),
          message: `Sent ${variation.mode.toUpperCase()} via ${channel.toUpperCase()} to ${project.customerName}`,
          sentAt: new Date().toISOString(),
          sentVia: channel,
        }
      ],
      changeLog: [
        ...(variation.changeLog || []),
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          actor: "builder",
          actorName: "Builder Admin",
          action: `Sent document link to customer via ${channel.toUpperCase()}`,
        }
      ]
    });

    if (channel === "sms") {
      window.open(`sms:${project.customers[0]?.phone || ""}?body=${encodeURIComponent(messageText)}`);
    } else if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(messageText)}`);
    } else if (channel === "email") {
      window.open(`mailto:${project.customerEmail}?subject=${encodeURIComponent(`${variation.mode.toUpperCase()} - ${variation.title}`)}&body=${encodeURIComponent(messageText)}`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl animate-scale-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-xl transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Send Report Link</h3>
        <p className="text-slate-400 text-sm mb-6">
          Share the presentation link directly with your client via their preferred channel.
        </p>

        {/* Message Preview Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Message Preview</span>
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition font-normal normal-case text-xs"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied!" : "Copy text"}</span>
            </button>
          </div>
          <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed font-mono">
            {messageText}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSendAction("sms")}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-xl transition"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Send via SMS</span>
          </button>
          
          <button
            onClick={() => handleSendAction("whatsapp")}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4 text-green-500" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => handleSendAction("email")}
            className="col-span-2 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <Mail className="w-5 h-5" />
            <span>Open Email Client</span>
          </button>
        </div>

      </div>
    </div>
  );
};
