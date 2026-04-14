/**
 * firestoreService.ts
 * Syncs AppState to Firestore under a fixed document path.
 * Uses a single document per installation (no auth required).
 * Falls back silently to localStorage if Firestore is unavailable.
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { AppState } from "../types/appState";

// ── Fixed device key stored in localStorage ──
// Each browser session gets a unique ID so multiple devices don't overwrite each other.
// For a multi-user app you would use Firebase Auth UID here instead.
function getDeviceId(): string {
  let id = localStorage.getItem("segal_build_device_id");
  if (!id) {
    id = `device_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("segal_build_device_id", id);
  }
  return id;
}

function getDocRef() {
  const deviceId = getDeviceId();
  return doc(db, "appState", deviceId);
}

/**
 * Load state from Firestore.
 * Returns null if unavailable or not yet saved.
 */
export async function loadStateFromFirestore(): Promise<AppState | null> {
  try {
    const snap = await getDoc(getDocRef());
    if (!snap.exists()) return null;
    const data = snap.data() as AppState;
    if (!Array.isArray(data.projects) || typeof data.companyId !== "string") {
      return null;
    }
    return {
      ...data,
      selectedProjectId: data.selectedProjectId ?? null,
      activeVariationId: data.activeVariationId ?? null,
    };
  } catch (err) {
    console.warn("Firestore load failed — using localStorage fallback", err);
    return null;
  }
}

/**
 * Save state to Firestore.
 * Silently fails if Firestore is unavailable.
 */
export async function saveStateToFirestore(state: AppState): Promise<void> {
  try {
    await setDoc(getDocRef(), state);
  } catch (err) {
    console.warn("Firestore save failed — data saved to localStorage only", err);
  }
}

/**
 * Subscribe to real-time Firestore updates.
 * Calls onChange whenever data changes (e.g. from another device).
 * Returns an unsubscribe function.
 */
export function subscribeToFirestore(
  onChange: (state: AppState) => void
): Unsubscribe {
  try {
    return onSnapshot(getDocRef(), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as AppState;
      if (Array.isArray(data.projects) && typeof data.companyId === "string") {
        onChange({
          ...data,
          selectedProjectId: data.selectedProjectId ?? null,
          activeVariationId: data.activeVariationId ?? null,
        });
      }
    });
  } catch (err) {
    console.warn("Firestore subscription failed", err);
    return () => {}; // no-op unsubscribe
  }
}
