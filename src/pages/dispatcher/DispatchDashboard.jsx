import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, MapPin, Phone, Clock } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import TabBar from '@components/common/TabBar'
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

  const [view, setView] = useState('kanban') // kanban | list

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
      title={`Dispatch - ${activeDivision || 'Toutes'}`}
      subtitle={`${divisionJobs.length} travaux actifs`}
      showHeader={true}
      showMobileNav={true}
    >
      <div className="dispatch-dashboard">
        {/* Actions */}
        <Section>
          <div className="dispatch-actions">
            <Button
              onClick={() => navigate('/dispatch/create-urgent')}
              icon={<Plus size={20} />}
              fullWidth
            >
              Créer Urgence
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dispatch/technicians')}
              icon={<Users size={20} />}
            />
          </div>
        </Section>

        {/* View Toggle */}
        <Section>
          <TabBar>
            <TabBar.Tab
              active={view === 'kanban'}
              onClick={() => setView('kanban')}
              label="Kanban"
            />
            <TabBar.Tab
              active={view === 'list'}
              onClick={() => setView('list')}
              label="Liste"
            />
          </TabBar>
        </Section>

        {/* Stats */}
        <Section>
          <div className="dispatch-stats">
            {Object.entries(columns).map(([key, col]) => (
              <Card key={key} className="stat-card">
                <div className="stat-value">{col.count}</div>
                <div className="stat-label">{col.title}</div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Kanban Board */}
        {view === 'kanban' && (
          <Section>
            <div className="kanban-board">
              {Object.entries(columns).map(([key, column]) => (
                <div key={key} className="kanban-column">
                  <div className={`kanban-column-header ${key}`}>
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
          </Section>
        )}

        {/* List View */}
        {view === 'list' && (
          <Section>
            {divisionJobs.length === 0 ? (
              <div className="list-empty">
                <Users size={48} />
                <p>Aucun travail</p>
              </div>
            ) : (
              <div className="list-view">
                {divisionJobs.map(renderJobCard)}
              </div>
            )}
          </Section>
        )}

        {/* Technicians Summary */}
        <Section title="Techniciens Disponibles">
          <Card>
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
            <Button
              fullWidth
              onClick={() => navigate('/dispatch/technicians')}
            >
              Voir Tous les Techniciens
            </Button>
          </Card>
        </Section>
      </div>
    </AppLayout>
  )
}

export default DispatchDashboard
