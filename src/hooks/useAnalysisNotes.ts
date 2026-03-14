import { useState, useCallback } from "react";
import type { AnalysisNote } from "../lib/types";

// Local storage based for now (Supabase integration later)
const STORAGE_KEY = "macro-analysis-notes";

function loadNotes(): AnalysisNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: AnalysisNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useAnalysisNotes() {
  const [notes, setNotes] = useState<AnalysisNote[]>(loadNotes);

  const addNote = useCallback((note: Omit<AnalysisNote, "id" | "created_at" | "updated_at" | "is_archived">) => {
    const newNote: AnalysisNote = {
      ...note,
      id: crypto.randomUUID(),
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      saveNotes(updated);
      return updated;
    });
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, data: Partial<AnalysisNote>) => {
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, ...data, updated_at: new Date().toISOString() } : n);
      saveNotes(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, []);

  const toggleArchive = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, is_archived: !n.is_archived, updated_at: new Date().toISOString() } : n);
      saveNotes(updated);
      return updated;
    });
  }, []);

  return { notes, addNote, updateNote, deleteNote, toggleArchive };
}
