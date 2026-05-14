import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import * as Haptics from 'expo-haptics'
import { useTagsStore, Tag } from '@/store/tagsStore'

const PRESET_COLORS = [
  '#6C47FF', '#E53935', '#43A047', '#FB8C00',
  '#00ACC1', '#8E24AA', '#F4511E', '#3949AB',
]

function DeleteAction({ onDelete }: { onDelete: () => void }) {
  return (
    <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  )
}

function TagRow({ tag }: { tag: Tag }) {
  const deleteTag = useTagsStore((state) => state.deleteTag)

  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <DeleteAction
          onDelete={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
            deleteTag(tag.id)
          }}
        />
      )}
    >
      <View style={styles.tagRow}>
        <View style={[styles.tagColorDot, { backgroundColor: tag.color }]} />
        <Text style={styles.tagLabel}>{tag.label}</Text>
      </View>
    </ReanimatedSwipeable>
  )
}

export default function ManageScreen() {
  const [label, setLabel] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const tags = useTagsStore((state) => state.tags)
  const addTag = useTagsStore((state) => state.addTag)

  const handleAddTag = () => {
    if (label.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Tag name is required')
      return
    }
    if (tags.some((t) => t.label.toLowerCase() === label.trim().toLowerCase())) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('A tag with that name already exists')
      return
    }
    addTag(label.trim(), selectedColor)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setLabel('')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Tag</Text>
        <TextInput
          style={styles.input}
          placeholder="Tag name"
          value={label}
          onChangeText={setLabel}
          maxLength={20}
        />
        <View style={styles.colorRow}>
          {PRESET_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => {
                setSelectedColor(color)
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                selectedColor === color && styles.colorDotSelected,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTag}>
          <Text style={styles.addButtonText}>Add Tag</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Tags</Text>
      <FlashList
        data={tags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TagRow tag={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tags yet.</Text>
            <Text style={styles.emptySubtext}>Create one above to get started.</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#424242' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12 },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotSelected: { borderWidth: 3, borderColor: '#212121' },
  addButton: { backgroundColor: '#6C47FF', borderRadius: 8, padding: 14, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  tagRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', backgroundColor: '#fff' },
  tagColorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  tagLabel: { fontSize: 16, color: '#212121' },
  deleteAction: { backgroundColor: '#E53935', justifyContent: 'center', alignItems: 'center', width: 80 },
  deleteActionText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#9E9E9E' },
  emptySubtext: { fontSize: 14, color: '#BDBDBD', marginTop: 6 },
})