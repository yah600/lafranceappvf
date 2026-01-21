import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Card, Button, Segmented, SegmentedButton } from 'konsta/react'
import { Plus, Users, MapPin, Phone, Clock } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import StatusBadge from '@components/common/StatusBadge'
import { formatDate, formatTime, formatCurrency, formatAddress } from '@utils/formatters'
import { getDivisionColor } from '@config/divisions'
import mockJobs from '@data/mockJobs'

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
      className="mb-3 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/dispatch/job/${job.id}`)}
      style={{ borderLeft: `4px solid ${getDivisionColor(job.division)}` }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-bold text-sm mb-1">#{job.id.slice(-4)}</div>
            <h4 className="font-semibold">{job.serviceName}</h4>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{job.clientName}</span>
          </div>
          {job.technicianName && (
            <div className="flex items-center gap-1 text-blue-600">
              <Users size={14} />
              <span>{job.technicianName}</span>
            </div>
          )}
          {job.scheduledDate && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatDate(job.scheduledDate)} {job.scheduledTime}</span>
            </div>
          )}
        </div>

        {job.amount && (
          <div className="text-sm font-semibold text-green-600">
            {formatCurrency(job.amount)}
          </div>
        )}

        {job.type === 'urgent' && job.status === 'bidding' && (
          <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
            🚨 Enchères en cours ({job.bids?.length || 0} enchères)
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <Page>
      <Navbar
        title={`Dispatch - ${activeDivision || 'Toutes'}`}
        subtitle={`${divisionJobs.length} travaux actifs`}
      />

      <div className="pb-8">
        {/* Actions */}
        <Block className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => navigate('/dispatch/create-urgent')}
          >
            <Plus size={20} className="mr-2" />
            Créer Urgence
          </Button>
          <Button
            outline
            onClick={() => navigate('/dispatch/technicians')}
          >
            <Users size={20} />
          </Button>
        </Block>

        {/* View Toggle */}
        <Block>
          <Segmented raised>
            <SegmentedButton
              active={view === 'kanban'}
              onClick={() => setView('kanban')}
            >
              Kanban
            </SegmentedButton>
            <SegmentedButton
              active={view === 'list'}
              onClick={() => setView('list')}
            >
              Liste
            </SegmentedButton>
          </Segmented>
        </Block>

        {/* Stats */}
        <Block>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(columns).map(([key, col]) => (
              <Card key={key} className="text-center p-3">
                <div className="text-2xl font-bold">{col.count}</div>
                <div className="text-xs text-gray-600">{col.title}</div>
              </Card>
            ))}
          </div>
        </Block>

        {/* Kanban Board */}
        {view === 'kanban' && (
          <Block>
            <div className="space-y-6">
              {Object.entries(columns).map(([key, column]) => (
                <div key={key}>
                  <div className={`${column.color} px-3 py-2 rounded-t-lg font-bold text-sm flex justify-between items-center`}>
                    <span>{column.title}</span>
                    <span className="bg-white px-2 py-1 rounded text-xs">{column.count}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-b-lg min-h-[100px]">
                    {column.jobs.length === 0 ? (
                      <div className="text-center text-gray-400 py-4 text-sm">
                        Aucun travail
                      </div>
                    ) : (
                      column.jobs.map(renderJobCard)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Block>
        )}

        {/* List View */}
        {view === 'list' && (
          <Block>
            {divisionJobs.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">Aucun travail</p>
              </div>
            ) : (
              divisionJobs.map(renderJobCard)
            )}
          </Block>
        )}

        {/* Technicians Summary */}
        <Block>
          <h3 className="font-bold mb-3">Techniciens Disponibles</h3>
          <Card>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-xs text-gray-600">Disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-xs text-gray-600">Occupés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">1</div>
                <div className="text-xs text-gray-600">Hors service</div>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => navigate('/dispatch/technicians')}
            >
              Voir Tous les Techniciens
            </Button>
          </Card>
        </Block>
      </div>
    </Page>
  )
}

export default DispatchDashboard
