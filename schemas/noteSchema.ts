import { z } from 'zod'

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  body: z
    .string()
    .min(1, 'Note body is required')
    .max(5000, 'Note body cannot exceed 5000 characters'),
  tags: z
    .array(z.string())
    .max(10, 'Cannot add more than 10 tags'),
})

export type NoteFormData = z.infer<typeof noteSchema>