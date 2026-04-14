import type { Project } from "./domain";

export interface AppState {
  projects: Project[];
  companyId: string;
  selectedProjectId: string | null;
  activeVariationId: string | null;
}
