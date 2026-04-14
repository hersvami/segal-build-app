import type { Project, Variation } from "../types/domain";
import { generateId } from "../utils/id";

interface CreateProjectPayload {
  name: string;
  address: string;
  customerName: string;
  customerEmail: string;
}

export function buildProject(payload: CreateProjectPayload): Project {
  return {
    id: generateId(),
    name: payload.name,
    address: payload.address,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customers: [
      {
        id: generateId(),
        name: payload.customerName,
        email: payload.customerEmail,
        isPrimary: true,
      },
    ],
    createdAt: new Date().toISOString(),
    variations: [],
    messages: [],
  };
}

export function addVariationToProject(
  projects: Project[],
  projectId: string,
  variation: Variation
): Project[] {
  return projects.map((project) => {
    if (project.id !== projectId) return project;
    return { ...project, variations: [variation, ...project.variations] };
  });
}

export function removeProject(projects: Project[], projectId: string): Project[] {
  return projects.filter((project) => project.id !== projectId);
}

export function setVariationStatus(
  projects: Project[],
  projectId: string,
  variationId: string,
  status: Variation["status"],
  comment = ""
): Project[] {
  return projects.map((project) => {
    if (project.id !== projectId) return project;

    return {
      ...project,
      variations: project.variations.map((variation) =>
        variation.id === variationId
          ? { ...variation, status, customerComment: comment }
          : variation
      ),
    };
  });
}
