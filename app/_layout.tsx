import { useEffect, useState } from 'react'
import { Stack, router } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { useNotesStore } from '@/store/notesStore'
import { useTagsStore } from '@/store/tagsStore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { requestNotificationPermissions, scheduleDailyReminder } from '@/services/notifications'


export default function RootLayout() {
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const fetchTags = useTagsStore((state) => state.fetchTags)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const [initialising, setInitialising] = useState(true)

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      if (initialising) setInitialising(false)
    })
    return subscriber
  }, [])

  useEffect(() => {
    if (initialising) return
    if (!user) {
      router.replace('/auth')
    } else {
      fetchNotes(user.uid)
      fetchTags(user.uid)
      setTimeout(async () => {
        try {
          const granted = await requestNotificationPermissions()
          if (granted) await scheduleDailyReminder()
        } catch (e) {
          console.log('Notification setup error:', e)
        }
      }, 3000)
      router.replace('/(tabs)')
    }
  }, [user, initialising])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GluestackUIProvider>
    </GestureHandlerRootView>
  )
}