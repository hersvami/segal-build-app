import type { AppState } from "../types/appState";

const APP_VERSION = "2.0";
const STORAGE_KEY = "segal_build_modular_state_v2";
const VERSION_KEY = "segal_build_app_version";

export function createEmptyState(): AppState {
  return {
    projects: [],
    companyId: "segal-build",
    selectedProjectId: null,
    activeVariationId: null,
  };
}

export function loadState(): AppState | null {
  // Check version — if old version, clear and start fresh
  const savedVersion = localStorage.getItem(VERSION_KEY);
  if (savedVersion !== APP_VERSION) {
    // Clear old state from any previous version keys
    localStorage.removeItem("segal_build_modular_state_v1");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    console.log(`App upgraded to v${APP_VERSION} — cleared old state`);
    return null;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AppState;
    if (!Array.isArray(parsed.projects) || typeof parsed.companyId !== "string") {
      return null;
    }
    // Safely migrate older saved states
    return {
      ...parsed,
      selectedProjectId: parsed.selectedProjectId ?? null,
      activeVariationId: parsed.activeVariationId ?? null,
      projects: parsed.projects.map((p) => ({
        ...p,
        customers: p.customers ?? [
          {
            id: p.id + "_c1",
            name: p.customerName,
            email: p.customerEmail,
            isPrimary: true,
          },
        ],
      })),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(VERSION_KEY, APP_VERSION);
}
