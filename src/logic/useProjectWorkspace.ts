import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { addVariationToProject, buildProject, removeProject, setVariationStatus as setVariationStatusInProjects } from "./projectService";
import type { AppState } from "../types/appState";
import type { Variation } from "../types/domain";
import { createRevision } from "../utils/variationGuards";

type SetAppState = Dispatch<SetStateAction<AppState>>;

export function useProjectWorkspace(state: AppState, setState: SetAppState) {
  const selectedProject = useMemo(
    () => state.projects.find((p) => p.id === state.selectedProjectId) ?? null,
    [state.selectedProjectId, state.projects]
  );

  const setSelectedProjectId = (id: string | null) => {
    setState((prev) => {
      const project = prev.projects.find((p) => p.id === id) ?? null;
      return {
        ...prev,
        selectedProjectId: id,
        activeVariationId: project?.variations[0]?.id ?? null,
      };
    });
  };

  const setActiveVariationId = (id: string | null) => {
    setState((prev) => ({ ...prev, activeVariationId: id }));
  };

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

  const upsertVariation = (projectId: string, variation: Variation) => {
    setState((prev) => ({
      ...prev,
      projects: addVariationToProject(prev.projects, projectId, variation),
      activeVariationId: variation.id,
    }));
  };

  const deleteProject = (projectId: string) => {
    setState((prev) => ({
      ...prev,
      projects: removeProject(prev.projects, projectId),
      selectedProjectId: prev.selectedProjectId === projectId ? null : prev.selectedProjectId,
      activeVariationId: prev.selectedProjectId === projectId ? null : prev.activeVariationId,
    }));
  };

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

  const updateVariation = (projectId: string, variationId: string, updated: Variation) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          variations: project.variations.map((v) => v.id === variationId ? updated : v),
        };
      }),
    }));
  };

  const createVariationRevision = (projectId: string, variation: Variation) => {
    const revision = createRevision(variation);
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== projectId) return project;
        return { ...project, variations: [...project.variations, revision] };
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
