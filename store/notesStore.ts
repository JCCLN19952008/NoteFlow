import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
}

export type Note = {
  id: string
  title: string
  body: string
  pinned: boolean
  tags: string[]
  createdAt: number
  updatedAt: number
}

type NotesStore = {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, changes: Partial<Pick<Note, 'title' | 'body' | 'tags'>>) => void
  deleteNote: (id: string) => void
  togglePin: (id: string) => void
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],

      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: Date.now().toString(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),

      updateNote: (id, changes) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...changes, updatedAt: Date.now() } : n
          ),
        })),

        togglePin: (id: string) =>
        set((state) => ({
         notes: state.notes.map((n) =>
         n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
    ),
  })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)