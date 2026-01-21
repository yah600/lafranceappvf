import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Calendar, Clock, FileText, Star, Plus, Phone, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
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

  // Current active job
  const currentJob = activeJobs[0]

  return (
    <AppLayout
      title={`Bonjour, ${user?.name?.split(' ')[0]} 👋`}
      subtitle="Bienvenue sur votre portail client"
      showHeader={true}
    >
      {/* Quick Actions */}
      <Section title="Demander un Service">
        <div className="service-actions">
          <Card className="service-card service-card-urgent" onClick={() => navigate('/client/request/urgent')}>
            <div className="service-icon-wrapper service-icon-urgent">
              <AlertCircle size={32} />
            </div>
            <h3 className="service-title">Urgence</h3>
            <p className="service-description">Service immédiat</p>
            <p className="service-badge service-badge-urgent">Réponse sous 5 min</p>
          </Card>

          <Card className="service-card service-card-scheduled" onClick={() => navigate('/client/request/scheduled')}>
            <div className="service-icon-wrapper service-icon-scheduled">
              <Calendar size={32} />
            </div>
            <h3 className="service-title">Planifié</h3>
            <p className="service-description">Choisir date/heure</p>
            <p className="service-badge service-badge-scheduled">Réservez maintenant</p>
          </Card>
        </div>
      </Section>

      {/* Current Active Job */}
      {currentJob && (
        <Section title="Travail en Cours">
          <Card className="active-job-card">
            <div className="job-header">
              <div>
                <h3 className="job-service-name">{currentJob.serviceName}</h3>
                {currentJob.technicianName && (
                  <p className="job-tech-name">Technicien: {currentJob.technicianName}</p>
                )}
              </div>
              <StatusBadge status={currentJob.status} />
            </div>

            {currentJob.status === 'bidding' && (
              <div className="job-bidding-status">
                <p className="bidding-message">
                  🔍 Recherche du meilleur technicien disponible...
                </p>
                <p className="bidding-note">
                  Vous recevrez une notification dès qu'un technicien sera assigné
                </p>
              </div>
            )}

            {currentJob.status === 'in-progress' && (
              <div className="job-actions">
                <Button
                  variant="primary"
                  fullWidth={true}
                  onClick={() => navigate(`/client/job/${currentJob.id}/tracking`)}
                >
                  Suivre en Temps Réel
                </Button>
                {currentJob.technicianPhone && (
                  <Button
                    variant="outline"
                    icon={<Phone size={20} />}
                    onClick={() => window.open(`tel:${currentJob.technicianPhone}`)}
                  >
                    Appeler
                  </Button>
                )}
              </div>
            )}

            {(currentJob.status === 'assigned' || currentJob.status === 'pending') && (
              <div className="job-details">
                <div className="job-schedule">
                  <Calendar size={16} />
                  <span>{formatDate(currentJob.scheduledDate)} à {currentJob.scheduledTime}</span>
                </div>
                {currentJob.amount && (
                  <div className="job-amount">
                    Montant: {formatCurrency(currentJob.amount)}
                  </div>
                )}
              </div>
            )}
          </Card>
        </Section>
      )}

      {/* Stats */}
      <Section>
        <div className="dashboard-stats">
          <Card className="stat-card">
            <Clock size={32} className="stat-icon stat-icon-blue" />
            <div className="stat-value">{activeJobs.length}</div>
            <div className="stat-label">En cours</div>
          </Card>
          <Card className="stat-card">
            <FileText size={32} className="stat-icon stat-icon-green" />
            <div className="stat-value">{completedJobs.length}</div>
            <div className="stat-label">Complétés</div>
          </Card>
          <Card className="stat-card">
            <Star size={32} className="stat-icon stat-icon-yellow" />
            <div className="stat-value">4.9</div>
            <div className="stat-label">Note moyenne</div>
          </Card>
        </div>
      </Section>

      {/* Recent Jobs */}
      {completedJobs.length > 0 && (
        <Section>
          <div className="section-header-with-action">
            <h2 className="section-title">Travaux Récents</h2>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate('/client/jobs')}
            >
              Voir tout
            </Button>
          </div>
          <div className="recent-jobs">
            {completedJobs.slice(0, 3).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showTechnician
                showClient={false}
                onClick={() => navigate(`/client/job/${job.id}`)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Quick Links */}
      <Section title="Liens Rapides">
        <Card>
          <div className="quick-links">
            <button className="quick-link-item" onClick={() => navigate('/client/jobs')}>
              <span className="quick-link-label">Mes Travaux</span>
              <div className="quick-link-right">
                {myJobs.length > 0 && <span className="quick-link-badge">{myJobs.length}</span>}
                <ChevronRight size={20} className="quick-link-chevron" />
              </div>
            </button>
            <button className="quick-link-item" onClick={() => navigate('/client/invoices')}>
              <span className="quick-link-label">Mes Factures</span>
              <ChevronRight size={20} className="quick-link-chevron" />
            </button>
            <button className="quick-link-item" onClick={() => navigate('/client/profile')}>
              <span className="quick-link-label">Mon Profil</span>
              <ChevronRight size={20} className="quick-link-chevron" />
            </button>
          </div>
        </Card>
      </Section>

      {/* Empty State */}
      {myJobs.length === 0 && (
        <Section>
          <div className="empty-state">
            <Plus size={64} className="empty-icon" />
            <h3 className="empty-title">Aucun Service Demandé</h3>
            <p className="empty-text">
              Commencez par demander un service d'urgence ou planifié
            </p>
            <Button
              size="large"
              variant="primary"
              onClick={() => navigate('/client/request/urgent')}
            >
              Demander un Service
            </Button>
          </div>
        </Section>
      )}
    </AppLayout>
  )
}

export default ClientDashboard
