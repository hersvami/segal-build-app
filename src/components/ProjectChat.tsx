import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { Variation } from "../types/domain";

interface ProjectChatProps {
  variation: Variation;
  onAddNote: (note: string) => void;
}

export function ProjectChat({ variation, onAddNote }: ProjectChatProps) {
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote(note.trim());
      setNote("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
        <MessageSquare size={18} className="text-blue-600" />
        <h3 className="font-semibold text-slate-800">Project Notes & Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {variation.changeLog?.map((log, idx) => (
          <div key={idx} className="bg-slate-50 rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">{log.actorName || log.actor}</span>
              <span className="text-xs text-slate-400">
                {new Date(log.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-slate-600">{log.detail || log.action || "Status updated"}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3 flex gap-2">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an internal note or chat message..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
