import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, TrendingUp, AlertCircle, Clock, MapPin, Phone, Calendar, DollarSign } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useBiddingStore } from '@stores/biddingStore'
import { useNotificationsStore } from '@stores/notificationsStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import DashboardGrid from '@components/layout/DashboardGrid'
import StatCard from '@components/common/StatCard'
import Card from '@components/common/Card'
import BiddingJobCard from '@components/cards/BiddingJobCard'
import StatusBadge from '@components/common/StatusBadge'
import { formatCurrency, formatDate, formatTime } from '@utils/formatters'
import mockJobs from '@data/mockJobs'
import './TechDashboard.css'

function TechDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const jobs = useJobsStore((state) => state.jobs)
  const setJobs = useJobsStore((state) => state.setJobs)
  const activeBiddings = useBiddingStore((state) => state.activeBiddings)
  const startBidding = useBiddingStore((state) => state.startBidding)
  const placeBid = useBiddingStore((state) => state.placeBid)
  const addNotification = useNotificationsStore((state) => state.addNotification)
  const showToast = useUIStore((state) => state.showToast)

  // Initialize jobs from mock data
  useEffect(() => {
    if (jobs.length === 0) {
      setJobs(mockJobs)
    }
  }, [jobs.length, setJobs])

  // Initialize bidding jobs
  useEffect(() => {
    const urgentJobs = jobs.filter((job) => job.type === 'urgent' && job.status === 'bidding')

    urgentJobs.forEach((job) => {
      const alreadyInBidding = activeBiddings.some((b) => b.id === job.id)
      if (!alreadyInBidding) {
        startBidding(job)
      }
    })
  }, [jobs, activeBiddings, startBidding])

  // Get technician's jobs
  const myJobs = jobs.filter((job) => job.technicianId === user?.id)
  const todayJobs = myJobs.filter((job) => {
    const today = new Date().toISOString().split('T')[0]
    const jobDate = (job.scheduledDate || job.createdAt)?.split('T')[0]
    return jobDate === today
  })
  const monthlyEarnings = 12450
  const nextJob = myJobs
    .filter((job) => job.status === 'assigned')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0]

  // Handle bid submission
  const handleBid = (jobId, amount) => {
    placeBid(jobId, amount)
    showToast(`Enchère de ${formatCurrency(amount, false)} soumise!`, 'success')
    addNotification({
      type: 'bid-placed',
      title: 'Enchère soumise',
      message: `Votre enchère de ${formatCurrency(amount, false)} a été enregistrée`,
    })
  }

  // Handle pass
  const handlePass = (jobId) => {
    if (confirm('Êtes-vous sûr de vouloir passer cette opportunité?')) {
      showToast('Opportunité ignorée', 'info')
    }
  }

  return (
    <AppLayout
      pageTitle={`Bonjour, ${user?.name?.split(' ')[0]} 👋`}
      pageDescription="Gérez vos travaux et suivez vos revenus en temps réel"
      breadcrumbs={['Accueil', 'Dashboard']}
      showSidebar={false}
      showMobileNav={true}
    >
      {/* Stats Cards */}
      <DashboardGrid columns={4} gap="md">
        <StatCard
          title="Travaux Aujourd'hui"
          value={todayJobs.length}
          icon="💼"
          gradient="blue"
          trend="up"
          trendValue="+2"
          trendLabel="vs hier"
        />
        <StatCard
          title="Revenus du Mois"
          value={formatCurrency(monthlyEarnings, false)}
          icon="💰"
          gradient="green"
          trend="up"
          trendValue="+12%"
          trendLabel="vs mois dernier"
        />
        <StatCard
          title="Note Moyenne"
          value="4.8"
          icon="⭐"
          gradient="purple"
          trend="up"
          trendValue="+0.2"
          trendLabel="ce mois"
        />
        <StatCard
          title="Taux d'Acceptation"
          value="95%"
          icon="✅"
          gradient="orange"
          trend="stable"
          trendLabel="excellent"
        />
      </DashboardGrid>

      {/* Urgent Jobs - Bidding */}
      {activeBiddings.length > 0 && (
        <div className="dashboard-section urgent-section">
          <div className="section-header">
            <div className="section-title-group">
              <h2 className="section-title">
                <AlertCircle size={24} className="section-icon urgent-icon" />
                Urgences Disponibles
              </h2>
              <span className="badge badge-urgent">{activeBiddings.length} actives</span>
            </div>
            <p className="section-subtitle">Enchérissez rapidement pour remporter ces travaux</p>
          </div>

          <div className="bidding-jobs-grid">
            {activeBiddings.map((job) => (
              <BiddingJobCard
                key={job.id}
                job={job}
                onBid={handleBid}
                onPass={handlePass}
              />
            ))}
          </div>
        </div>
      )}

      {/* Next Scheduled Job */}
      {nextJob && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <Calendar size={24} className="section-icon" />
              Prochain Travail Programmé
            </h2>
          </div>

          <Card className="next-job-card soft-card" onClick={() => navigate(`/tech/job/${nextJob.id}/active`)}>
            <div className="job-card-header">
              <div className="job-badge-group">
                <div className="job-priority priority-high">Priorité Haute</div>
                <StatusBadge status={nextJob.status} />
              </div>
            </div>

            <h3 className="job-title-large">{nextJob.serviceName}</h3>
            <p className="job-client-name">{nextJob.clientName}</p>

            <div className="job-details-grid">
              <div className="job-detail-item">
                <Clock size={18} className="detail-icon icon-blue" />
                <div>
                  <div className="detail-label">Date & Heure</div>
                  <div className="detail-value">{formatDate(nextJob.scheduledDate)} à {nextJob.scheduledTime}</div>
                </div>
              </div>

              <div className="job-detail-item">
                <MapPin size={18} className="detail-icon icon-green" />
                <div>
                  <div className="detail-label">Adresse</div>
                  <div className="detail-value">{nextJob.address.street}, {nextJob.address.city}</div>
                </div>
              </div>

              <div className="job-detail-item">
                <DollarSign size={18} className="detail-icon icon-purple" />
                <div>
                  <div className="detail-label">Montant</div>
                  <div className="detail-value">{formatCurrency(nextJob.amount)}</div>
                </div>
              </div>

              <div className="job-detail-item">
                <Phone size={18} className="detail-icon icon-orange" />
                <div>
                  <div className="detail-label">Contact</div>
                  <div className="detail-value">{nextJob.clientPhone}</div>
                </div>
              </div>
            </div>

            <div className="job-actions-row">
              <button
                className="btn-gradient btn-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/tech/job/${nextJob.id}/active`)
                }}
              >
                Démarrer le Travail
              </button>
              <button
                className="btn-outline btn-secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`tel:${nextJob.clientPhone}`)
                }}
              >
                <Phone size={18} />
                Appeler
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Actions Rapides</h2>
        </div>

        <DashboardGrid columns={3} gap="md">
          <Card className="action-card soft-card" onClick={() => navigate('/tech/jobs')}>
            <div className="action-icon-wrapper gradient-blue">
              <Briefcase size={28} />
            </div>
            <h3 className="action-title">Tous les Travaux</h3>
            <p className="action-description">Voir la liste complète</p>
            <div className="action-arrow">→</div>
          </Card>

          <Card className="action-card soft-card" onClick={() => navigate('/tech/earnings')}>
            <div className="action-icon-wrapper gradient-green">
              <TrendingUp size={28} />
            </div>
            <h3 className="action-title">Mes Revenus</h3>
            <p className="action-description">Paiements et statistiques</p>
            <div className="action-arrow">→</div>
          </Card>

          <Card className="action-card soft-card" onClick={() => navigate('/tech/profile')}>
            <div className="action-icon-wrapper gradient-purple">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="14" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <h3 className="action-title">Mon Profil</h3>
            <p className="action-description">Paramètres et licences</p>
            <div className="action-arrow">→</div>
          </Card>
        </DashboardGrid>
      </div>

      {/* Empty state if no urgent jobs */}
      {activeBiddings.length === 0 && !nextJob && (
        <Card className="empty-state-card">
          <Briefcase size={64} className="empty-icon" />
          <h3 className="empty-title">Aucun travail disponible pour le moment</h3>
          <p className="empty-message">
            Vous serez notifié dès qu'une nouvelle urgence sera disponible
          </p>
        </Card>
      )}
    </AppLayout>
  )
}

export default TechDashboard
