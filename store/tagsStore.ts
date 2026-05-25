import { create } from 'zustand'
import { api, Tag } from '@/services/api'

type TagsStore = {
  tags: Tag[]
  loading: boolean
  userId: string | null
  fetchTags: (userId: string) => Promise<void>
  addTag: (label: string, color: string, userId: string) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export type { Tag }

export const useTagsStore = create<TagsStore>()((set, get) => ({
  tags: [],
  loading: false,
  userId: null,

  fetchTags: async (userId) => {
    set({ loading: true, userId })
    try {
      const tags = await api.getTags(userId)
      set({ tags })
    } finally {
      set({ loading: false })
    }
  },

  addTag: async (label, color, userId) => {
    const tag = await api.createTag({ label, color, userId })
    set((state) => ({ tags: [...state.tags, tag] }))
  },

 deleteTag: async (id) => {
    await api.deleteTag(id)
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
    }))
    const userId = get().userId
    if (userId) {
      const { useNotesStore } = require('@/store/notesStore')
      await useNotesStore.getState().fetchNotes(userId)
    }
  },
}))