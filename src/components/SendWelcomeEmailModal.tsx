import React from "react";
import { Mail, X, Copy, Send } from "lucide-react";

interface SendWelcomeEmailModalProps {
  project: {
    name: string;
    customerName: string;
    customerEmail: string;
    address: string;
  };
  onClose: () => void;
}

export const SendWelcomeEmailModal: React.FC<SendWelcomeEmailModalProps> = ({ project, onClose }) => {
  const emailSubject = `Welcome to your project portal with Segal Build`;
  const emailBody = `Dear ${project.customerName},

Welcome to your project portal with Segal Build.

Project: ${project.name}
Address: ${project.address}

You can access your project portal at:
https://segal-build-app.web.app`;

  const handleOpenEmailApp = () => {
    window.location.href = `mailto:${project.customerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleOpenGmail = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${project.customerEmail}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Mail size={20} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">New Project Created</p>
                <h2 className="text-lg font-bold text-slate-800">Send Welcome Email?</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Send login details to <strong>{project.customerName}</strong> at <strong>{project.customerEmail}</strong>
        </p>

        <textarea
          readOnly
          value={emailBody}
          className="w-full h-40 p-4 mb-6 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-600 resize-none"
        />

        <div className="space-y-3">
          <button onClick={handleOpenEmailApp} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
            <Send size={18} /> Open in Email App
          </button>
          <button onClick={handleOpenGmail} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors">
            <Mail size={18} /> Open in Gmail
          </button>
          <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-semibold transition-colors">
            <Copy size={18} /> Copy to Clipboard
          </button>
          <button onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold transition-colors">
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
};
