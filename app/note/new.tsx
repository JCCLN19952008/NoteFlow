import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useNotesStore } from '@/store/notesStore'
import { useTagsStore } from '@/store/tagsStore'
import { noteSchema } from '@/schemas/noteSchema'

export default function NewNoteScreen() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})

  const addNote = useNotesStore((state) => state.addNote)
  const tags = useTagsStore((state) => state.tags)

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

 const handleSave = async () => {
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
    await addNote({ title, body, tags: selectedTags, pinned: false })
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.back()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>New Note</Text>
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
      <Text style={styles.wordCount}>
  {body.trim() === '' ? '0 words' : `${body.trim().split(/\s+/).length} words`}
</Text>
      {errors.body && <Text style={styles.errorText}>{errors.body}</Text>}

      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <TouchableOpacity
  key={tag.id}
  onPress={() => toggleTag(tag.id)}
  activeOpacity={1}
  style={[
    styles.tag,
    selectedTags.includes(tag.id)
      ? { backgroundColor: tag.color }
      : { backgroundColor: '#E8E8E8' },
  ]}
>
  <Text style={[
    styles.tagLabel,
    { color: selectedTags.includes(tag.id) ? '#fff' : '#555' }
  ]}>{tag.label}</Text>
</TouchableOpacity>
          ))}
        </View>
      )}
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
  wordCount: { fontSize: 11, color: '#BDBDBD', textAlign: 'right', marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 6, marginBottom: 6 },
tagLabel: { fontSize: 13, fontWeight: '600' },
})