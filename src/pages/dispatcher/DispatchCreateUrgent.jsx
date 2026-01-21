import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, MapPin, DollarSign, Clock, Users, Upload, X } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useBiddingStore } from '@stores/biddingStore'
import { useNotificationsStore } from '@stores/notificationsStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import { DIVISIONS } from '@config/divisions'
import './DispatchCreateUrgent.css'

// Mock clients data (in real app, would come from API)
const mockClients = [
  { id: 'client-001', name: 'Jean-Paul Bertrand', phone: '514-555-1234', address: '123 Rue Principale, Montréal, QC' },
  { id: 'client-002', name: 'Marie Tremblay', phone: '438-555-5678', address: '456 Avenue du Parc, Montréal, QC' },
  { id: 'client-003', name: 'Pierre Gagnon', phone: '514-555-9012', address: '789 Boulevard Saint-Laurent, Montréal, QC' },
]

// Mock services by division
const servicesByDivision = {
  plomberie: [
    'Fuite d\'eau urgente',
    'Tuyau éclaté',
    'Toilette bouchée',
    'Chauffe-eau en panne',
    'Robinet cassé',
  ],
  construction: [
    'Réparation structurelle urgente',
    'Dommages d\'eau',
    'Problème électrique',
    'Porte ou fenêtre cassée',
  ],
  toitures: [
    'Fuite de toit',
    'Bardeaux arrachés',
    'Gouttière détachée',
    'Dommages de tempête',
  ],
  isolation: [
    'Isolation compromise',
    'Perte de chaleur',
    'Infiltration d\'air',
  ],
  conteneurs: [
    'Conteneur urgente',
    'Ramassage immédiat',
  ],
  gutters: [
    'Gouttière bouchée',
    'Gouttière détachée',
    'Réparation urgente',
  ],
  decks: [
    'Réparation de terrasse',
    'Planche cassée',
  ],
  'real-estate': [
    'Inspection urgente',
    'Évaluation rapide',
  ],
}

function DispatchCreateUrgent() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const addJob = useJobsStore((state) => state.addJob)
  const startBidding = useBiddingStore((state) => state.startBidding)
  const addNotification = useNotificationsStore((state) => state.addNotification)
  const showToast = useUIStore((state) => state.showToast)

  const [formData, setFormData] = useState({
    division: user?.division || 'plomberie',
    clientId: '',
    clientName: '',
    clientPhone: '',
    service: '',
    description: '',
    address: '',
    clientBudget: '',
    minimumBid: '',
    biddingDuration: 5,
  })

  const [photos, setPhotos] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-fill client details when client is selected
    if (field === 'clientId') {
      const client = mockClients.find((c) => c.id === value)
      if (client) {
        setFormData((prev) => ({
          ...prev,
          clientId: value,
          clientName: client.name,
          clientPhone: client.phone,
          address: client.address,
        }))
      }
    }

    // Auto-calculate minimum bid (80% of client budget for profit margin)
    if (field === 'clientBudget') {
      const budget = parseFloat(value)
      if (!isNaN(budget)) {
        const suggested = Math.floor(budget * 0.8)
        setFormData((prev) => ({ ...prev, minimumBid: suggested.toString() }))
      }
    }
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.map((file) => ({
      id: `photo-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  const removePhoto = (photoId) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== photoId)
      // Cleanup URL
      const photo = prev.find((p) => p.id === photoId)
      if (photo) URL.revokeObjectURL(photo.preview)
      return updated
    })
  }

  const validateForm = () => {
    if (!formData.clientId) {
      showToast('Veuillez sélectionner un client', 'error')
      return false
    }
    if (!formData.service) {
      showToast('Veuillez sélectionner un service', 'error')
      return false
    }
    if (!formData.description || formData.description.length < 20) {
      showToast('Description trop courte (minimum 20 caractères)', 'error')
      return false
    }
    if (!formData.address) {
      showToast('Veuillez entrer une adresse', 'error')
      return false
    }
    if (!formData.clientBudget || parseFloat(formData.clientBudget) < 100) {
      showToast('Budget client minimum: 100$', 'error')
      return false
    }
    if (!formData.minimumBid || parseFloat(formData.minimumBid) < 50) {
      showToast('Enchère minimum: 50$', 'error')
      return false
    }
    if (parseFloat(formData.minimumBid) >= parseFloat(formData.clientBudget)) {
      showToast('L\'enchère minimum doit être inférieure au budget client', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      // Create new job
      const jobId = `job-${Date.now()}`
      const newJob = {
        id: jobId,
        type: 'urgent',
        status: 'bidding',
        division: formData.division,
        serviceName: formData.service,
        description: formData.description,
        clientId: formData.clientId,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        address: {
          street: formData.address,
          city: 'Montréal',
          province: 'QC',
          postalCode: 'H1A 1A1',
        },
        amount: parseFloat(formData.clientBudget),
        minimumBid: parseFloat(formData.minimumBid),
        biddingDuration: parseInt(formData.biddingDuration),
        photos: photos.map((p) => p.preview),
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        createdByName: user.name,
      }

      // Add job to store
      addJob(newJob)

      // Start bidding process
      startBidding(newJob)

      // Send notification to all technicians in division
      addNotification({
        type: 'urgent-job-created',
        title: '🚨 Nouvelle Urgence Disponible',
        message: `${formData.service} - ${formData.address}`,
        data: { jobId },
      })

      showToast('Urgence postée! Enchères démarrées.', 'success')

      // Navigate to dashboard to see the job in bidding
      setTimeout(() => {
        navigate('/dispatch/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error creating urgent job:', error)
      showToast('Erreur lors de la création', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const availableServices = servicesByDivision[formData.division] || []

  return (
    <AppLayout
      pageTitle="Créer Urgence"
      pageDescription="Poster un travail urgent pour enchères"
      breadcrumbs={['Dispatch', 'Créer Urgence']}
      showHeader={true}
      showBackButton={true}
    >
      <div className="dispatch-create-urgent">
        {/* Info Banner */}
        <div className="info-banner">
          <AlertCircle size={24} />
          <div className="banner-content">
            <h3>Urgence = Enchères Automatiques</h3>
            <p>
              Le travail sera posté à tous les techniciens de la division. Enchères inverses: le plus bas gagne!
              Durée: {formData.biddingDuration} minutes par défaut.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="urgent-form">
          {/* Division Selection */}
          <Section title="Division">
            <div className="division-selector">
              {DIVISIONS.map((div) => (
                <label key={div.id} className="division-option">
                  <input
                    type="radio"
                    name="division"
                    value={div.id}
                    checked={formData.division === div.id}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                  />
                  <div className="division-content">
                    <span className="division-name">{div.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </Section>

          {/* Client Selection */}
          <Section title="Client *">
            <select
              className="form-input"
              value={formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              required
            >
              <option value="">Sélectionner un client</option>
              {mockClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone}
                </option>
              ))}
            </select>

            {formData.clientId && (
              <div className="client-details">
                <div className="detail-item">
                  <Users size={16} />
                  <span>{formData.clientName}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{formData.address}</span>
                </div>
              </div>
            )}
          </Section>

          {/* Service Selection */}
          <Section title="Service *">
            <select
              className="form-input"
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              required
            >
              <option value="">Sélectionner un service</option>
              {availableServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </Section>

          {/* Description */}
          <Section title="Description du Problème *">
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez le problème en détail... (minimum 20 caractères)"
              rows={5}
              required
            />
            <div className="char-count">
              {formData.description.length} / 20 minimum
            </div>
          </Section>

          {/* Photos */}
          <Section title="Photos (Optionnel)">
            <div className="photo-upload-section">
              <label className="photo-upload-btn">
                <Upload size={20} />
                <span>Ajouter des photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {photos.length > 0 && (
                <div className="photo-grid">
                  {photos.map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <img src={photo.preview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => removePhoto(photo.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Tarification *">
            <div className="pricing-grid">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={18} />
                  Budget Client *
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.clientBudget}
                  onChange={(e) => handleInputChange('clientBudget', e.target.value)}
                  placeholder="Ex: 300"
                  min="100"
                  step="10"
                  required
                />
                <div className="input-hint">Montant que le client est prêt à payer</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={18} />
                  Enchère Minimum *
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.minimumBid}
                  onChange={(e) => handleInputChange('minimumBid', e.target.value)}
                  placeholder="Ex: 240"
                  min="50"
                  step="10"
                  required
                />
                <div className="input-hint">
                  Marge de profit de l'entreprise (suggéré: 80% du budget)
                </div>
              </div>
            </div>

            {formData.clientBudget && formData.minimumBid && (
              <div className="profit-estimate">
                <div className="estimate-label">Profit estimé de l'entreprise:</div>
                <div className="estimate-value">
                  {(parseFloat(formData.clientBudget) - parseFloat(formData.minimumBid)).toFixed(2)}$
                  ({((parseFloat(formData.clientBudget) - parseFloat(formData.minimumBid)) / parseFloat(formData.clientBudget) * 100).toFixed(0)}%)
                </div>
              </div>
            )}
          </Section>

          {/* Bidding Duration */}
          <Section title="Durée des Enchères">
            <div className="form-group">
              <label className="form-label">
                <Clock size={18} />
                Durée (minutes)
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.biddingDuration}
                onChange={(e) => handleInputChange('biddingDuration', e.target.value)}
                min="3"
                max="10"
                required
              />
              <div className="input-hint">Entre 3 et 10 minutes (défaut: 5)</div>
            </div>
          </Section>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={submitting}
            >
              {submitting ? 'Publication...' : '🚨 Poster Urgence & Démarrer Enchères'}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg btn-full"
              onClick={() => navigate('/dispatch/dashboard')}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

export default DispatchCreateUrgent
