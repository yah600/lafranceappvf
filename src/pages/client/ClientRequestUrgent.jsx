import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, List, ListInput, Button } from 'konsta/react'
import { AlertCircle, MapPin, Phone, CreditCard, Camera } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useUIStore } from '@stores/uiStore'
import { DIVISIONS } from '@config/divisions'

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
    <Page>
      <Navbar
        title="Demande Urgente"
        subtitle="Service immédiat"
        backLink="Retour"
        onBackClick={() => navigate('/client/dashboard')}
      />

      <Block className="bg-red-50 border-l-4 border-l-red-500 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-1">Service d'Urgence 24/7</h3>
            <p className="text-sm text-red-700">
              Votre demande sera envoyée aux techniciens disponibles.
              Vous recevrez une notification sous 5-10 minutes.
            </p>
          </div>
        </div>
      </Block>

      <form onSubmit={handleSubmit}>
        <Block>
          <h3 className="font-bold mb-3">Informations du Service</h3>
          <List strong inset>
            <ListInput
              label="Division"
              type="select"
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
            </ListInput>

            <ListInput
              label="Service"
              type="text"
              placeholder="Ex: Tuyau éclaté, fuite, etc."
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            />

            <ListInput
              label="Description"
              type="textarea"
              placeholder="Décrivez le problème en détail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              inputClassName="min-h-[100px]"
            />

            <ListInput
              label="Budget Maximum"
              type="number"
              placeholder="500"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              info="Les techniciens enchériront pour obtenir le meilleur prix"
            />
          </List>
        </Block>

        <Block>
          <h3 className="font-bold mb-3">
            <MapPin size={20} className="inline mr-2" />
            Adresse
          </h3>
          <List strong inset>
            <ListInput
              label="Rue"
              type="text"
              placeholder="123 Rue Exemple"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <ListInput
              label="Ville"
              type="text"
              placeholder="Montréal"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </List>
        </Block>

        <Block>
          <h3 className="font-bold mb-3">
            <Phone size={20} className="inline mr-2" />
            Contact
          </h3>
          <List strong inset>
            <ListInput
              label="Téléphone"
              type="tel"
              placeholder="514-555-1234"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </List>
        </Block>

        <Block>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <Camera size={20} className="text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  Astuce: Prenez des photos
                </p>
                <p className="text-blue-700">
                  Des photos du problème aident les techniciens à mieux préparer leur intervention
                </p>
              </div>
            </div>
          </div>

          <Button
            large
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white"
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer la Demande Urgente'}
          </Button>

          <Button
            large
            outline
            onClick={() => navigate('/client/dashboard')}
            className="w-full mt-3"
          >
            Annuler
          </Button>
        </Block>

        <Block className="text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard size={16} />
            <span>Paiement sécurisé après le service</span>
          </div>
          <p>Aucun frais avant l'acceptation de la soumission</p>
        </Block>
      </form>
    </Page>
  )
}

export default ClientRequestUrgent
