import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { NewProjectForm } from "./components/NewProjectForm";
import { ProjectBoard } from "./components/ProjectBoard";
import { ProjectList } from "./components/ProjectList";
import { VariationWizard } from "./components/VariationWizard";
import { COMPANIES } from "./constants/companies";
import { usePersistedAppState } from "./logic/usePersistedAppState";
import { useProjectWorkspace } from "./logic/useProjectWorkspace";
import type { Company, Message, Project, Variation } from "./types/domain";

export default function App() {
  const { state, setState } = usePersistedAppState();
  const {
    selectedProject,
    selectedProjectId,
    activeVariationId,
    setSelectedProjectId,
    setActiveVariationId,
    createProject,
    upsertVariation,
    deleteProject,
    updateVariationStatus,
    updateVariation,
    createVariationRevision,
  } = useProjectWorkspace(state, setState);

  const [wizardMode, setWizardMode] = useState<"quote" | "variation" | null>(null);

  const currentCompany: Company = COMPANIES[state.companyId] ?? COMPANIES["segal-build"];

  const sendMessage = (projectId: string, message: Message) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          messages: [...(project.messages || []), message],
        };
      }),
    }));
  };

  const handleCreateRevision = (variation: Variation) => {
    if (!selectedProject) return;
    createVariationRevision(selectedProject.id, variation);
  };

  const handleUpdateProject = (updated: Project) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === updated.id ? updated : p)),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader
        company={currentCompany}
        companies={COMPANIES}
        onSwitchCompany={(companyId) => setState((prev) => ({ ...prev, companyId }))}
      />

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <NewProjectForm onCreateProject={createProject} />
          <ProjectList
            projects={state.projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onDeleteProject={deleteProject}
          />
        </aside>

        <section>
          {selectedProject ? (
            <ProjectBoard
              project={selectedProject}
              companyId={state.companyId}
              activeVariationId={activeVariationId}
              onSetActiveVariationId={setActiveVariationId}
              onStartQuote={() => setWizardMode("quote")}
              onStartVariation={() => setWizardMode("variation")}
              onUpdateVariationStatus={(variationId, status, comment) =>
                updateVariationStatus(selectedProject.id, variationId, status, comment)
              }
              onUpdateVariation={(variationId, updated) =>
                updateVariation(selectedProject.id, variationId, updated)
              }
              onCreateRevision={handleCreateRevision}
              onSendMessage={(message) => sendMessage(selectedProject.id, message)}
              onUpdateProject={handleUpdateProject}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Select A Project</h2>
              <p className="mt-2 text-sm text-slate-600">
                Create or pick a project to start modular quote and variation workflows.
              </p>
            </div>
          )}
        </section>
      </main>

      {selectedProject && wizardMode && (
        <VariationWizard
          mode={wizardMode}
          project={selectedProject}
          companyId={state.companyId}
          onClose={() => setWizardMode(null)}
          onSave={(variation) => {
            upsertVariation(selectedProject.id, variation);
            setWizardMode(null);
          }}
        />
      )}
    </div>
  );
}
