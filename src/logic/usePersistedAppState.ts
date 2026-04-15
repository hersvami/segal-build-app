import { useState, useEffect } from 'react';
import type { AppState } from '../types/appState';

const APP_VERSION = '2.0';
const STORAGE_KEY = `segal-build-v${APP_VERSION}`;

const EMPTY_STATE: AppState = {
  activeCompanyId: 'segal-build',
  projects: [],
  variations: {},
  activeProjectId: null,
  activeVariationId: null,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed._version === APP_VERSION) {
        return parsed;
      }
    }
    // Clear any old version keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('segal-build-')) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return EMPTY_STATE;
}

function saveState(state: AppState) {
  try {
    const toSave = { ...state, _version: APP_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function usePersistedAppState() {
  const [appState, setAppState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(appState);
  }, [appState]);

  return { appState, setAppState };
}