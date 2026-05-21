import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { useNotesStore } from '@/store/notesStore'
import { useTagsStore } from '@/store/tagsStore'

export default function RootLayout() {
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const fetchTags = useTagsStore((state) => state.fetchTags)

  useEffect(() => {
    fetchNotes()
    fetchTags()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GluestackUIProvider>
    </GestureHandlerRootView>
  )
}