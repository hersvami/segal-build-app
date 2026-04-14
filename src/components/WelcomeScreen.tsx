import React from "react";
import { FolderPlus, HardHat, CheckCircle2 } from "lucide-react";

interface WelcomeScreenProps {
  onCreateProjectClick: () => void;
  companyName: string;
  companyLogo?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onCreateProjectClick,
  companyName,
  companyLogo,
}) => {
  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 select-none">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/80 p-8 text-center border border-slate-100">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 text-white mb-6 overflow-hidden">
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} className="h-full w-full object-contain p-2" />
          ) : (
            <HardHat size={36} />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
          Welcome to {companyName}
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Create, estimate, and manage variations and quotes for your building projects instantly with modular solutions.
        </p>

        <div className="space-y-4 mb-8 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <CheckCircle2 size={18} className="text-indigo-600 flex-shrink-0" />
            <span>Generate customized stage & trade quotes automatically</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <CheckCircle2 size={18} className="text-indigo-600 flex-shrink-0" />
            <span>Interactive variations with customer signature & feedback</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <CheckCircle2 size={18} className="text-indigo-600 flex-shrink-0" />
            <span>Integrated job tracking, photos, and live chat messaging</span>
          </div>
        </div>

        <button
          onClick={onCreateProjectClick}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
        >
          <FolderPlus size={18} />
          Create Your First Project
        </button>
      </div>
    </div>
  );
};
