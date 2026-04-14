import { useState } from "react";

interface NewProjectFormProps {
  onCreateProject: (payload: {
    name: string;
    address: string;
    customerName: string;
    customerEmail: string;
  }) => void;
}

export function NewProjectForm({ onCreateProject }: NewProjectFormProps) {
  const [payload, setPayload] = useState({
    name: "",
    address: "",
    customerName: "",
    customerEmail: "",
  });
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [lastProject, setLastProject] = useState<typeof payload | null>(null);

  const generateEmailBody = (project: typeof payload) => {
    const portalUrl = window.location.origin;
    return `Dear ${project.customerName},

Welcome to your project portal with Segal Build Pty Ltd.

Project: ${project.name}
Address: ${project.address}

You can access your project portal at:
${portalUrl}

Through the portal you will be able to:
• Review detailed quotations and scope of works
• View site photos and documentation
• Approve or request changes to quotes and variations
• Track project progress

If you have any questions, please don't hesitate to contact us.

Kind regards,
James Segal
Segal Build Pty Ltd
Registered Building Practitioner — Victoria
`;
  };

  const generateEmailSubject = (project: typeof payload) => {
    return `Welcome to Your Project Portal — ${project.name} | Segal Build`;
  };

  const openInEmailApp = (project: typeof payload) => {
    const subject = encodeURIComponent(generateEmailSubject(project));
    const body = encodeURIComponent(generateEmailBody(project));
    window.location.href = `mailto:${project.customerEmail}?subject=${subject}&body=${body}`;
  };

  const openInGmail = (project: typeof payload) => {
    const subject = encodeURIComponent(generateEmailSubject(project));
    const body = encodeURIComponent(generateEmailBody(project));
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${project.customerEmail}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  const copyToClipboard = (project: typeof payload) => {
    const text = `To: ${project.customerEmail}\nSubject: ${generateEmailSubject(project)}\n\n${generateEmailBody(project)}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("Email content copied to clipboard! Paste it into your email app.");
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload.name || !payload.address || !payload.customerName || !payload.customerEmail) return;
    onCreateProject(payload);
    setLastProject({ ...payload });
    setShowEmailPrompt(true);
    setPayload({ name: "", address: "", customerName: "", customerEmail: "" });
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">Create Project</h2>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Project Name"
          value={payload.name}
          onChange={(event) => setPayload((prev) => ({ ...prev, name: event.target.value }))}
        />
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Site Address"
          value={payload.address}
          onChange={(event) => setPayload((prev) => ({ ...prev, address: event.target.value }))}
        />
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Customer Name"
          value={payload.customerName}
          onChange={(event) => setPayload((prev) => ({ ...prev, customerName: event.target.value }))}
        />
        <input
          type="email"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Customer Email"
          value={payload.customerEmail}
          onChange={(event) => setPayload((prev) => ({ ...prev, customerEmail: event.target.value }))}
        />
        <button className="w-full rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900">
          Add Project
        </button>
      </form>

      {showEmailPrompt && lastProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-700">New Project Created</p>
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Send Welcome Email?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Send login details to <strong>{lastProject.customerName}</strong> at{" "}
                <strong>{lastProject.customerEmail}</strong>
              </p>
            </div>

            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 whitespace-pre-wrap">
              {generateEmailBody(lastProject)}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  openInEmailApp(lastProject);
                  setShowEmailPrompt(false);
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                📧 Open in Email App
              </button>
              <button
                onClick={() => {
                  openInGmail(lastProject);
                  setShowEmailPrompt(false);
                }}
                className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                ✉️ Open in Gmail
              </button>
              <button
                onClick={() => {
                  copyToClipboard(lastProject);
                  setShowEmailPrompt(false);
                }}
                className="w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-900"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={() => setShowEmailPrompt(false)}
                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}