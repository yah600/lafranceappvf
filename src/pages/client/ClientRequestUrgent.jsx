import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, MapPin, Phone, CreditCard, Camera, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import { DIVISIONS } from '@config/divisions'
import './ClientRequestUrgent.css'

function ClientRequestUrgent() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const addJob = useJobsStore((state) => state.addJob)
  const showToast = useUIStore((state) => state.showToast)

  const [formData, setFormData] = useState({
    division: '',
    service: '',
    description: '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    phone: user?.phone || '',
    budget: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.division || !formData.description) {
      showToast('Veuillez remplir tous les champs requis', 'error')
      return
    }

    setSubmitting(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create urgent job
    const newJob = {
      id: `job-${Date.now()}`,
      type: 'urgent',
      status: 'bidding',
      priority: 'urgent',
      division: formData.division,
      serviceName: formData.service || 'Service d\'urgence',
      description: formData.description,
      clientId: user.id,
      clientName: user.name,
      clientPhone: formData.phone,
      address: {
        street: formData.address,
        city: formData.city,
        province: 'QC',
        coordinates: { lat: 45.5, lng: -73.6 },
      },
      clientBudget: parseFloat(formData.budget) || 500,
      minimumBid: (parseFloat(formData.budget) || 500) * 0.5,
      biddingDuration: 5,
      biddingStartTime: new Date().toISOString(),
      biddingEndTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      bids: [],
      createdAt: new Date().toISOString(),
    }

    addJob(newJob)
    showToast('Demande reçue! Recherche de technicien...', 'success')

    // Navigate to tracking
    setTimeout(() => {
      navigate(`/client/job/${newJob.id}/tracking`)
    }, 1500)
  }

  return (
    <AppLayout showHeader={false}>
      {/* Custom Header with Back Button */}
      <div className="urgent-header">
        <button className="back-button" onClick={() => navigate('/client/dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-content">
          <h1 className="header-title">Demande Urgente</h1>
          <p className="header-subtitle">Service immédiat</p>
        </div>
      </div>

      {/* Alert Banner */}
      <Section>
        <Card className="alert-banner">
          <div className="alert-content">
            <AlertCircle size={24} className="alert-icon" />
            <div className="alert-text">
              <h3 className="alert-title">Service d'Urgence 24/7</h3>
              <p className="alert-description">
                Votre demande sera envoyée aux techniciens disponibles.
                Vous recevrez une notification sous 5-10 minutes.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <form onSubmit={handleSubmit}>
        {/* Service Information */}
        <Section title="Informations du Service">
          <Card>
            <div className="form-group">
              <label htmlFor="division" className="form-label">
                Division <span className="required">*</span>
              </label>
              <select
                id="division"
                className="form-select"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                required
              >
                <option value="">Sélectionner...</option>
                {DIVISIONS.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="service" className="form-label">
                Service
              </label>
              <input
                id="service"
                type="text"
                className="form-input"
                placeholder="Ex: Tuyau éclaté, fuite, etc."
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Décrivez le problème en détail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget" className="form-label">
                Budget Maximum
              </label>
              <input
                id="budget"
                type="number"
                className="form-input"
                placeholder="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              <p className="form-hint">
                Les techniciens enchériront pour obtenir le meilleur prix
              </p>
            </div>
          </Card>
        </Section>

        {/* Address */}
        <Section>
          <div className="section-title-with-icon">
            <MapPin size={20} />
            <span>Adresse</span>
          </div>
          <Card>
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Rue <span className="required">*</span>
              </label>
              <input
                id="address"
                type="text"
                className="form-input"
                placeholder="123 Rue Exemple"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city" className="form-label">
                Ville <span className="required">*</span>
              </label>
              <input
                id="city"
                type="text"
                className="form-input"
                placeholder="Montréal"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </Card>
        </Section>

        {/* Contact */}
        <Section>
          <div className="section-title-with-icon">
            <Phone size={20} />
            <span>Contact</span>
          </div>
          <Card>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Téléphone <span className="required">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="514-555-1234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </Card>
        </Section>

        {/* Photo Tip */}
        <Section>
          <Card className="tip-card">
            <div className="tip-content">
              <Camera size={20} className="tip-icon" />
              <div className="tip-text">
                <p className="tip-title">Astuce: Prenez des photos</p>
                <p className="tip-description">
                  Des photos du problème aident les techniciens à mieux préparer leur intervention
                </p>
              </div>
            </div>
          </Card>
        </Section>

        {/* Submit Buttons */}
        <Section>
          <Button
            type="submit"
            size="large"
            variant="danger"
            disabled={submitting}
            fullWidth={true}
            className="submit-button"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer la Demande Urgente'}
          </Button>

          <Button
            type="button"
            size="large"
            variant="outline"
            onClick={() => navigate('/client/dashboard')}
            fullWidth={true}
            className="cancel-button"
          >
            Annuler
          </Button>
        </Section>

        {/* Payment Info */}
        <Section>
          <div className="payment-info">
            <div className="payment-info-item">
              <CreditCard size={16} />
              <span>Paiement sécurisé après le service</span>
            </div>
            <p className="payment-info-note">
              Aucun frais avant l'acceptation de la soumission
            </p>
          </div>
        </Section>
      </form>
    </AppLayout>
  )
}

export default ClientRequestUrgent
