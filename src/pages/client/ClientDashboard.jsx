import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Calendar, Clock, FileText, Star, Plus, Phone, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import DashboardGrid from '@components/layout/DashboardGrid'
import StatCard from '@components/common/StatCard'
import Card from '@components/common/Card'
import JobCard from '@components/cards/JobCard'
import StatusBadge from '@components/common/StatusBadge'
import { formatCurrency, formatDate } from '@utils/formatters'
import mockJobs from '@data/mockJobs'
import './ClientDashboard.css'

function ClientDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const jobs = useJobsStore((state) => state.jobs)
  const setJobs = useJobsStore((state) => state.setJobs)

  // Initialize jobs
  useEffect(() => {
    if (jobs.length === 0) {
      setJobs(mockJobs)
    }
  }, [jobs.length, setJobs])

  // Get client's jobs
  const myJobs = jobs.filter((job) => job.clientId === user?.id)
  const activeJobs = myJobs.filter((job) =>
    ['pending', 'bidding', 'assigned', 'in-progress'].includes(job.status)
  )
  const completedJobs = myJobs.filter((job) => job.status === 'completed')

  // Calculate stats
  const totalSpent = completedJobs.reduce((sum, job) => sum + (job.finalAmount || job.amount || 0), 0)
  const avgRating = 4.9

  // Current active job
  const currentJob = activeJobs[0]

  return (
    <AppLayout
      pageTitle={`Bonjour, ${user?.name?.split(' ')[0]} 👋`}
      pageDescription="Bienvenue sur votre portail client"
      breadcrumbs={['Client', 'Dashboard']}
      showSidebar={false}
      showMobileNav={true}
    >
      <div className="client-dashboard">
        {/* Stats Cards */}
        <DashboardGrid columns={4} gap="md">
          <StatCard
            title="Travaux Actifs"
            value={activeJobs.length}
            icon="⚡"
            gradient="blue"
            trendLabel="en cours"
          />
          <StatCard
            title="Travaux Complétés"
            value={completedJobs.length}
            icon="✅"
            gradient="green"
            trendLabel="terminés"
          />
          <StatCard
            title="Total Dépensé"
            value={formatCurrency(totalSpent, false)}
            icon="💰"
            gradient="purple"
            trendLabel="tous les temps"
          />
          <StatCard
            title="Note Moyenne"
            value={avgRating}
            icon="⭐"
            gradient="orange"
            trendLabel="satisfaction"
          />
        </DashboardGrid>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Demander un Service</h2>
            <p className="section-subtitle">Choisissez le type de service dont vous avez besoin</p>
          </div>

          <div className="service-actions-grid">
            <Card className="service-action-card soft-card urgent-card" onClick={() => navigate('/client/request/urgent')}>
              <div className="service-icon-wrapper gradient-orange">
                <AlertCircle size={32} />
              </div>
              <h3 className="service-title">Service Urgent</h3>
              <p className="service-description">Intervention immédiate pour les urgences</p>
              <div className="service-badge urgent">🚨 Réponse sous 5 min</div>
              <div className="action-arrow">→</div>
            </Card>

            <Card className="service-action-card soft-card scheduled-card" onClick={() => navigate('/client/request/scheduled')}>
              <div className="service-icon-wrapper gradient-blue">
                <Calendar size={32} />
              </div>
              <h3 className="service-title">Service Planifié</h3>
              <p className="service-description">Réservez à la date et l'heure qui vous conviennent</p>
              <div className="service-badge scheduled">📅 Réservez maintenant</div>
              <div className="action-arrow">→</div>
            </Card>
          </div>
        </div>

      {/* Current Active Job */}
      {currentJob && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <Clock size={24} className="section-icon" />
              Travail en Cours
            </h2>
          </div>

          <Card className="active-job-card soft-card">
            <div className="active-job-header">
              <div className="active-job-info">
                <h3 className="active-job-title">{currentJob.serviceName}</h3>
                {currentJob.technicianName && (
                  <p className="active-job-tech">Technicien: {currentJob.technicianName}</p>
                )}
              </div>
              <StatusBadge status={currentJob.status} />
            </div>

            {currentJob.status === 'bidding' && (
              <div className="job-bidding-status">
                <div className="bidding-icon">🔍</div>
                <p className="bidding-message">
                  Recherche du meilleur technicien disponible...
                </p>
                <p className="bidding-note">
                  Vous recevrez une notification dès qu'un technicien sera assigné
                </p>
              </div>
            )}

            {currentJob.status === 'in-progress' && (
              <div className="active-job-actions">
                <button
                  className="btn-gradient btn-primary"
                  onClick={() => navigate(`/client/job/${currentJob.id}/tracking`)}
                >
                  Suivre en Temps Réel
                </button>
                {currentJob.technicianPhone && (
                  <button
                    className="btn-outline btn-secondary"
                    onClick={() => window.open(`tel:${currentJob.technicianPhone}`)}
                  >
                    <Phone size={18} />
                    Appeler
                  </button>
                )}
              </div>
            )}

            {(currentJob.status === 'assigned' || currentJob.status === 'pending') && (
              <div className="active-job-details">
                <div className="job-detail-item">
                  <Calendar size={18} className="detail-icon" />
                  <span>{formatDate(currentJob.scheduledDate)} à {currentJob.scheduledTime}</span>
                </div>
                {currentJob.amount && (
                  <div className="job-detail-item">
                    <span className="detail-label">Montant:</span>
                    <span className="detail-value">{formatCurrency(currentJob.amount)}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Recent Jobs */}
      {completedJobs.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <div className="section-header-with-action">
              <div>
                <h2 className="section-title">
                  <FileText size={24} className="section-icon" />
                  Travaux Récents
                </h2>
                <p className="section-subtitle">Historique de vos derniers services</p>
              </div>
              <button
                className="btn-outline btn-view-all"
                onClick={() => navigate('/client/jobs')}
              >
                Voir tout
              </button>
            </div>
          </div>

          <div className="recent-jobs-grid">
            {completedJobs.slice(0, 3).map((job) => (
              <Card
                key={job.id}
                className="recent-job-card soft-card"
                onClick={() => navigate(`/client/job/${job.id}`)}
              >
                <div className="recent-job-header">
                  <StatusBadge status={job.status} />
                  <span className="job-date">{formatDate(job.scheduledDate || job.createdAt)}</span>
                </div>
                <h3 className="recent-job-title">{job.serviceName}</h3>
                {job.technicianName && (
                  <p className="recent-job-tech">Par {job.technicianName}</p>
                )}
                <div className="recent-job-footer">
                  <span className="job-amount">{formatCurrency(job.finalAmount || job.amount)}</span>
                  {job.rating && (
                    <div className="job-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{job.rating}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Liens Rapides</h2>
        </div>

        <Card className="quick-links-card soft-card">
          <button className="quick-link-item" onClick={() => navigate('/client/jobs')}>
            <div className="quick-link-left">
              <div className="quick-link-icon gradient-blue">
                <FileText size={20} />
              </div>
              <span className="quick-link-label">Mes Travaux</span>
            </div>
            <div className="quick-link-right">
              {myJobs.length > 0 && <span className="quick-link-badge">{myJobs.length}</span>}
              <ChevronRight size={20} className="quick-link-chevron" />
            </div>
          </button>
          <button className="quick-link-item" onClick={() => navigate('/client/invoices')}>
            <div className="quick-link-left">
              <div className="quick-link-icon gradient-green">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="14" height="16" rx="2" />
                  <path d="M7 3v16M11 7h4M11 11h4" />
                </svg>
              </div>
              <span className="quick-link-label">Mes Factures</span>
            </div>
            <ChevronRight size={20} className="quick-link-chevron" />
          </button>
          <button className="quick-link-item" onClick={() => navigate('/client/profile')}>
            <div className="quick-link-left">
              <div className="quick-link-icon gradient-purple">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="6" r="3" />
                  <path d="M4 18v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <span className="quick-link-label">Mon Profil</span>
            </div>
            <ChevronRight size={20} className="quick-link-chevron" />
          </button>
        </Card>
      </div>

      {/* Empty State */}
      {myJobs.length === 0 && (
        <Card className="empty-state-card">
          <Plus size={64} className="empty-icon" />
          <h3 className="empty-title">Aucun Service Demandé</h3>
          <p className="empty-message">
            Commencez par demander un service d'urgence ou planifié
          </p>
          <button
            className="btn-gradient btn-primary btn-large"
            onClick={() => navigate('/client/request/urgent')}
          >
            Demander un Service
          </button>
        </Card>
      )}
      </div>
    </AppLayout>
  )
}

export default ClientDashboard
