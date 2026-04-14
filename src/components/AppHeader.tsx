import { useState } from "react";
import type { Company } from "../types/domain";
import { getGeminiApiKey, setGeminiApiKey, hasGeminiApiKey } from "../gemini";

interface AppHeaderProps {
  company: Company;
  companies: Record<string, Company>;
  onSwitchCompany: (companyId: string) => void;
}

export function AppHeader({ company, companies, onSwitchCompany }: AppHeaderProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyValue, setKeyValue] = useState(getGeminiApiKey());
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    if (keyValue.trim()) {
      setGeminiApiKey(keyValue.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowKeyInput(false);
      }, 2000);
    }
  };

  const keyIsSet = hasGeminiApiKey() && getGeminiApiKey().length > 10 && getGeminiApiKey() !== "PASTE_YOUR_API_KEY_HERE";

  return (
    <header className={`${company.color} border-b border-black/20 text-white`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg bg-white/10 p-1 flex items-center justify-center font-black text-xl">
            {company.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Builders Variation App</p>
            <h1 className="text-2xl font-black tracking-tight">{company.name}</h1>
            <p className="text-sm text-white/80">{company.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                keyIsSet
                  ? "border-green-300 bg-green-500/20 text-green-100 hover:bg-green-500/30"
                  : "border-red-300 bg-red-500/20 text-red-100 hover:bg-red-500/30 animate-pulse"
              }`}
            >
              {keyIsSet ? "🤖 AI Connected" : "⚠️ Set AI Key"}
            </button>
          </div>

          <label className="space-y-1 text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-white/70">Company Profile</span>
            <select
              className="rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-sm font-semibold outline-none"
              value={company.id}
              onChange={(event) => onSwitchCompany(event.target.value)}
            >
              {Object.values(companies).map((option) => (
                <option key={option.id} value={option.id} className="text-slate-900">
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {showKeyInput && (
        <div className="border-t border-white/20 bg-black/20">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="rounded-xl bg-white/10 p-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white">🤖 Gemini AI API Key</h3>
                <p className="text-xs text-white/70 mt-1">
                  Required for AI scope enhancement, photo analysis, and quote generation.
                  Get your free key from{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-white/90 hover:text-white"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  placeholder="Paste your Gemini API key here (starts with AIza...)"
                  className="flex-1 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/60"
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!keyValue.trim() || saved}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {saved ? "✅ Saved!" : "Save Key"}
                </button>
              </div>

              {keyIsSet && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-200">
                    ✓ Key is set
                  </span>
                  <span className="text-xs text-white/50">
                    Key: {getGeminiApiKey().substring(0, 8)}...{getGeminiApiKey().slice(-4)}
                  </span>
                </div>
              )}

              <div className="text-xs text-white/50 space-y-1">
                <p><strong>How to get your key:</strong></p>
                <p>1. Go to <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">aistudio.google.com/apikey</a></p>
                <p>2. Sign in with your Google account</p>
                <p>3. Click "Create API Key"</p>
                <p>4. Copy the key and paste it above</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}