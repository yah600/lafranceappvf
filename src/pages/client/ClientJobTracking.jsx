import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Clock, Navigation, User, Star } from 'lucide-react'
import { useJobsStore } from '@stores/jobsStore'
import { useAuthStore } from '@stores/authStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import StatusBadge from '@components/common/StatusBadge'
import { formatDistance, formatTime, formatCurrency } from '@utils/formatters'
import { calculateDistance, calculateETA } from '@utils/calculators'
import './ClientJobTracking.css'

function ClientJobTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = useJobsStore((state) => state.getJobById(id))
  const user = useAuthStore((state) => state.user)

  const [techLocation, setTechLocation] = useState(null)
  const [eta, setETA] = useState(null)
  const [distance, setDistance] = useState(null)

  // Simulate technician location updates (in real app, this would be real-time GPS)
  useEffect(() => {
    if (!job || job.status === 'completed' || job.status === 'cancelled') return

    // Simulate tech location moving towards job
    const interval = setInterval(() => {
      // Mock location that gets closer to job address
      const mockLat = job.address.coordinates.lat + (Math.random() - 0.5) * 0.01
      const mockLng = job.address.coordinates.lng + (Math.random() - 0.5) * 0.01

      setTechLocation({
        lat: mockLat,
        lng: mockLng,
        timestamp: new Date().toISOString(),
      })

      // Calculate distance and ETA
      const dist = calculateDistance(
        mockLat,
        mockLng,
        job.address.coordinates.lat,
        job.address.coordinates.lng
      )
      setDistance(dist)

      const etaCalc = calculateETA(dist)
      setETA(etaCalc)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [job])

  const handleCallTechnician = () => {
    if (job.technicianPhone) {
      window.location.href = `tel:${job.technicianPhone}`
    }
  }

  const getStatusMessage = () => {
    switch (job?.status) {
      case 'bidding':
        return '🔍 Recherche du meilleur technicien...'
      case 'assigned':
        return '✅ Technicien assigné'
      case 'en-route':
        return '🚗 Technicien en route'
      case 'in-progress':
        return '🔧 Travail en cours'
      case 'completed':
        return '✅ Travail terminé'
      default:
        return 'En attente...'
    }
  }

  if (!job) {
    return (
      <AppLayout title="Suivi" showHeader={true} showBackButton={true}>
        <div className="error-state">
          <p>Travail non trouvé</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Suivi en Temps Réel" showHeader={true} showBackButton={true}>
      <div className="client-job-tracking">
        {/* Status Banner */}
        <div className="status-banner">
          <StatusBadge status={job.status} />
          <h2 className="status-message">{getStatusMessage()}</h2>
        </div>

        {/* Map Placeholder */}
        <Section>
          <div className="map-container">
            <div className="map-placeholder">
              <MapPin size={64} className="map-icon" />
              <p className="map-text">Carte interactive Google Maps</p>
              {techLocation && distance && (
                <>
                  <div className="location-info">
                    <p>📍 Technicien: {distance.toFixed(1)} km</p>
                    {eta && <p>🚗 Arrivée estimée: {eta.etaFormatted}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </Section>

        {/* Technician Info */}
        {job.technicianName && (
          <Section title="Votre technicien">
            <div className="tech-card">
              <div className="tech-avatar">
                <User size={32} />
              </div>
              <div className="tech-info">
                <h3 className="tech-name">{job.technicianName}</h3>
                <div className="tech-rating">
                  <Star size={16} fill="#FFD700" stroke="#FFD700" />
                  <span>{job.technicianRating || '4.8'}</span>
                  <span className="tech-jobs">• {job.technicianJobsCompleted || '342'} jobs</span>
                </div>
              </div>
              <button className="btn btn-primary btn-icon" onClick={handleCallTechnician}>
                <Phone size={20} />
              </button>
            </div>
          </Section>
        )}

        {/* Job Details */}
        <Section title="Détails du service">
          <div className="job-details">
            <div className="detail-row">
              <span className="detail-label">Service:</span>
              <span className="detail-value">{job.serviceName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Adresse:</span>
              <span className="detail-value">
                {job.address.street}, {job.address.city}
              </span>
            </div>
            {job.scheduledDate && (
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {new Date(job.scheduledDate).toLocaleDateString('fr-CA')}
                  {job.scheduledTime && ` à ${job.scheduledTime}`}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Montant:</span>
              <span className="detail-value">{formatCurrency(job.amount)}</span>
            </div>
          </div>
        </Section>

        {/* Live Updates */}
        {job.status === 'in-progress' && (
          <Section title="Mises à jour en direct">
            <div className="live-updates">
              {job.startTime && (
                <div className="update-item">
                  <Clock size={18} className="update-icon" />
                  <div className="update-content">
                    <p className="update-title">Travail démarré</p>
                    <p className="update-time">
                      {formatTime(job.startTime)}
                    </p>
                  </div>
                </div>
              )}
              {job.photos && job.photos.length > 0 && (
                <div className="update-item">
                  <div className="update-icon">📸</div>
                  <div className="update-content">
                    <p className="update-title">{job.photos.length} photo(s) ajoutée(s)</p>
                    <p className="update-time">Dernière: {formatTime(job.photos[job.photos.length - 1].timestamp)}</p>
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Photos */}
        {job.photos && job.photos.length > 0 && (
          <Section title="Photos du travail">
            <div className="photos-grid">
              {job.photos.map((photo, index) => (
                <div key={photo.id || index} className="photo-item">
                  <img src={photo.data} alt={`Photo ${index + 1}`} className="photo-image" />
                  <div className="photo-time">{formatTime(photo.timestamp)}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Actions */}
        {job.status === 'completed' && (
          <div className="action-buttons">
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={() => navigate(`/client/job/${job.id}/rating`)}
            >
              Évaluer le service
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default ClientJobTracking
