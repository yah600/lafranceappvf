import { openDB } from 'idb'

const DB_NAME = 'lafrance-dispatch'
const DB_VERSION = 1

// Initialize IndexedDB
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores
      if (!db.objectStoreNames.contains('pending_jobs')) {
        db.createObjectStore('pending_jobs', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('pending_photos')) {
        db.createObjectStore('pending_photos', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('pending_signatures')) {
        db.createObjectStore('pending_signatures', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('cached_jobs')) {
        db.createObjectStore('cached_jobs', { keyPath: 'id' })
      }
    },
  })
}

// Save job for offline completion
export const saveJobOffline = async (job) => {
  const db = await initDB()
  await db.put('pending_jobs', job)
}

// Get all pending offline jobs
export const getPendingJobs = async () => {
  const db = await initDB()
  return db.getAll('pending_jobs')
}

// Save photo offline
export const savePhotoOffline = async (jobId, photoData) => {
  const db = await initDB()
  const photo = {
    id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    jobId,
    data: photoData,
    timestamp: new Date().toISOString(),
  }
  await db.put('pending_photos', photo)
  return photo
}

// Get pending photos for job
export const getPendingPhotos = async (jobId) => {
  const db = await initDB()
  const allPhotos = await db.getAll('pending_photos')
  return allPhotos.filter(p => p.jobId === jobId)
}

// Save signature offline
export const saveSignatureOffline = async (jobId, signatureData) => {
  const db = await initDB()
  await db.put('pending_signatures', {
    id: jobId,
    signature: signatureData,
    timestamp: new Date().toISOString(),
  })
}

// Get pending signature
export const getPendingSignature = async (jobId) => {
  const db = await initDB()
  return db.get('pending_signatures', jobId)
}

// Sync all pending data when online
export const syncPendingData = async () => {
  const db = await initDB()

  // Get all pending data
  const pendingJobs = await db.getAll('pending_jobs')
  const pendingPhotos = await db.getAll('pending_photos')
  const pendingSignatures = await db.getAll('pending_signatures')

  const results = {
    jobs: [],
    photos: [],
    signatures: [],
    errors: [],
  }

  // Sync jobs
  for (const job of pendingJobs) {
    try {
      // In real app, this would be an API call
      // await api.submitCompletedJob(job)

      results.jobs.push(job.id)
      await db.delete('pending_jobs', job.id)
    } catch (error) {
      results.errors.push({ type: 'job', id: job.id, error })
    }
  }

  // Sync photos
  for (const photo of pendingPhotos) {
    try {
      // await api.uploadPhoto(photo)

      results.photos.push(photo.id)
      await db.delete('pending_photos', photo.id)
    } catch (error) {
      results.errors.push({ type: 'photo', id: photo.id, error })
    }
  }

  // Sync signatures
  for (const sig of pendingSignatures) {
    try {
      // await api.uploadSignature(sig)

      results.signatures.push(sig.id)
      await db.delete('pending_signatures', sig.id)
    } catch (error) {
      results.errors.push({ type: 'signature', id: sig.id, error })
    }
  }

  return results
}

// Cache job for offline viewing
export const cacheJob = async (job) => {
  const db = await initDB()
  await db.put('cached_jobs', {
    ...job,
    cachedAt: new Date().toISOString(),
  })
}

// Get cached jobs
export const getCachedJobs = async () => {
  const db = await initDB()
  return db.getAll('cached_jobs')
}

// Get cached job by ID
export const getCachedJob = async (jobId) => {
  const db = await initDB()
  return db.get('cached_jobs', jobId)
}

// Clear all cached data
export const clearCache = async () => {
  const db = await initDB()
  await db.clear('cached_jobs')
}

// Check network status
export const isOnline = () => navigator.onLine

// Setup online/offline event listeners
export const setupNetworkListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}
