import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { useNotesStore } from '@/store/notesStore'
import { useTagsStore } from '@/store/tagsStore'
import auth from '@react-native-firebase/auth'

const QUICK_NOTE_LIMIT = 50

export default function QuickScreen() {
  const [body, setBody] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const addNote = useNotesStore((state) => state.addNote)
  const notes = useNotesStore((state) => state.notes)
  const tags = useTagsStore((state) => state.tags)

  const quickNotes = notes
    .filter((n) => n.title === '__quick__')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
      return next
    })
  }

 const handleSave = async () => {
    if (body.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Note body is required')
      return
    }
    const userId = auth().currentUser?.uid ?? ''
    await addNote({ title: '__quick__', body: body.trim(), tags: selectedTags, pinned: false, userId })
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setBody('')
    setSelectedTags([])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quick Notes</Text>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Jot something down..."
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={QUICK_NOTE_LIMIT}
        />
        <Text style={[
          styles.charCount,
          body.length > 250 && styles.charCountWarning,
          body.length === QUICK_NOTE_LIMIT && styles.charCountLimit,
        ]}>
          {body.length}/{QUICK_NOTE_LIMIT}
        </Text>

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id)
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => {
                    toggleTag(tag.id)
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }}
                  style={[
                    styles.tag,
                    isSelected
                      ? { backgroundColor: tag.color }
                      : { backgroundColor: '#E8E8E8' },
                  ]}
                >
                  <Text style={[
                    { fontSize: 13, fontWeight: '500' },
                    { color: isSelected ? '#fff' : '#555' }
                  ]}>{tag.label}</Text>
                </Pressable>
              )
            })}
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Quick Note</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Quick Notes</Text>
      <FlashList
        data={quickNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardBody}>{item.body}</Text>
            {item.tags.length > 0 && (
              <View style={styles.cardTagsRow}>
                {item.tags.map((tag) => (
                  <View
                    key={tag.id}
                    style={[styles.cardTag, { backgroundColor: tag.color }]}
                  >
                    <Text style={styles.cardTagLabel}>{tag.label}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.cardDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No quick notes yet.</Text>
            <Text style={styles.emptySubtext}>Jot something down above.</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  inputSection: { marginBottom: 28 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagSelected: {},
  saveButton: { backgroundColor: '#6C47FF', borderRadius: 8, padding: 14, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#424242' },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 12 },
  cardBody: { fontSize: 15, color: '#212121', marginBottom: 8 },
  cardTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  cardTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  cardTagLabel: { color: '#fff', fontSize: 11, fontWeight: '500' },
  cardDate: { fontSize: 11, color: '#BDBDBD' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#9E9E9E' },
  emptySubtext: { fontSize: 14, color: '#BDBDBD', marginTop: 6 },
  charCount: { fontSize: 11, color: '#BDBDBD', textAlign: 'right', marginBottom: 8 },
  charCountWarning: { color: '#FB8C00' },
  charCountLimit: { color: '#E53935' },
})