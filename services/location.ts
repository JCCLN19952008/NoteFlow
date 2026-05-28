import * as Location from 'expo-location'

export async function getCurrentLocation(): Promise<string | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') return null

    let location = await Location.getLastKnownPositionAsync()
    
    if (!location) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      })
    }

    if (!location) return null

    const geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })

    if (geocode.length > 0) {
      const { city, region, country } = geocode[0]
      return [city, region, country].filter(Boolean).join(', ')
    }

    return null
  } catch (error) {
    console.log('Location error:', error)
    return null
  }
}