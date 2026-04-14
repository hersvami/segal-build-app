import { useState, useRef, useEffect } from "react";
import type { Message, Project } from "../types/domain";
import { COMPANIES } from "../constants/companies";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

interface ProjectChatProps {
  project: Project;
  companyId?: string;
  onSendMessage: (message: Message) => void;
}

export function ProjectChat({ project, companyId, onSendMessage }: ProjectChatProps) {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "contact">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const company = COMPANIES[companyId || "segal-build"] ?? COMPANIES["segal-build"];
  const messages = project.messages || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isOpen]);

  const send = () => {
    if (!text.trim()) return;
    const message: Message = {
      id: generateId(),
      sender: "builder",
      senderName: "James Segal",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    onSendMessage(message);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const unreadCount = messages.filter((m) => m.sender === "customer").length;

  // ── Collapsed bubble ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700"
      >
        💬 Chat
        {unreadCount > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  // ── Expanded panel ──
  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex w-96 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl"
      style={{ maxHeight: "80vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-white">💬 {project.name}</p>
          <p className="text-xs text-blue-200">{project.customerName} · {project.customerEmail}</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white hover:bg-blue-400"
        >
          ✕
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 py-2 text-xs font-bold transition ${
            tab === "chat"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          💬 Notes
        </button>
        <button
          onClick={() => setTab("contact")}
          className={`flex-1 py-2 text-xs font-bold transition ${
            tab === "contact"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          📞 Contact Customer
        </button>
      </div>

      {/* ── CHAT TAB ── */}
      {tab === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: "35vh" }}>
            {messages.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">No notes yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Add internal notes about {project.customerName}
                </p>
              </div>
            )}
            {messages.map((msg) => {
              const isBuilder = msg.sender === "builder";
              return (
                <div key={msg.id} className={`flex ${isBuilder ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isBuilder
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-slate-100 text-slate-900 rounded-bl-md"
                    }`}
                  >
                    <p className={`text-xs font-bold mb-0.5 ${isBuilder ? "text-blue-200" : "text-slate-500"}`}>
                      {msg.senderName}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${isBuilder ? "text-blue-300" : "text-slate-400"}`}>
                      {new Date(msg.timestamp).toLocaleString("en-AU", {
                        day: "numeric", month: "short",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="border-t border-slate-100 px-3 py-2">
            <div className="flex flex-wrap gap-1">
              {[
                "Quote sent — awaiting customer approval",
                "Following up on quote",
                "Customer called — discussed scope",
                "Site visit booked",
                "Awaiting customer decision",
              ].map((quick) => (
                <button
                  key={quick}
                  onClick={() => setText(quick)}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                >
                  {quick.length > 28 ? quick.substring(0, 28) + "…" : quick}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Note about ${project.customerName}...`}
                className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={2}
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">Press Enter to save · Shift+Enter for new line</p>
          </div>
        </>
      )}

      {/* ── CONTACT TAB ── */}
      {tab === "contact" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer</p>
            <p className="font-bold text-slate-900">{project.customerName}</p>
            <p className="text-sm text-slate-600">{project.customerEmail}</p>
          </div>

          {/* Direct contact buttons */}
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Now</p>

          <div className="space-y-2">
            <a
              href={`tel:${project.customerEmail}`}
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700"
            >
              <span className="text-xl">📞</span>
              <div>
                <p>Call Customer</p>
                <p className="text-xs font-normal text-slate-400">Opens phone dialler</p>
              </div>
            </a>

            <a
              href={`sms:?&body=Hi ${project.customerName}, this is James from ${company.name} regarding your project at ${project.address}. `}
              className="flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              <span className="text-xl">📱</span>
              <div>
                <p>SMS Customer</p>
                <p className="text-xs font-normal text-emerald-200">Opens native SMS app</p>
              </div>
            </a>

            <a
              href={`mailto:${project.customerEmail}?subject=Your Project — ${project.name} | ${company.name}`}
              className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <span className="text-xl">📧</span>
              <div>
                <p>Email Customer</p>
                <p className="text-xs font-normal text-blue-200">Opens default email app</p>
              </div>
            </a>

            <a
              href={`https://mail.google.com/mail/?view=cm&to=${project.customerEmail}&su=Your Project — ${project.name} | ${company.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              <span className="text-xl">✉️</span>
              <div>
                <p>Email via Gmail</p>
                <p className="text-xs font-normal text-red-200">Opens Gmail in browser</p>
              </div>
            </a>

            <a
              href={`https://wa.me/?text=Hi ${project.customerName}, this is James from ${company.name} regarding your project at ${project.address}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
              <span className="text-xl">💬</span>
              <div>
                <p>WhatsApp Customer</p>
                <p className="text-xs font-normal text-green-200">Opens WhatsApp with pre-filled message</p>
              </div>
            </a>
          </div>

          {/* Quick message templates */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Quick Message Templates</p>
            <div className="space-y-1">
              {[
                { label: "Quote ready", msg: `Hi ${project.customerName}, your quote for ${project.name} is ready for review. Please let me know if you have any questions. — James, ${company.name} ${company.phone}` },
                { label: "Following up", msg: `Hi ${project.customerName}, just following up on the quote for ${project.name}. Happy to chat if you have any questions. — James, ${company.name} ${company.phone}` },
                { label: "Approved — booking works", msg: `Hi ${project.customerName}, great news — your quote is approved! We'll be in touch shortly to book in the works. — James, ${company.name}` },
                { label: "Site visit", msg: `Hi ${project.customerName}, I'd like to arrange a site visit for ${project.address}. Are you available this week? — James, ${company.name} ${company.phone}` },
              ].map((template) => (
                <a
                  key={template.label}
                  href={`sms:?&body=${encodeURIComponent(template.msg)}`}
                  className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <span className="font-bold">📱 {template.label}</span>
                  <span className="block text-slate-500 mt-0.5 truncate">{template.msg.substring(0, 60)}…</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
