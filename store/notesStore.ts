import { create } from 'zustand'
import { api, Note } from '@/services/api'

type NotesStore = {
  notes: Note[]
  loading: boolean
  fetchNotes: () => Promise<void>
  addNote: (data: { title: string; body: string; tags: string[]; pinned: boolean }) => Promise<void>
  updateNote: (id: string, changes: { title: string; body: string; tags: string[] }) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
}

export type { Note }

export const useNotesStore = create<NotesStore>()((set) => ({
  notes: [],
  loading: false,

  fetchNotes: async () => {
    set({ loading: true })
    try {
      const notes = await api.getNotes()
      set({ notes })
    } finally {
      set({ loading: false })
    }
  },

  addNote: async (data) => {
  await api.createNote(data)
  const notes = await api.getNotes()
  set({ notes })
},

  updateNote: async (id, changes) => {
  await api.updateNote(id, changes)
  const notes = await api.getNotes()
  set({ notes })
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