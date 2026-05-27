const BASE_URL = 'https://noteflow-api-ten.vercel.app'

export const uploadImageToS3 = async (uri: string, userId: string): Promise<string> => {
  const formData = new FormData()
  
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'image.jpg',
  } as any)
  formData.append('userId', userId)

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!res.ok) throw new Error('Failed to upload image')

  const data = await res.json()
  return data.url
}