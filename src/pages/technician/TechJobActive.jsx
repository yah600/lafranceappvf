import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Clock, Camera, Pause, Play, CheckCircle, XCircle, Phone, Navigation } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import PhotoUploader from '@components/photos/PhotoUploader'
import { formatDuration } from '@utils/formatters'
import { calculatePaymentSplit, calculateTaxes } from '@utils/calculators'
import './TechJobActive.css'

const PHOTO_INTERVAL_MINUTES = 45
const MINIMUM_PHOTOS = 3

function TechJobActive() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const job = useJobsStore((state) => state.getJobById(id))
  const updateJob = useJobsStore((state) => state.updateJob)
  const showToast = useUIStore((state) => state.showToast)

  const [startTime, setStartTime] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [pausedAt, setPausedAt] = useState(null)
  const [photos, setPhotos] = useState([])
  const [notes, setNotes] = useState('')
  const [lastPhotoTime, setLastPhotoTime] = useState(Date.now())
  const photoReminderInterval = useRef(null)

  // Initialize job if just opened
  useEffect(() => {
    if (!job) {
      showToast('Travail non trouvé', 'error')
      navigate('/tech/jobs')
      return
    }

    // Auto-start if job already in progress
    if (job.status === 'in-progress' && job.startTime) {
      setStartTime(new Date(job.startTime).getTime())
      setIsTimerRunning(true)
      setPhotos(job.photos || [])
      setNotes(job.notes || '')
    }
  }, [job, navigate, showToast])

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || !startTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, startTime])

  // Photo reminder logic
  useEffect(() => {
    if (!isTimerRunning) return

    photoReminderInterval.current = setInterval(() => {
      const timeSinceLastPhoto = (Date.now() - lastPhotoTime) / (1000 * 60) // in minutes

      if (timeSinceLastPhoto >= PHOTO_INTERVAL_MINUTES && photos.length < MINIMUM_PHOTOS) {
        showToast('📸 Photo requise! Prenez une photo maintenant', 'warning')

        // Play sound
        const audio = new Audio('/notification.mp3')
        audio.play().catch(() => {})
      }
    }, 60000) // Check every minute

    return () => clearInterval(photoReminderInterval.current)
  }, [isTimerRunning, lastPhotoTime, photos.length, showToast])

  // Start job
  const handleStartJob = () => {
    const now = Date.now()
    setStartTime(now)
    setIsTimerRunning(true)
    setLastPhotoTime(now)

    updateJob(id, {
      status: 'in-progress',
      startTime: new Date(now).toISOString(),
    })

    showToast('Chronomètre démarré!', 'success')
  }

  // Pause/Resume timer
  const handlePauseResume = () => {
    if (isTimerRunning) {
      setPausedAt(Date.now())
      setIsTimerRunning(false)
      showToast('Timer mis en pause', 'info')
    } else {
      // Resume
      const pauseDuration = Date.now() - pausedAt
      setStartTime(startTime + pauseDuration)
      setIsTimerRunning(true)
      showToast('Timer repris', 'success')
    }
  }

  // Handle photo upload
  const handlePhotosChange = (newPhotos) => {
    setPhotos(newPhotos)
    setLastPhotoTime(Date.now())
  }

  // Complete job
  const handleCompleteJob = () => {
    // Validation: Minimum photos
    if (photos.length < MINIMUM_PHOTOS) {
      showToast(
        `Minimum ${MINIMUM_PHOTOS} photos requis. Vous en avez ${photos.length}.`,
        'error'
      )
      return
    }

    if (!confirm('Êtes-vous sûr que le travail est terminé?')) {
      return
    }

    // Stop timer
    setIsTimerRunning(false)
    const endTime = Date.now()
    const durationMinutes = Math.floor((endTime - startTime) / (1000 * 60))

    // Calculate payment
    const payment = calculatePaymentSplit(job.amount)
    const taxes = calculateTaxes(job.amount)

    // Update job
    updateJob(id, {
      status: 'completed',
      endTime: new Date(endTime).toISOString(),
      duration: durationMinutes,
      photos,
      notes,
      payment,
      finalAmount: taxes.total,
    })

    // Show completion message
    alert(`
Travail complété!

Durée: ${formatDuration(durationMinutes)}
Montant: $${job.amount}

PAIEMENT:
✅ Immédiat (75%): $${payment.immediate}
⏳ Retenu (25%): $${payment.holdback}
   Libération dans 7 jours

Excellent travail!
    `.trim())

    navigate('/tech/jobs?tab=completed')
  }

  // Cancel job
  const handleCancelJob = () => {
    const reason = prompt('Raison de l\'annulation:')
    if (!reason) return

    if (!confirm('Confirmer l\'annulation? Le dispatcher sera notifié.')) return

    updateJob(id, {
      status: 'cancelled',
      cancelledBy: user.id,
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
    })

    showToast('Travail annulé', 'info')
    navigate('/tech/dashboard')
  }

  // Call client
  const handleCallClient = () => {
    if (job.clientPhone) {
      window.location.href = `tel:${job.clientPhone}`
    }
  }

  // Open navigation
  const handleNavigate = () => {
    const { lat, lng } = job.address.coordinates
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
      '_blank'
    )
  }

  if (!job) {
    return null
  }

  return (
    <AppLayout title="Travail en Cours" showHeader={true} showBackButton={true}>
      <div className="tech-job-active">
        {/* Timer Section */}
        <Section className="timer-section">
          <div className="timer-display">
            <Clock size={48} className="timer-icon" />
            <div className="timer-text">
              <div className="timer-label">Temps écoulé</div>
              <div className="timer-value">
                {formatDuration(Math.floor(elapsedSeconds / 60))}
              </div>
            </div>
          </div>

          <div className="timer-controls">
            {!startTime ? (
              <button className="btn btn-primary btn-lg" onClick={handleStartJob}>
                <Play size={20} />
                Démarrer le travail
              </button>
            ) : (
              <>
                <button
                  className={`btn ${isTimerRunning ? 'btn-warning' : 'btn-success'}`}
                  onClick={handlePauseResume}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause size={20} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Reprendre
                    </>
                  )}
                </button>
                <button className="btn btn-success btn-lg" onClick={handleCompleteJob}>
                  <CheckCircle size={20} />
                  Terminer
                </button>
              </>
            )}
          </div>
        </Section>

        {/* Job Details */}
        <Section title="Détails du travail">
          <div className="job-details">
            <div className="detail-row">
              <span className="detail-label">Client:</span>
              <span className="detail-value">{job.clientName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Service:</span>
              <span className="detail-value">{job.serviceName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Adresse:</span>
              <span className="detail-value">{job.address.street}, {job.address.city}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Montant:</span>
              <span className="detail-value">${job.amount}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleCallClient}>
              <Phone size={18} />
              Appeler client
            </button>
            <button className="btn btn-secondary" onClick={handleNavigate}>
              <Navigation size={18} />
              Navigation
            </button>
          </div>
        </Section>

        {/* Photos */}
        <Section title={`Photos (${photos.length}/${MINIMUM_PHOTOS} minimum)`}>
          <PhotoUploader
            photos={photos}
            onPhotosChange={handlePhotosChange}
            jobId={id}
          />
          {photos.length < MINIMUM_PHOTOS && (
            <p className="warning-text">
              ⚠️ Minimum {MINIMUM_PHOTOS} photos requis pour compléter
            </p>
          )}
        </Section>

        {/* Notes */}
        <Section title="Notes">
          <textarea
            className="notes-textarea"
            placeholder="Notes sur le travail effectué..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </Section>

        {/* Cancel button */}
        <div className="cancel-section">
          <button className="btn btn-danger-outline" onClick={handleCancelJob}>
            <XCircle size={18} />
            Annuler le travail
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

export default TechJobActive
