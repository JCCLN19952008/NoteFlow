import { router } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { useNotesStore, Note } from '@/store/notesStore'
import { useState } from 'react'
import { useTagsStore } from '@/store/tagsStore'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Image } from 'react-native'

function NoteCard({ note }: { note: Note }) {
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const togglePin = useNotesStore((state) => state.togglePin)
  const tags = useTagsStore((state) => state.tags)

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
      {note.imageUrl && (
        <Image
          source={{ uri: note.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}
      {note.tags.length > 0 && (
  <View style={styles.cardTagDots}>
    {note.tags.slice(0, 5).map((tag) => (
      <View key={tag.id} style={[styles.cardTagDot, { backgroundColor: tag.color }]} />
    ))}
  </View>
)}
      <Text style={styles.cardDate}>
  {new Date(note.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
</Text>
    </TouchableOpacity>
  )
}

export default function NotesScreen() {
  const notes = useNotesStore((state) => state.notes)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  
  const [search, setSearch] = useState('')

const filteredNotes = sortedNotes.filter((note) =>
  note.title.toLowerCase().includes(search.toLowerCase()) ||
  note.body.toLowerCase().includes(search.toLowerCase())
)

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
      <TextInput
  style={styles.searchInput}
  placeholder="Search notes..."
  value={search}
  onChangeText={setSearch}
  clearButtonMode="while-editing"
/>

      <FlashList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
    <Text style={styles.emptyIcon}>📝</Text>
    <Text style={styles.emptyText}>No notes yet.</Text>
    <Text style={styles.emptySubtext}>
      {search.length > 0 ? 'No notes match your search.' : 'Tap + New to get started.'}
    </Text>
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
  searchInput: { marginHorizontal: 20, marginBottom: 16, padding: 12, borderRadius: 10, backgroundColor: '#F5F5F5', fontSize: 15, color: '#212121' },
  addButton: { fontSize: 16, color: '#6C47FF', fontWeight: '600' },
  card: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#fff' },
  cardDate: { fontSize: 11, color: '#BDBDBD', marginTop: 4 },
  cardPinned: { borderColor: '#6C47FF', backgroundColor: '#F9F7FF' },
  pinnedLabel: { fontSize: 11, color: '#6C47FF', marginBottom: 4, fontWeight: '500' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardBody: { fontSize: 14, color: '#757575', marginBottom: 6 },
  cardTags: { fontSize: 12, color: '#9E9E9E' },
  empty: { alignItems: 'center', marginTop: 80 },
  cardTagDots: { flexDirection: 'row', gap: 4, marginTop: 6 },
  cardTagDot: { width: 8, height: 8, borderRadius: 4 },
  cardImage: { width: '100%', height: 80, borderRadius: 6, marginBottom: 6 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#9E9E9E' },
  emptySubtext: { fontSize: 14, color: '#BDBDBD', marginTop: 6, textAlign: 'center', paddingHorizontal: 40 },
})