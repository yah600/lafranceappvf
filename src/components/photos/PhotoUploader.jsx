import { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import './PhotoUploader.css'

function PhotoUploader({ photos = [], onPhotosChange, jobId, maxPhotos = 10 }) {
  const cameraInputRef = useRef(null)
  const uploadInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)

    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos`)
      return
    }

    const newPhotos = []

    for (const file of files) {
      // Compress and convert to base64
      const compressed = await compressImage(file)
      const base64 = await fileToBase64(compressed)

      newPhotos.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        data: base64,
        timestamp: new Date().toISOString(),
        size: compressed.size,
      })
    }

    const updated = [...photos, ...newPhotos]
    onPhotosChange(updated)

    // Reset input
    e.target.value = ''
  }

  const handleRemove = (photoId) => {
    if (confirm('Supprimer cette photo?')) {
      const updated = photos.filter((p) => p.id !== photoId)
      onPhotosChange(updated)
    }
  }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          // Max dimensions
          const maxWidth = 1920
          const maxHeight = 1080

          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
              )
            },
            'image/jpeg',
            0.8
          )
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="photo-uploader">
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.data} alt="Job photo" className="photo-image" />
              <button
                className="photo-remove"
                onClick={() => handleRemove(photo.id)}
                type="button"
              >
                <X size={16} />
              </button>
              <div className="photo-timestamp">
                {new Date(photo.timestamp).toLocaleTimeString('fr-CA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons */}
      <div className="upload-buttons">
        <button
          className="btn btn-primary"
          onClick={() => cameraInputRef.current?.click()}
          type="button"
        >
          <Camera size={18} />
          Prendre photo
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => uploadInputRef.current?.click()}
          type="button"
        >
          <Upload size={18} />
          Uploader
        </button>
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Counter */}
      <div className="photo-counter">
        {photos.length}/{maxPhotos} photos
      </div>
    </div>
  )
}

export default PhotoUploader
