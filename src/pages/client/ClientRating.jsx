import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, Send } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useInvoicesStore } from '@stores/invoicesStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import { getDivisionName } from '@config/divisions'
import './ClientRating.css'

function ClientRating() {
  const { id } = useParams() // job ID
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const job = useJobsStore((state) => state.getJobById(id))
  const updateJob = useJobsStore((state) => state.updateJob)
  const invoices = useInvoicesStore((state) => state.invoices)
  const showToast = useUIStore((state) => state.showToast)

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const invoice = invoices.find((inv) => inv.jobId === id)

  const handleStarClick = (value) => {
    setRating(value)
  }

  const handleStarHover = (value) => {
    setHoveredRating(value)
  }

  const handleSubmitRating = async () => {
    if (rating === 0) {
      showToast('Veuillez sélectionner une note', 'error')
      return
    }

    setSubmitting(true)

    try {
      // Save rating to job
      updateJob(id, {
        rating,
        ratingComment: comment,
        ratedAt: new Date().toISOString(),
        ratedBy: user.id,
      })

      // Handle based on rating value
      if (rating === 5) {
        // Auto-post to Google Reviews
        await postToGoogleReviews({
          businessName: getDivisionName(job.division),
          technicianName: job.technicianName,
          rating: 5,
          comment,
          reviewDate: new Date().toISOString(),
        })

        showToast('Merci! Votre avis 5⭐ a été publié sur Google.', 'success')
      }

      if (rating === 4) {
        // Notify admin only (no public post)
        await notifyAdmin({
          type: '4-star-review',
          jobId: id,
          technicianId: job.technicianId,
          comment,
        })

        showToast('Merci pour votre évaluation!', 'success')
      }

      if (rating <= 3) {
        // High priority notification to admin
        await notifyAdmin({
          type: 'low-rating',
          jobId: id,
          technicianId: job.technicianId,
          rating,
          comment,
          priority: 'high',
        })

        // Schedule client contact
        await scheduleClientContact(user.id, {
          reason: 'low-rating-followup',
          jobId: id,
          rating,
        })

        showToast(
          'Merci pour votre retour. Notre équipe vous contactera sous peu.',
          'info'
        )
      }

      // Show success and navigate to invoice
      setTimeout(() => {
        showToast('Votre facture est maintenant disponible!', 'success')
        if (invoice) {
          navigate(`/client/invoice/${invoice.id}/payment`)
        } else {
          navigate('/client/invoices')
        }
      }, 1500)
    } catch (error) {
      console.error('Error submitting rating:', error)
      showToast('Erreur lors de la soumission', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!job) {
    return (
      <AppLayout title="Évaluation" showHeader={true} showBackButton={true}>
        <div className="error-state">
          <p>Travail non trouvé</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Évaluer le Service" showHeader={true} showBackButton={true}>
      <div className="client-rating">
        {/* Technician Info */}
        <Section>
          <div className="tech-info">
            <div className="tech-avatar">
              {job.technicianName.charAt(0)}
            </div>
            <div className="tech-details">
              <h3 className="tech-name">{job.technicianName}</h3>
              <p className="service-name">{job.serviceName}</p>
              <p className="completion-date">
                Complété le {new Date(job.endTime).toLocaleDateString('fr-CA')}
              </p>
            </div>
          </div>
        </Section>

        {/* Rating Section */}
        <Section>
          <h2 className="rating-title">Comment s'est passé votre service?</h2>

          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`star ${value <= (hoveredRating || rating) ? 'active' : ''}`}
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => handleStarHover(value)}
                onMouseLeave={() => handleStarHover(0)}
                type="button"
                disabled={submitting}
              >
                <Star
                  size={48}
                  fill={value <= (hoveredRating || rating) ? '#FFD700' : 'none'}
                  stroke={value <= (hoveredRating || rating) ? '#FFD700' : '#C7C7CC'}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="rating-label">
              {rating === 5 && '⭐ Excellent!'}
              {rating === 4 && '⭐ Très bon!'}
              {rating === 3 && '⭐ Bon'}
              {rating === 2 && '⚠️ Décevant'}
              {rating === 1 && '⚠️ Très décevant'}
            </div>
          )}
        </Section>

        {/* Comment Section */}
        <Section title="Commentaires (optionnel)">
          <textarea
            className="comment-textarea"
            placeholder="Partagez votre expérience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            disabled={submitting}
          />
        </Section>

        {/* Info box */}
        <div className="info-box">
          <p className="info-text">
            ⚠️ Vous devez évaluer pour télécharger votre facture payée
          </p>
          {rating === 5 && (
            <p className="google-info">
              ✓ Votre avis 5 étoiles sera automatiquement publié sur Google
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleSubmitRating}
          disabled={rating === 0 || submitting}
        >
          <Send size={20} />
          {submitting ? 'Envoi en cours...' : 'Soumettre l\'évaluation'}
        </button>
      </div>
    </AppLayout>
  )
}

// Mock functions (would be API calls in production)
const postToGoogleReviews = async (reviewData) => {
  console.log('Posting to Google Reviews:', reviewData)
  // In real app, this would call Google My Business API
  return new Promise((resolve) => setTimeout(resolve, 500))
}

const notifyAdmin = async (notification) => {
  console.log('Notifying admin:', notification)
  // In real app, this would send notification to admin dashboard
  return new Promise((resolve) => setTimeout(resolve, 500))
}

const scheduleClientContact = async (clientId, data) => {
  console.log('Scheduling client contact:', clientId, data)
  // In real app, this would create a task for admin
  return new Promise((resolve) => setTimeout(resolve, 500))
}

export default ClientRating
