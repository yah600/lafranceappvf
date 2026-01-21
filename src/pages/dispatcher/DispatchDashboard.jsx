import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, MapPin, Phone, Clock } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import DashboardGrid from '@components/layout/DashboardGrid'
import StatCard from '@components/common/StatCard'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import StatusBadge from '@components/common/StatusBadge'
import { formatDate, formatTime, formatCurrency, formatAddress } from '@utils/formatters'
import { getDivisionColor } from '@config/divisions'
import mockJobs from '@data/mockJobs'
import './DispatchDashboard.css'

function DispatchDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const activeDivision = useAuthStore((state) => state.activeDivision)
  const jobs = useJobsStore((state) => state.jobs)
  const setJobs = useJobsStore((state) => state.setJobs)

  // Initialize jobs
  useEffect(() => {
    if (jobs.length === 0) {
      setJobs(mockJobs)
    }
  }, [jobs.length, setJobs])

  // Filter by active division
  const divisionJobs = activeDivision
    ? jobs.filter((job) => job.division === activeDivision)
    : jobs

  // Kanban columns
  const columns = {
    incoming: {
      title: 'INCOMING',
      count: divisionJobs.filter((j) => j.status === 'pending' || j.status === 'bidding').length,
      jobs: divisionJobs.filter((j) => j.status === 'pending' || j.status === 'bidding'),
      color: 'bg-gray-100',
    },
    assigned: {
      title: 'ASSIGNED',
      count: divisionJobs.filter((j) => j.status === 'assigned').length,
      jobs: divisionJobs.filter((j) => j.status === 'assigned'),
      color: 'bg-blue-100',
    },
    inProgress: {
      title: 'IN PROGRESS',
      count: divisionJobs.filter((j) => j.status === 'in-progress').length,
      jobs: divisionJobs.filter((j) => j.status === 'in-progress'),
      color: 'bg-green-100',
    },
    completed: {
      title: 'COMPLETED',
      count: divisionJobs.filter((j) => j.status === 'completed').length,
      jobs: divisionJobs.filter((j) => j.status === 'completed').slice(0, 5),
      color: 'bg-green-200',
    },
  }

  const renderJobCard = (job) => (
    <Card
      key={job.id}
      className="job-card"
      onClick={() => navigate(`/dispatch/job/${job.id}`)}
      style={{ borderLeft: `4px solid ${getDivisionColor(job.division)}` }}
    >
      <div className="job-card-content">
        <div className="job-card-header">
          <div className="job-card-info">
            <div className="job-id">#{job.id.slice(-4)}</div>
            <h4 className="job-title">{job.serviceName}</h4>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="job-card-details">
          <div className="job-detail">
            <Users size={14} />
            <span>{job.clientName}</span>
          </div>
          {job.technicianName && (
            <div className="job-detail technician">
              <Users size={14} />
              <span>{job.technicianName}</span>
            </div>
          )}
          {job.scheduledDate && (
            <div className="job-detail">
              <Clock size={14} />
              <span>{formatDate(job.scheduledDate)} {job.scheduledTime}</span>
            </div>
          )}
        </div>

        {job.amount && (
          <div className="job-amount">
            {formatCurrency(job.amount)}
          </div>
        )}

        {job.type === 'urgent' && job.status === 'bidding' && (
          <div className="job-urgent-badge">
            🚨 Enchères en cours ({job.bids?.length || 0} enchères)
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <AppLayout
      pageTitle={`Dispatch - ${activeDivision || 'Toutes'}`}
      pageDescription={`${divisionJobs.length} travaux actifs`}
      breadcrumbs={['Dispatch', 'Dashboard']}
      showSidebar={true}
      showMobileNav={true}
    >
      <div className="dispatch-dashboard">
        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="dispatch-actions">
            <button
              className="btn-gradient btn-primary btn-create-urgent"
              onClick={() => navigate('/dispatch/create-urgent')}
            >
              <Plus size={20} />
              Créer Urgence
            </button>
            <button
              className="btn-outline btn-secondary"
              onClick={() => navigate('/dispatch/technicians')}
            >
              <Users size={20} />
              Techniciens
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardGrid columns={4} gap="md">
          <StatCard
            title="Incoming"
            value={columns.incoming.count}
            icon="📥"
            gradient="blue"
            trendLabel="nouveaux"
          />
          <StatCard
            title="Assigned"
            value={columns.assigned.count}
            icon="👤"
            gradient="purple"
            trendLabel="assignés"
          />
          <StatCard
            title="In Progress"
            value={columns.inProgress.count}
            icon="⚙️"
            gradient="green"
            trendLabel="en cours"
          />
          <StatCard
            title="Completed"
            value={columns.completed.count}
            icon="✅"
            gradient="orange"
            trendLabel="complétés"
          />
        </DashboardGrid>

        {/* Kanban Board */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Vue Kanban</h2>
            <p className="section-subtitle">Glissez-déposez pour changer le statut</p>
          </div>

          <div className="kanban-board">
            {Object.entries(columns).map(([key, column]) => (
              <div key={key} className="kanban-column">
                <div className={`kanban-column-header kanban-header-${key}`}>
                  <span className="kanban-column-title">{column.title}</span>
                  <span className="kanban-column-count">{column.count}</span>
                </div>
                <div className="kanban-column-body">
                  {column.jobs.length === 0 ? (
                    <div className="kanban-empty">
                      Aucun travail
                    </div>
                  ) : (
                    column.jobs.map(renderJobCard)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technicians Summary */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <Users size={24} className="section-icon" />
              Techniciens Disponibles
            </h2>
          </div>

          <Card className="technicians-card soft-card">
            <div className="technicians-stats">
              <div className="tech-stat">
                <div className="tech-stat-value available">3</div>
                <div className="tech-stat-label">Disponibles</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value busy">2</div>
                <div className="tech-stat-label">Occupés</div>
              </div>
              <div className="tech-stat">
                <div className="tech-stat-value offline">1</div>
                <div className="tech-stat-label">Hors service</div>
              </div>
            </div>
            <button
              className="btn-gradient btn-primary"
              onClick={() => navigate('/dispatch/technicians')}
            >
              Voir Tous les Techniciens
            </button>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default DispatchDashboard
