import { useState, useEffect } from "react";
import { Key, Building, Check, ExternalLink } from "lucide-react";
import { getGeminiApiKey, setGeminiApiKey } from "../gemini";
import { COMPANIES } from "../constants/companies";

interface AppHeaderProps {
  companyId: string;
  onCompanyChange: (id: string) => void;
}

export function AppHeader({ companyId, onCompanyChange }: AppHeaderProps) {
  const [keyInput, setKeyInput] = useState("");
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = getGeminiApiKey();
    if (key) {
      setHasKey(true);
      setKeyInput(key);
    }
  }, []);

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      setGeminiApiKey(keyInput.trim());
      setHasKey(true);
    }
  };

  const companiesList = Object.values(COMPANIES);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Brand & Company Selector */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <Building size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            SEGAL BUILD <span className="text-xs text-blue-400 font-normal uppercase tracking-widest ml-2">Variation Hub</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">Operating as:</span>
            <select
              value={companyId}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-0.5 outline-none focus:border-blue-500"
            >
              {companiesList.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gemini API Key Entry */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-800/60 border border-slate-700/50 p-2.5 rounded-xl">
        <div className="flex items-center gap-2">
          <Key size={16} className={hasKey ? "text-emerald-400" : "text-amber-400 animate-pulse"} />
          <span className="text-xs font-medium text-slate-300">
            Gemini AI API Key:
          </span>
        </div>
        <div className="flex flex-1 sm:flex-initial items-center gap-2">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="flex-1 sm:w-48 bg-slate-950/50 text-white border border-slate-700 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={handleSaveKey}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 transition text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm"
          >
            {hasKey && <Check size={12} />}
            {hasKey ? "Saved" : "Save"}
          </button>
        </div>
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline mt-1 sm:mt-0"
        >
          Get Free Key <ExternalLink size={10} />
        </a>
      </div>
    </header>
  );
}
