const BASE_URL = 'https://noteflow-api-ten.vercel.app'

export const uploadImageToS3 = async (uri: string, userId: string): Promise<string> => {
  const response = await fetch(uri)
  const blob = await response.blob()

  const formData = new FormData()
  formData.append('file', blob as any, 'image.jpg')
  formData.append('userId', userId)

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Failed to upload image')

  const data = await res.json()
  return data.url
}