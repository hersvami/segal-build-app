import { useState } from "react";
import type { Project } from "../types/domain";

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

interface DeleteModalProps {
  project: Project;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ project, onConfirm, onCancel }: DeleteModalProps) {
  const [savedToDrive, setSavedToDrive] = useState(false);

  const generateProjectSummary = () => {
    const lines = [
      `PROJECT SUMMARY — ${project.name}`,
      `Address: ${project.address}`,
      `Customers: ${project.customers?.map((c) => `${c.name} (${c.email})`).join(", ") ?? project.customerName}`,
      `Created: ${new Date(project.createdAt).toLocaleDateString("en-AU")}`,
      `Documents: ${project.variations.length}`,
      ``,
      `VARIATIONS & QUOTES:`,
      ...project.variations.map((v) => [
        `  - ${v.title} (${v.mode}) — Status: ${v.status}`,
        `    Price: $${v.solutions[v.selectedSolution]?.clientCost.toLocaleString() ?? "0"}`,
        `    Created: ${new Date(v.createdAt).toLocaleDateString("en-AU")}`,
      ].join("\n")),
    ];
    return lines.join("\n");
  };

  const saveToGoogleDrive = () => {
    const summary = generateProjectSummary();
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}_project_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // Open Google Drive after download
    setTimeout(() => {
      window.open("https://drive.google.com/drive/my-drive", "_blank");
    }, 1000);

    setSavedToDrive(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-700">
            ⚠️ Delete Project
          </p>
          <h3 className="text-lg font-black tracking-tight text-slate-900">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            This will permanently delete this project and all its documents.
            This cannot be undone.
          </p>
        </div>

        {/* Project summary */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
          <p><strong>Address:</strong> {project.address}</p>
          <p><strong>Customers:</strong> {project.customers?.map((c) => c.name).join(", ") ?? project.customerName}</p>
          <p><strong>Documents:</strong> {project.variations.length} quotes/variations</p>
          <p><strong>Photos:</strong> {project.variations.reduce((sum, v) => sum + (v.photos?.length ?? 0) + (v.progressPhotos?.length ?? 0), 0)} total</p>
        </div>

        {/* Google Drive backup */}
        <div className={`rounded-xl border-2 p-3 space-y-2 ${savedToDrive ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"}`}>
          <p className={`text-sm font-bold ${savedToDrive ? "text-green-800" : "text-amber-800"}`}>
            {savedToDrive ? "✅ Project summary saved!" : "💾 Save to Google Drive first?"}
          </p>
          <p className={`text-xs ${savedToDrive ? "text-green-700" : "text-amber-700"}`}>
            {savedToDrive
              ? "Google Drive opened. Upload the downloaded file to keep a record."
              : "Download a project summary and save it to Google Drive before deleting."}
          </p>
          {!savedToDrive && (
            <button
              onClick={saveToGoogleDrive}
              className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
            >
              💾 Download Summary + Open Google Drive
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onConfirm}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            🗑️ Yes, Delete Project Permanently
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
          >
            Cancel — Keep Project
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
}: ProjectListProps) {
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setDeletingProject(project);
  };

  const handleConfirmDelete = () => {
    if (deletingProject) {
      onDeleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Projects</h2>
          <span className="text-xs font-semibold text-slate-500">{projects.length} total</span>
        </div>

        <div className="space-y-2">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={`group w-full rounded-xl border p-3 text-left transition ${
                selectedProjectId === project.id
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate">{project.name}</p>
                  <p className="line-clamp-1 text-xs text-slate-600">{project.address}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.variations.length} documents
                    {project.customers && project.customers.length > 1 && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                        {project.customers.length} customers
                      </span>
                    )}
                  </p>
                </div>
                <span
                  onClick={(e) => handleDeleteClick(e, project)}
                  className="invisible rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 group-hover:visible shrink-0"
                >
                  Delete
                </span>
              </div>
            </button>
          ))}

          {projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              No projects yet.
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deletingProject && (
        <DeleteModal
          project={deletingProject}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingProject(null)}
        />
      )}
    </>
  );
}
