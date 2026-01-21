import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Briefcase, Users, AlertCircle, DollarSign } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import DashboardGrid from '@components/layout/DashboardGrid'
import StatCard from '@components/common/StatCard'
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
      pageTitle={`Tableau de Bord - ${user?.name}`}
      pageDescription="Vue d'ensemble des 8 divisions"
      breadcrumbs={['Admin', 'Dashboard']}
      showSidebar={true}
      showMobileNav={true}
    >
      <div className="admin-overview">
        {/* Stats Cards */}
        <DashboardGrid columns={4} gap="md">
          <StatCard
            title="Revenus Aujourd'hui"
            value={formatCurrency(todayRevenue, false)}
            icon="💵"
            gradient="blue"
            trend="up"
            trendValue="+18%"
            trendLabel="vs hier"
          />
          <StatCard
            title="Travaux Totaux"
            value={todayJobs.length}
            icon="💼"
            gradient="purple"
            trend="up"
            trendValue={`+${urgentJobs.length}`}
            trendLabel="urgents actifs"
          />
          <StatCard
            title="Note Moyenne"
            value="4.8"
            icon="⭐"
            gradient="green"
            trend="up"
            trendValue="+0.2"
            trendLabel="ce mois"
          />
          <StatCard
            title="Vers Objectif"
            value="68%"
            icon="🎯"
            gradient="orange"
            trend="up"
            trendValue="340K$/mois"
            trendLabel="objectif mensuel"
          />
        </DashboardGrid>

        {/* Urgent Jobs */}
        {urgentJobs.length > 0 && (
          <div className="dashboard-section urgent-section">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">
                  <AlertCircle size={24} className="section-icon urgent-icon" />
                  Urgences en Cours
                </h2>
                <span className="badge badge-urgent">{urgentJobs.length} actives</span>
              </div>
              <p className="section-subtitle">Enchères en cours - Supervision requise</p>
            </div>

            <div className="urgent-jobs-grid">
              {urgentJobs.map((job) => (
                <Card
                  key={job.id}
                  className="urgent-job-card soft-card"
                  onClick={() => navigate(`/admin/bidding-marketplace`)}
                >
                  <div className="urgent-job-header">
                    <div className="urgent-badge">🚨 Urgence</div>
                    <div className="urgent-bids-count">{job.bids?.length || 0} enchères</div>
                  </div>
                  <h3 className="urgent-job-title">{job.serviceName}</h3>
                  <p className="urgent-job-client">{job.clientName}</p>
                  <div className="urgent-job-details">
                    <div className="urgent-detail-item">
                      <span className="detail-label">Ville</span>
                      <span className="detail-value">{job.address.city}</span>
                    </div>
                    <div className="urgent-detail-item">
                      <span className="detail-label">Budget</span>
                      <span className="detail-value">{formatCurrency(job.clientBudget, false)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Division Performance Matrix */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <Briefcase size={24} className="section-icon" />
              Performance par Division
            </h2>
            <p className="section-subtitle">Suivi des 8 divisions en temps réel</p>
          </div>

          <Card className="division-table-card soft-card">
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
                      className="division-row"
                    >
                      <td>
                        <div className="division-name">
                          <div
                            className="division-color"
                            style={{ backgroundColor: div.color }}
                          />
                          <span className="division-label">{div.shortName}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="table-value">{div.totalJobs}</span>
                      </td>
                      <td className="text-center">
                        <span className="table-value revenue">
                          {formatCurrency(div.revenue, false)}
                        </span>
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
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Actions Rapides</h2>
          </div>

          <DashboardGrid columns={4} gap="md">
            <Card
              className="action-card soft-card"
              onClick={() => navigate('/admin/analytics')}
            >
              <div className="action-icon-wrapper gradient-blue">
                <TrendingUp size={28} />
              </div>
              <h3 className="action-title">Analytiques</h3>
              <p className="action-description">Rapports et statistiques</p>
              <div className="action-arrow">→</div>
            </Card>

            <Card
              className="action-card soft-card"
              onClick={() => navigate('/admin/technicians')}
            >
              <div className="action-icon-wrapper gradient-green">
                <Users size={28} />
              </div>
              <h3 className="action-title">Techniciens</h3>
              <p className="action-description">Gestion de l'équipe</p>
              <div className="action-arrow">→</div>
            </Card>

            <Card
              className="action-card soft-card"
              onClick={() => navigate('/admin/compliance')}
            >
              <div className="action-icon-wrapper gradient-orange">
                <AlertCircle size={28} />
              </div>
              <h3 className="action-title">Conformité</h3>
              <p className="action-description">Licences et permis</p>
              <div className="action-arrow">→</div>
            </Card>

            <Card
              className="action-card soft-card"
              onClick={() => navigate('/admin/bidding-marketplace')}
            >
              <div className="action-icon-wrapper gradient-purple">
                <DollarSign size={28} />
              </div>
              <h3 className="action-title">Enchères</h3>
              <p className="action-description">Marché en temps réel</p>
              <div className="action-arrow">→</div>
            </Card>
          </DashboardGrid>
        </div>
      </div>
    </AppLayout>
  )
}

export default AdminOverview
