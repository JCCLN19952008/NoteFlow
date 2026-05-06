import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { useNotesStore, Note } from '@/store/notesStore'

function NoteCard({ note }: { note: Note }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push(`/note/${note.id}`)
      }}
    >
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
        data={notes}
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
  card: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardBody: { fontSize: 14, color: '#757575', marginBottom: 6 },
  cardTags: { fontSize: 12, color: '#9E9E9E' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#9E9E9E' },
  emptySubtext: { fontSize: 14, color: '#BDBDBD', marginTop: 6 },
})