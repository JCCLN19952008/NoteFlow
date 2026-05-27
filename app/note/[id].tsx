import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useNotesStore } from '@/store/notesStore'
import { useTagsStore } from '@/store/tagsStore'
import { noteSchema } from '@/schemas/noteSchema'
import * as ImagePicker from 'expo-image-picker'
import { uploadImageToS3 } from '@/services/s3'
import { Image } from 'react-native'
import auth from '@react-native-firebase/auth'

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const notes = useNotesStore((state) => state.notes)
  const updateNote = useNotesStore((state) => state.updateNote)
  const deleteNote = useNotesStore((state) => state.deleteNote)
  const tags = useTagsStore((state) => state.tags)

  const note = notes.find((n) => n.id === id)

  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    note?.tags?.map((t) => t.id).filter((id) => tags.some((tag) => tag.id === id)) ?? []
  )
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})
  const [imageUrl, setImageUrl] = useState<string | null>(note?.imageUrl ?? null)
  
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

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      const userId = auth().currentUser?.uid ?? ''
      const url = await uploadImageToS3(result.assets[0].uri, userId)
      setImageUrl(url)
    }
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
    await updateNote(id, { title, body, tags: selectedTags, imageUrl })
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
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}
    >
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

      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>
          {imageUrl ? 'Change Image' : '+ Add Image'}
        </Text>
      </TouchableOpacity>

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </TouchableOpacity>
    </ScrollView>
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
  deleteButton: { marginTop: 32, alignItems: 'center' },
  deleteText: { color: '#E53935', fontSize: 16, fontWeight: '500' },
  imageButton: { marginTop: 16, borderWidth: 1, borderColor: '#6C47FF', borderRadius: 8, padding: 12, alignItems: 'center' },
  imageButtonText: { color: '#6C47FF', fontWeight: '600', fontSize: 14 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginTop: 12 },

})