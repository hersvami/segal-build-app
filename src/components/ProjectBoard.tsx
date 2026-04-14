import { useMemo, useState } from "react";
import type { Message, Project, ProjectCustomer, Variation } from "../types/domain";
import { VariationReport } from "./report/VariationReport";
import { ProjectChat } from "./ProjectChat";
import { generateId } from "../utils/id";

interface ProjectBoardProps {
  project: Project;
  companyId?: string;
  activeVariationId: string | null;
  onSetActiveVariationId: (id: string | null) => void;
  onStartQuote: () => void;
  onStartVariation: () => void;
  onUpdateVariationStatus: (variationId: string, status: Variation["status"], comment?: string) => void;
  onUpdateVariation?: (variationId: string, updated: Variation) => void;
  onCreateRevision?: (variation: Variation) => void;
  onSendMessage?: (message: Message) => void;
  onUpdateProject?: (updated: Project) => void;
}

// ── Manage Customers Modal ──
function ManageCustomersModal({
  project,
  onSave,
  onClose,
}: {
  project: Project;
  onSave: (customers: ProjectCustomer[]) => void;
  onClose: () => void;
}) {
  const [customers, setCustomers] = useState<ProjectCustomer[]>(
    project.customers ?? [
      { id: generateId(), name: project.customerName, email: project.customerEmail, isPrimary: true },
    ]
  );
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setCustomers((prev) => [
      ...prev,
      { id: generateId(), name: newName.trim(), email: newEmail.trim(), phone: newPhone.trim(), isPrimary: false },
    ]);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  const handleRemove = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    setCustomers((prev) => prev.map((c) => ({ ...c, isPrimary: c.id === id })));
  };

  const handleContact = (customer: ProjectCustomer, method: "sms" | "email" | "whatsapp") => {
    const msg = encodeURIComponent(`Hi ${customer.name}, just following up on your project at ${project.address}. Please let me know if you have any questions. — Segal Build`);
    if (method === "sms") window.location.href = `sms:${customer.phone || ""}?body=${msg}`;
    if (method === "email") window.location.href = `mailto:${customer.email}?subject=Your Project — ${project.name}&body=${msg}`;
    if (method === "whatsapp") window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">Manage</p>
            <h3 className="text-lg font-black text-slate-900">Project Customers</h3>
          </div>
          <button onClick={onClose} className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">✕</button>
        </div>

        {/* Existing customers */}
        <div className="space-y-2">
          {customers.map((customer) => (
            <div key={customer.id} className={`rounded-xl border p-3 ${customer.isPrimary ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    {customer.isPrimary && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">PRIMARY</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{customer.email}</p>
                  {customer.phone && <p className="text-xs text-slate-500">{customer.phone}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  {!customer.isPrimary && (
                    <button onClick={() => handleSetPrimary(customer.id)} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200">
                      Set Primary
                    </button>
                  )}
                  {customers.length > 1 && (
                    <button onClick={() => handleRemove(customer.id)} className="rounded bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Quick contact */}
              <div className="mt-2 flex gap-1 flex-wrap">
                <button onClick={() => handleContact(customer, "email")} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-200">📧 Email</button>
                {customer.phone && (
                  <button onClick={() => handleContact(customer, "sms")} className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 hover:bg-green-200">📱 SMS</button>
                )}
                <button onClick={() => handleContact(customer, "whatsapp")} className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 hover:bg-emerald-200">💬 WhatsApp</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new customer */}
        <div className="rounded-xl border border-slate-200 p-4 space-y-2">
          <h4 className="text-sm font-bold text-slate-700">➕ Add Customer</h4>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Full name *"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email address *"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim() || !newEmail.trim()}
            className="w-full rounded-lg bg-red-800 px-4 py-2 text-sm font-bold text-white hover:bg-red-900 disabled:opacity-50"
          >
            Add Customer
          </button>
        </div>

        {/* Save */}
        <button
          onClick={() => { onSave(customers); onClose(); }}
          className="w-full rounded-lg bg-green-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800"
        >
          ✅ Save Changes
        </button>
      </div>
    </div>
  );
}

export function ProjectBoard({
  project,
  companyId,
  activeVariationId,
  onSetActiveVariationId,
  onStartQuote,
  onStartVariation,
  onUpdateVariationStatus,
  onUpdateVariation,
  onCreateRevision,
  onSendMessage,
  onUpdateProject,
}: ProjectBoardProps) {
  const [showManageCustomers, setShowManageCustomers] = useState(false);

  const activeVariation = useMemo(() => {
    if (activeVariationId) {
      const found = project.variations.find((v) => v.id === activeVariationId);
      if (found) return found;
    }
    return project.variations[0] ?? null;
  }, [activeVariationId, project.variations]);

  const primaryCustomer = project.customers?.find((c) => c.isPrimary) ?? {
    name: project.customerName,
    email: project.customerEmail,
  };

  const handleSaveCustomers = (customers: ProjectCustomer[]) => {
    if (!onUpdateProject) return;
    const primary = customers.find((c) => c.isPrimary) ?? customers[0];
    onUpdateProject({
      ...project,
      customers,
      customerName: primary?.name ?? project.customerName,
      customerEmail: primary?.email ?? project.customerEmail,
    });
  };

  return (
    <div className="space-y-5">
      {/* Project Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">{project.name}</h2>
            <p className="text-sm text-slate-500">
              {project.address} · {primaryCustomer.name} ({primaryCustomer.email})
            </p>
            {project.customers && project.customers.length > 1 && (
              <p className="text-xs text-blue-600 mt-0.5">
                +{project.customers.length - 1} additional customer{project.customers.length > 2 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowManageCustomers(true)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              👥 Customers ({project.customers?.length ?? 1})
            </button>
            <button
              onClick={onStartQuote}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              New Quote
            </button>
            <button
              onClick={onStartVariation}
              className="rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
            >
              New Variation
            </button>
          </div>
        </div>
      </div>

      {project.variations.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Variation Sidebar */}
          <aside className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
            {project.variations.map((variation) => (
              <button
                key={variation.id}
                onClick={() => onSetActiveVariationId(variation.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  activeVariation?.id === variation.id
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <p className="truncate text-sm font-semibold text-slate-900">{variation.title}</p>
                <p className="text-xs text-slate-500">{variation.mode === "quote" ? "Quote" : "Variation"}</p>
                <p className="mt-1 text-xs font-bold text-slate-700">
                  ${variation.solutions[variation.selectedSolution]?.clientCost.toLocaleString() ?? "0"}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    variation.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : variation.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : variation.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : variation.status === "invoiced"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {variation.status}
                </span>
              </button>
            ))}
          </aside>

          {/* Active Variation Report */}
          {activeVariation && (
            <VariationReport
              project={project}
              variation={activeVariation}
              companyId={companyId}
              onStatusChange={(status, comment) =>
                onUpdateVariationStatus(activeVariation.id, status, comment)
              }
              onUpdateVariation={(updated) =>
                onUpdateVariation?.(activeVariation.id, updated)
              }
              onCreateRevision={
                onCreateRevision ? () => onCreateRevision(activeVariation) : undefined
              }
            />
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">No Documents Yet</h3>
          <p className="mt-2 text-sm text-slate-600">
            Create a quote or variation to start planning this project.
          </p>
        </div>
      )}

      {/* Project Chat */}
      {onSendMessage && (
        <ProjectChat project={project} companyId={companyId} onSendMessage={onSendMessage} />
      )}

      {/* Manage Customers Modal */}
      {showManageCustomers && (
        <ManageCustomersModal
          project={project}
          onSave={handleSaveCustomers}
          onClose={() => setShowManageCustomers(false)}
        />
      )}
    </div>
  );
}
