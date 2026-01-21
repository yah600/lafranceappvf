import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Clock, TrendingUp, AlertCircle, Phone, ArrowRight, MapPin } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useBiddingStore } from '@stores/biddingStore'
import { useNotificationsStore } from '@stores/notificationsStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Card from '@components/common/Card'
import Section from '@components/common/Section'
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
      title={`Bonjour, ${user?.name?.split(' ')[0]} 👋`}
      subtitle={`⭐ ${user?.rating || 0} | ${user?.completedJobs || 0} travaux complétés`}
      showMobileNav={true}
      showHeader={true}
    >
      {/* Stats Cards */}
      <Section>
        <div className="stats-grid">
          <Card className="stat-card">
            <Briefcase size={28} className="stat-icon stat-icon-blue" />
            <div className="stat-value">{todayJobs.length}</div>
            <div className="stat-label">Aujourd'hui</div>
          </Card>
          <Card className="stat-card">
            <TrendingUp size={28} className="stat-icon stat-icon-green" />
            <div className="stat-value">{formatCurrency(12450, false)}</div>
            <div className="stat-label">Ce mois</div>
          </Card>
        </div>
      </Section>

      {/* Urgent Jobs - Bidding */}
      {activeBiddings.length > 0 && (
        <Section className="urgent-jobs-section">
          <div className="section-header-with-icon">
            <AlertCircle size={24} className="urgent-icon" />
            <h2>Urgences Disponibles ({activeBiddings.length})</h2>
          </div>

          <div className="urgent-jobs-list">
            {activeBiddings.map((job) => (
              <BiddingJobCard
                key={job.id}
                job={job}
                onBid={handleBid}
                onPass={handlePass}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Next Scheduled Job */}
      {nextJob && (
        <Section title="Prochain Travail">
          <Card className="next-job-card">
            <div className="job-card-header">
              <div className="job-info">
                <h3 className="job-title">{nextJob.serviceName}</h3>
                <p className="job-client">{nextJob.clientName}</p>
              </div>
              <StatusBadge status={nextJob.status} />
            </div>

            <div className="job-schedule">
              <Clock size={16} />
              <span>{formatDate(nextJob.scheduledDate)} à {nextJob.scheduledTime}</span>
            </div>

            <div className="job-location">
              <MapPin size={16} />
              <span>{nextJob.address.street}, {nextJob.address.city}</span>
            </div>

            <div className="job-actions">
              <button
                className="btn-primary flex-1"
                onClick={() => navigate(`/tech/job/${nextJob.id}/active`)}
              >
                Démarrer GPS
              </button>
              <button
                className="btn-outline flex-1"
                onClick={() => window.open(`tel:${nextJob.clientPhone}`)}
              >
                <Phone size={18} />
                Appeler
              </button>
            </div>
          </Card>
        </Section>
      )}

      {/* Quick Actions */}
      <Section title="Actions Rapides">
        <div className="quick-actions-list">
          <button className="action-item" onClick={() => navigate('/tech/jobs')}>
            <div className="action-item-content">
              <Briefcase size={20} className="action-item-icon" />
              <span>Voir tous les travaux</span>
            </div>
            <ArrowRight size={18} className="action-item-arrow" />
          </button>
          <button className="action-item" onClick={() => navigate('/tech/earnings')}>
            <div className="action-item-content">
              <TrendingUp size={20} className="action-item-icon" />
              <span>Mes revenus</span>
            </div>
            <ArrowRight size={18} className="action-item-arrow" />
          </button>
          <button className="action-item" onClick={() => navigate('/tech/profile')}>
            <div className="action-item-content">
              <Briefcase size={20} className="action-item-icon" />
              <span>Mon profil</span>
            </div>
            <ArrowRight size={18} className="action-item-arrow" />
          </button>
        </div>
      </Section>

      {/* Empty state if no urgent jobs */}
      {activeBiddings.length === 0 && !nextJob && (
        <Section>
          <div className="empty-state">
            <Briefcase size={48} className="empty-icon" />
            <h3 className="empty-title">Aucun travail disponible</h3>
            <p className="empty-message">
              Vous serez notifié dès qu'une nouvelle urgence sera disponible
            </p>
          </div>
        </Section>
      )}
    </AppLayout>
  )
}

export default TechDashboard
