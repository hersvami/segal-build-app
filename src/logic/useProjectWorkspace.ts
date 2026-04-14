import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { addVariationToProject, buildProject, removeProject, setVariationStatus as setVariationStatusInProjects } from "./projectService";
import type { AppState } from "../types/appState";
import type { Variation } from "../types/domain";
import { createRevision } from "../utils/variationGuards";

type SetAppState = Dispatch<SetStateAction<AppState>>;

export function useProjectWorkspace(state: AppState, setState: SetAppState) {
  // ── Derived selected project from persisted state ──
  const selectedProject = useMemo(
    () => state.projects.find((p) => p.id === state.selectedProjectId) ?? null,
    [state.selectedProjectId, state.projects]
  );

  // ── Select a project and default to its first variation ──
  const setSelectedProjectId = (id: string | null) => {
    setState((prev) => {
      const project = prev.projects.find((p) => p.id === id) ?? null;
      return {
        ...prev,
        selectedProjectId: id,
        // When switching projects, default to the first variation of the new project
        activeVariationId: project?.variations[0]?.id ?? null,
      };
    });
  };

  // ── Set the active variation within the current project ──
  const setActiveVariationId = (id: string | null) => {
    setState((prev) => ({ ...prev, activeVariationId: id }));
  };

  // ── Create a new project and select it ──
  const createProject = (payload: {
    name: string;
    address: string;
    customerName: string;
    customerEmail: string;
  }) => {
    const project = buildProject(payload);
    setState((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
      selectedProjectId: project.id,
      activeVariationId: null,
    }));
  };

  // ── Add or update a variation, and make it the active one ──
  const upsertVariation = (projectId: string, variation: Variation) => {
    setState((prev) => ({
      ...prev,
      projects: addVariationToProject(prev.projects, projectId, variation),
      // Make the newly created/updated variation the active one
      activeVariationId: variation.id,
    }));
  };

  // ── Delete a project, clearing selection if it was active ──
  const deleteProject = (projectId: string) => {
    setState((prev) => ({
      ...prev,
      projects: removeProject(prev.projects, projectId),
      selectedProjectId: prev.selectedProjectId === projectId ? null : prev.selectedProjectId,
      activeVariationId: prev.selectedProjectId === projectId ? null : prev.activeVariationId,
    }));
  };

  // ── Update a variation's status ──
  const updateVariationStatus = (
    projectId: string,
    variationId: string,
    status: Variation["status"],
    comment = ""
  ) => {
    setState((prev) => ({
      ...prev,
      projects: setVariationStatusInProjects(prev.projects, projectId, variationId, status, comment),
    }));
  };

  // ── Replace a variation with an updated copy ──
  const updateVariation = (projectId: string, variationId: string, updated: Variation) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          variations: project.variations.map((v) =>
            v.id === variationId ? updated : v
          ),
        };
      }),
    }));
  };

  // ── Create a revision and make it the active variation ──
  const createVariationRevision = (projectId: string, variation: Variation) => {
    const revision = createRevision(variation);
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          variations: [...project.variations, revision],
        };
      }),
      activeVariationId: revision.id,
    }));
    return revision;
  };

  return {
    selectedProject,
    selectedProjectId: state.selectedProjectId,
    activeVariationId: state.activeVariationId,
    setSelectedProjectId,
    setActiveVariationId,
    createProject,
    upsertVariation,
    deleteProject,
    updateVariationStatus,
    updateVariation,
    createVariationRevision,
  };
}
