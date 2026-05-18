import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Tag = {
  id: string
  label: string
  color: string
}

type TagsStore = {
  tags: Tag[]
  addTag: (label: string, color: string) => void
  deleteTag: (id: string) => void
}

export const useTagsStore = create<TagsStore>()(
  persist(
    (set) => ({
      tags: [],

      addTag: (label, color) =>
        set((state) => ({
          tags: [
            ...state.tags,
            {
              id: Date.now().toString(),
              label,
              color,
            },
          ],
        })),

      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'tags-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)