/**
 * usePersistedAppState.ts
 * 
 * Persistence strategy (layered):
 * 1. On mount: try Firestore first, fall back to localStorage
 * 2. On every state change: save to BOTH localStorage (instant) and Firestore (async)
 * 3. Real-time listener: if another device updates Firestore, sync here automatically
 */

import { useEffect, useRef, useState } from "react";
import { createEmptyState, loadState, saveState } from "./stateService";
import {
  loadStateFromFirestore,
  saveStateToFirestore,
  subscribeToFirestore,
} from "./firestoreService";
import type { AppState } from "../types/appState";

export function usePersistedAppState() {
  const [state, setState] = useState<AppState>(createEmptyState);
  const [firestoreReady, setFirestoreReady] = useState(false);
  const isRemoteUpdate = useRef(false); // prevent save-loop on remote updates

  // ── Step 1: On mount, load from Firestore (or fall back to localStorage) ──
  useEffect(() => {
    async function hydrate() {
      // Always load localStorage first for instant UI
      const local = loadState();
      if (local) setState(local);

      // Then try Firestore — it may have newer data from another device
      try {
        const remote = await loadStateFromFirestore();
        if (remote) {
          setState(remote);
          // Also update localStorage to keep them in sync
          saveState(remote);
        }
      } catch (err) {
        console.warn("Firestore hydration failed — using localStorage", err);
      }

      setFirestoreReady(true);
    }

    hydrate();
  }, []);

  // ── Step 2: Real-time listener — sync from other devices ──
  useEffect(() => {
    if (!firestoreReady) return;

    const unsubscribe = subscribeToFirestore((remoteState) => {
      isRemoteUpdate.current = true;
      setState(remoteState);
      saveState(remoteState); // keep localStorage in sync
      // Reset flag after React processes the update
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 100);
    });

    return () => unsubscribe();
  }, [firestoreReady]);

  // ── Step 3: Save to both localStorage and Firestore on every change ──
  useEffect(() => {
    // Always save to localStorage immediately (fast, offline-safe)
    saveState(state);

    // Skip Firestore save if this update came FROM Firestore (prevent loop)
    if (isRemoteUpdate.current) return;

    // Save to Firestore async (don't block UI)
    if (firestoreReady) {
      saveStateToFirestore(state).catch(() => {
        // Silent fail — localStorage already has it
      });
    }
  }, [state, firestoreReady]);

  return { state, setState };
}
