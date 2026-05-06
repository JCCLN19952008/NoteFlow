import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useNotesStore } from '@/store/notesStore'
import { useTagsStore } from '@/store/tagsStore'
import { noteSchema } from '@/schemas/noteSchema'

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const notes = useNotesStore((state) => state.notes)
  const updateNote = useNotesStore((state) => state.updateNote)
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const tags = useTagsStore((state) => state.tags)

  const note = notes.find((n) => n.id === id)

  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [selectedTags, setSelectedTags] = useState<string[]>(note?.tags ?? [])
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found.</Text>
      </View>
    )
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  const handleSave = () => {
    const result = noteSchema.safeParse({ title, body, tags: selectedTags })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        title: fieldErrors.title?.[0],
        body: fieldErrors.body?.[0],
      })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setErrors({})
    updateNote(id, { title, body, tags: selectedTags })
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.back()
  }

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNote(id)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          router.back()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Edit Note</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <TextInput
        style={[styles.input, styles.bodyInput, errors.body && styles.inputError]}
        placeholder="Write your note..."
        value={body}
        onChangeText={setBody}
        multiline
      />
      {errors.body && <Text style={styles.errorText}>{errors.body}</Text>}

      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              style={[
                styles.tag,
                { backgroundColor: tag.color },
                selectedTags.includes(tag.id) && styles.tagSelected,
              ]}
            >
              <Text style={styles.tagLabel}>{tag.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heading: { fontSize: 18, fontWeight: '600' },
  cancel: { fontSize: 16, color: '#9E9E9E' },
  save: { fontSize: 16, color: '#6C47FF', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 4 },
  bodyInput: { height: 200, textAlignVertical: 'top' },
  inputError: { borderColor: '#E53935' },
  errorText: { color: '#E53935', fontSize: 12, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, opacity: 0.5 },
  tagSelected: { opacity: 1 },
  tagLabel: { color: '#fff', fontSize: 13, fontWeight: '500' },
  deleteButton: { marginTop: 32, alignItems: 'center' },
  deleteText: { color: '#E53935', fontSize: 16, fontWeight: '500' },
})