import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { useNotesStore, Note } from '@/store/notesStore'

function NoteCard({ note }: { note: Note }) {
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const togglePin = useNotesStore((state) => state.togglePin)

  const handleLongPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    Alert.alert('Note Options', '', [
      {
        text: note.pinned ? 'Unpin' : 'Pin',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          togglePin(note.id)
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          deleteNote(note.id)
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  return (
    <TouchableOpacity
      style={[styles.card, note.pinned && styles.cardPinned]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push(`/note/${note.id}`)
      }}
      onLongPress={handleLongPress}
    >
      {note.pinned && <Text style={styles.pinnedLabel}>📌 Pinned</Text>}
      <Text style={styles.cardTitle} numberOfLines={1}>{note.title}</Text>
      <Text style={styles.cardBody} numberOfLines={2}>{note.body}</Text>
      {note.tags.length > 0 && (
        <Text style={styles.cardTags}>{note.tags.length} tag{note.tags.length > 1 ? 's' : ''}</Text>
      )}
    </TouchableOpacity>
  )
}

export default function NotesScreen() {
  const notes = useNotesStore((state) => state.notes)

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.createdAt - a.createdAt
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Notes</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            router.push('/note/new')
          }}
        >
          <Text style={styles.addButton}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No notes yet.</Text>
            <Text style={styles.emptySubtext}>Tap + New to get started.</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  heading: { fontSize: 28, fontWeight: '700' },
  addButton: { fontSize: 16, color: '#6C47FF', fontWeight: '600' },
  card: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#fff' },
  cardPinned: { borderColor: '#6C47FF', backgroundColor: '#F9F7FF' },
  pinnedLabel: { fontSize: 11, color: '#6C47FF', marginBottom: 4, fontWeight: '500' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardBody: { fontSize: 14, color: '#757575', marginBottom: 6 },
  cardTags: { fontSize: 12, color: '#9E9E9E' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#9E9E9E' },
  emptySubtext: { fontSize: 14, color: '#BDBDBD', marginTop: 6 },
})