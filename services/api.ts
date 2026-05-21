const BASE_URL = 'https://noteflow-api-ten.vercel.app'

export type Note = {
  id: string
  title: string
  body: string
  pinned: boolean
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
  color: string
  createdAt: string
}

export const api = {
  // Notes
  getNotes: async (): Promise<Note[]> => {
    const res = await fetch(`${BASE_URL}/api/notes`)
    if (!res.ok) throw new Error('Failed to fetch notes')
    return res.json()
  },

  createNote: async (data: {
    title: string
    body: string
    tags: string[]
    pinned: boolean
  }): Promise<Note> => {
    const res = await fetch(`${BASE_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create note')
    return res.json()
  },

  updateNote: async (
    id: string,
    data: { title: string; body: string; tags: string[] }
  ): Promise<Note> => {
    const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update note')
    return res.json()
  },

  deleteNote: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete note')
  },

  togglePin: async (id: string): Promise<Note> => {
    const res = await fetch(`${BASE_URL}/api/notes/${id}/pin`, {
      method: 'PATCH',
    })
    if (!res.ok) throw new Error('Failed to toggle pin')
    return res.json()
  },

  // Tags
  getTags: async (): Promise<Tag[]> => {
    const res = await fetch(`${BASE_URL}/api/tags`)
    if (!res.ok) throw new Error('Failed to fetch tags')
    return res.json()
  },

  createTag: async (data: { label: string; color: string }): Promise<Tag> => {
    const res = await fetch(`${BASE_URL}/api/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create tag')
    return res.json()
  },

  deleteTag: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/tags/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete tag')
  },
}