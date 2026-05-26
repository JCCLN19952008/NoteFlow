import { create } from 'zustand'
import { api, Note } from '@/services/api'

type NotesStore = {
  notes: Note[]
  loading: boolean
  userId: string | null
  setUserId: (userId: string) => void
  fetchNotes: (userId: string) => Promise<void>
  addNote: (data: { title: string; body: string; tags: string[]; pinned: boolean; userId: string }) => Promise<void>
  updateNote: (id: string, changes: { title: string; body: string; tags: string[]; imageUrl?: string | null }) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
}

export type { Note }

export const useNotesStore = create<NotesStore>()((set, get) => ({
  notes: [],
  loading: false,
  userId: null,

  setUserId: (userId) => set({ userId }),

  fetchNotes: async (userId) => {
    set({ loading: true, userId })
    try {
      const notes = await api.getNotes(userId)
      set({ notes })
    } finally {
      set({ loading: false })
    }
  },

  addNote: async (data) => {
    await api.createNote(data)
    const notes = await api.getNotes(data.userId)
    set({ notes })
  },

  updateNote: async (id, changes) => {
    await api.updateNote(id, changes)
    const userId = get().userId
    if (userId) {
      const notes = await api.getNotes(userId)
      set({ notes })
    }
  },

  deleteNote: async (id) => {
    await api.deleteNote(id)
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }))
  },

  togglePin: async (id) => {
    const updated = await api.togglePin(id)
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? updated : n)),
    }))
  },
}))