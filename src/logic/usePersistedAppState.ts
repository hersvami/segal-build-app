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
import { loadStateFromFirestore, saveStateToFirestore, subscribeToFirestore } from "./firestoreService";
import type { AppState } from "../types/appState";

export function usePersistedAppState() {
  const [state, setState] = useState<AppState>(createEmptyState());
  const [firestoreReady, setFirestoreReady] = useState(false);
  const isRemoteUpdate = useRef(false);

  // ── Step 1: On mount, load from Firestore (or fall back to localStorage) ──
  useEffect(() => {
    async function hydrate() {
      const local = loadState();
      if (local) setState(local);

      try {
        const remote = await loadStateFromFirestore();
        if (remote) {
          setState(remote);
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
      saveState(remoteState);
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 100);
    });
    return () => unsubscribe();
  }, [firestoreReady]);

  // ── Step 3: Save to both localStorage and Firestore on every change ──
  useEffect(() => {
    saveState(state);
    if (isRemoteUpdate.current) return;
    if (firestoreReady) {
      saveStateToFirestore(state).catch(() => {});
    }
  }, [state, firestoreReady]);

  return { state, setState };
}
