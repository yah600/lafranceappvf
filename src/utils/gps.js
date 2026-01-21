import { calculateDistance } from './calculators'
import { GEOFENCE_RADIUS_METERS, GEOFENCE_DURATION_MINUTES } from '@config/constants'

// Get current position
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        })
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  })
}

// Watch position (continuous tracking)
export const watchPosition = (callback) => {
  if (!navigator.geolocation) {
    console.error('Geolocation not supported')
    return null
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString(),
      })
    },
    (error) => console.error('GPS error:', error),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    }
  )

  return watchId
}

// Stop watching position
export const stopWatchingPosition = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

// Check if within geofence (100m for 3+ minutes)
export const isWithinGeofence = (currentLat, currentLng, targetLat, targetLng, radiusMeters = GEOFENCE_RADIUS_METERS) => {
  const distance = calculateDistance(currentLat, currentLng, targetLat, targetLng)
  const distanceMeters = distance * 1000
  return distanceMeters <= radiusMeters
}

// Check geofence status for auto-timer start
let geofenceStartTime = null

export const checkGeofenceForTimerStart = (currentLocation, jobLocation) => {
  const within = isWithinGeofence(
    currentLocation.lat,
    currentLocation.lng,
    jobLocation.lat,
    jobLocation.lng,
    GEOFENCE_RADIUS_METERS
  )

  if (within) {
    if (!geofenceStartTime) {
      geofenceStartTime = Date.now()
    }

    const elapsedMinutes = (Date.now() - geofenceStartTime) / 60000

    if (elapsedMinutes >= GEOFENCE_DURATION_MINUTES) {
      return { shouldStartTimer: true, withinGeofence: true }
    }

    return {
      shouldStartTimer: false,
      withinGeofence: true,
      minutesRemaining: GEOFENCE_DURATION_MINUTES - elapsedMinutes
    }
  } else {
    geofenceStartTime = null
    return { shouldStartTimer: false, withinGeofence: false }
  }
}

// Reset geofence timer
export const resetGeofenceTimer = () => {
  geofenceStartTime = null
}

// Generate Google Maps navigation URL
export const getNavigationURL = (destinationLat, destinationLng) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}&travelmode=driving`
}

// Check if GPS is enabled
export const isGPSEnabled = () => {
  return 'geolocation' in navigator
}

// Request GPS permission
export const requestGPSPermission = async () => {
  try {
    await getCurrentPosition()
    return { granted: true }
  } catch (error) {
    return { granted: false, error: error.message }
  }
}
