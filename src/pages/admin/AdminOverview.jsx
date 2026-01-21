import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Card } from 'konsta/react'
import { TrendingUp, Briefcase, Users, AlertCircle, DollarSign } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { DIVISIONS } from '@config/divisions'
import { formatCurrency } from '@utils/formatters'
import mockJobs from '@data/mockJobs'

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
    <Page>
      <Navbar
        title={`Tableau de Bord - ${user?.name}`}
        subtitle="Vue d'ensemble des 8 divisions"
      />

      <div className="pb-8">
        {/* Today Stats */}
        <Block>
          <h2 className="text-2xl font-bold mb-4">Aujourd'hui</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <DollarSign size={32} className="mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold">{formatCurrency(todayRevenue, false)}</div>
              <div className="text-sm text-gray-600">Revenus</div>
              <div className="text-xs text-green-600 font-semibold">+18%</div>
            </Card>

            <Card className="text-center">
              <Briefcase size={32} className="mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold">{todayJobs.length}</div>
              <div className="text-sm text-gray-600">Travaux</div>
              <div className="text-xs text-gray-500">({urgentJobs.length} urgents)</div>
            </Card>

            <Card className="text-center">
              <TrendingUp size={32} className="mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
              <div className="text-xs text-purple-600">+0.2</div>
            </Card>

            <Card className="text-center">
              <Users size={32} className="mx-auto mb-2 text-orange-600" />
              <div className="text-3xl font-bold">68%</div>
              <div className="text-sm text-gray-600">Vers objectif</div>
              <div className="text-xs text-gray-500">340K$/mois</div>
            </Card>
          </div>
        </Block>

        {/* Urgent Jobs */}
        {urgentJobs.length > 0 && (
          <Block>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={24} className="text-red-600" />
              <h2 className="text-xl font-bold">Urgences en Cours ({urgentJobs.length})</h2>
            </div>
            <div className="space-y-2">
              {urgentJobs.map((job) => (
                <Card
                  key={job.id}
                  className="flex justify-between items-center cursor-pointer hover:shadow-lg"
                  onClick={() => navigate(`/admin/bidding-marketplace`)}
                >
                  <div>
                    <div className="font-bold">{job.serviceName}</div>
                    <div className="text-sm text-gray-600">
                      {job.clientName} - {job.address.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-600 font-semibold">
                      {job.bids?.length || 0} enchères
                    </div>
                    <div className="text-xs text-gray-500">
                      Budget: {formatCurrency(job.clientBudget, false)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Block>
        )}

        {/* Division Performance Matrix */}
        <Block>
          <h2 className="text-2xl font-bold mb-4">Performance par Division</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-bold">Division</th>
                  <th className="text-center p-3 font-bold">Jobs</th>
                  <th className="text-center p-3 font-bold">Revenus</th>
                  <th className="text-center p-3 font-bold">Actifs</th>
                  <th className="text-center p-3 font-bold">Alertes</th>
                </tr>
              </thead>
              <tbody>
                {divisionStats.map((div) => (
                  <tr
                    key={div.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/division/${div.id}`)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: div.color }}
                        />
                        <span className="font-semibold">{div.shortName}</span>
                      </div>
                    </td>
                    <td className="text-center p-3 font-semibold">{div.totalJobs}</td>
                    <td className="text-center p-3 font-semibold text-green-600">
                      {formatCurrency(div.revenue, false)}
                    </td>
                    <td className="text-center p-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {div.activeJobs}
                      </span>
                    </td>
                    <td className="text-center p-3">
                      {div.alerts === 0 ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                          {div.alerts}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        {/* Quick Actions */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Actions Rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="text-center cursor-pointer hover:shadow-lg"
              onClick={() => navigate('/admin/analytics')}
            >
              <TrendingUp size={32} className="mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">Analytiques</div>
            </Card>
            <Card
              className="text-center cursor-pointer hover:shadow-lg"
              onClick={() => navigate('/admin/technicians')}
            >
              <Users size={32} className="mx-auto mb-2 text-green-600" />
              <div className="font-semibold">Techniciens</div>
            </Card>
            <Card
              className="text-center cursor-pointer hover:shadow-lg"
              onClick={() => navigate('/admin/compliance')}
            >
              <AlertCircle size={32} className="mx-auto mb-2 text-orange-600" />
              <div className="font-semibold">Conformité</div>
            </Card>
            <Card
              className="text-center cursor-pointer hover:shadow-lg"
              onClick={() => navigate('/admin/bidding-marketplace')}
            >
              <DollarSign size={32} className="mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">Enchères</div>
            </Card>
          </div>
        </Block>
      </div>
    </Page>
  )
}

export default AdminOverview
