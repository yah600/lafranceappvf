import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Briefcase, Users, AlertCircle, DollarSign } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import Card from '@components/common/Card'
import { DIVISIONS } from '@config/divisions'
import { formatCurrency } from '@utils/formatters'
import mockJobs from '@data/mockJobs'
import './AdminOverview.css'

function AdminOverview() {
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

  // Calculate stats
  const todayJobs = jobs.filter((job) => {
    const today = new Date().toISOString().split('T')[0]
    const jobDate = (job.createdAt || '').split('T')[0]
    return jobDate === today
  })

  const todayRevenue = todayJobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, j) => sum + (j.finalAmount || j.amount || 0), 0)

  const urgentJobs = jobs.filter((j) => j.type === 'urgent' && j.status === 'bidding')

  // Division performance
  const divisionStats = DIVISIONS.map((division) => {
    const divJobs = jobs.filter((j) => j.division === division.id)
    const completed = divJobs.filter((j) => j.status === 'completed')
    const active = divJobs.filter((j) => ['assigned', 'in-progress'].includes(j.status))
    const revenue = completed.reduce((sum, j) => sum + (j.finalAmount || j.amount || 0), 0)

    return {
      ...division,
      totalJobs: divJobs.length,
      activeJobs: active.length,
      completedJobs: completed.length,
      revenue,
      alerts: 0, // Mock
    }
  })

  return (
    <AppLayout
      title={`Tableau de Bord - ${user?.name}`}
      subtitle="Vue d'ensemble des 8 divisions"
      showHeader={true}
      showMobileNav={true}
    >
      <div className="admin-overview">
        {/* Today Stats */}
        <Section title="Aujourd'hui">
          <div className="today-stats">
            <Card className="stat-card">
              <DollarSign size={32} className="stat-icon revenue" />
              <div className="stat-value">{formatCurrency(todayRevenue, false)}</div>
              <div className="stat-label">Revenus</div>
              <div className="stat-trend positive">+18%</div>
            </Card>

            <Card className="stat-card">
              <Briefcase size={32} className="stat-icon jobs" />
              <div className="stat-value">{todayJobs.length}</div>
              <div className="stat-label">Travaux</div>
              <div className="stat-meta">({urgentJobs.length} urgents)</div>
            </Card>

            <Card className="stat-card">
              <TrendingUp size={32} className="stat-icon rating" />
              <div className="stat-value">4.8</div>
              <div className="stat-label">Note moyenne</div>
              <div className="stat-trend positive">+0.2</div>
            </Card>

            <Card className="stat-card">
              <Users size={32} className="stat-icon goal" />
              <div className="stat-value">68%</div>
              <div className="stat-label">Vers objectif</div>
              <div className="stat-meta">340K$/mois</div>
            </Card>
          </div>
        </Section>

        {/* Urgent Jobs */}
        {urgentJobs.length > 0 && (
          <Section>
            <div className="urgent-header">
              <AlertCircle size={24} className="urgent-icon" />
              <h2 className="urgent-title">Urgences en Cours ({urgentJobs.length})</h2>
            </div>
            <div className="urgent-jobs">
              {urgentJobs.map((job) => (
                <Card
                  key={job.id}
                  className="urgent-job-card"
                  onClick={() => navigate(`/admin/bidding-marketplace`)}
                >
                  <div className="urgent-job-info">
                    <div className="urgent-job-title">{job.serviceName}</div>
                    <div className="urgent-job-details">
                      {job.clientName} - {job.address.city}
                    </div>
                  </div>
                  <div className="urgent-job-meta">
                    <div className="urgent-job-bids">
                      {job.bids?.length || 0} enchères
                    </div>
                    <div className="urgent-job-budget">
                      Budget: {formatCurrency(job.clientBudget, false)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* Division Performance Matrix */}
        <Section title="Performance par Division">
          <div className="division-table-wrapper">
            <table className="division-table">
              <thead>
                <tr>
                  <th>Division</th>
                  <th>Jobs</th>
                  <th>Revenus</th>
                  <th>Actifs</th>
                  <th>Alertes</th>
                </tr>
              </thead>
              <tbody>
                {divisionStats.map((div) => (
                  <tr
                    key={div.id}
                    onClick={() => navigate(`/admin/division/${div.id}`)}
                  >
                    <td>
                      <div className="division-name">
                        <div
                          className="division-color"
                          style={{ backgroundColor: div.color }}
                        />
                        <span>{div.shortName}</span>
                      </div>
                    </td>
                    <td className="text-center">{div.totalJobs}</td>
                    <td className="text-center revenue">
                      {formatCurrency(div.revenue, false)}
                    </td>
                    <td className="text-center">
                      <span className="active-badge">
                        {div.activeJobs}
                      </span>
                    </td>
                    <td className="text-center">
                      {div.alerts === 0 ? (
                        <span className="alert-success">✓</span>
                      ) : (
                        <span className="alert-badge">
                          {div.alerts}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Quick Actions */}
        <Section title="Actions Rapides">
          <div className="quick-actions">
            <Card
              className="action-card"
              onClick={() => navigate('/admin/analytics')}
            >
              <TrendingUp size={32} className="action-icon analytics" />
              <div className="action-label">Analytiques</div>
            </Card>
            <Card
              className="action-card"
              onClick={() => navigate('/admin/technicians')}
            >
              <Users size={32} className="action-icon technicians" />
              <div className="action-label">Techniciens</div>
            </Card>
            <Card
              className="action-card"
              onClick={() => navigate('/admin/compliance')}
            >
              <AlertCircle size={32} className="action-icon compliance" />
              <div className="action-label">Conformité</div>
            </Card>
            <Card
              className="action-card"
              onClick={() => navigate('/admin/bidding-marketplace')}
            >
              <DollarSign size={32} className="action-icon bidding" />
              <div className="action-label">Enchères</div>
            </Card>
          </div>
        </Section>
      </div>
    </AppLayout>
  )
}

export default AdminOverview
