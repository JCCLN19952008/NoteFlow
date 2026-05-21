import { create } from 'zustand'
import { api, Tag } from '@/services/api'

type TagsStore = {
  tags: Tag[]
  loading: boolean
  fetchTags: () => Promise<void>
  addTag: (label: string, color: string) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export type { Tag }

export const useTagsStore = create<TagsStore>()((set) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true })
    try {
      const tags = await api.getTags()
      set({ tags })
    } finally {
      set({ loading: false })
    }
  },

  addTag: async (label, color) => {
    const tag = await api.createTag({ label, color })
    set((state) => ({ tags: [...state.tags, tag] }))
  },

  deleteTag: async (id) => {
    await api.deleteTag(id)
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
    }))
  },
}))