import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Card, Button, List, ListItem } from 'konsta/react'
import { AlertCircle, Calendar, Clock, FileText, Star, Plus } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import JobCard from '@components/cards/JobCard'
import StatusBadge from '@components/common/StatusBadge'
import { formatCurrency, formatDate } from '@utils/formatters'
import mockJobs from '@data/mockJobs'

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
    <Page>
      <Navbar
        title={`Bonjour, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Bienvenue sur votre portail client"
      />

      <div className="pb-8">
        {/* Quick Actions */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Demander un Service</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/client/request/urgent')}
            >
              <div className="py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={32} className="text-red-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">Urgence</h3>
                <p className="text-sm text-gray-600">Service immédiat</p>
                <p className="text-xs text-red-600 font-semibold mt-2">Réponse sous 5 min</p>
              </div>
            </Card>

            <Card
              className="text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/client/request/scheduled')}
            >
              <div className="py-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar size={32} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">Planifié</h3>
                <p className="text-sm text-gray-600">Choisir date/heure</p>
                <p className="text-xs text-blue-600 font-semibold mt-2">Réservez maintenant</p>
              </div>
            </Card>
          </div>
        </Block>

        {/* Current Active Job */}
        {currentJob && (
          <Block>
            <h2 className="text-xl font-bold mb-3">Travail en Cours</h2>
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{currentJob.serviceName}</h3>
                  {currentJob.technicianName && (
                    <p className="text-sm text-gray-600">Technicien: {currentJob.technicianName}</p>
                  )}
                </div>
                <StatusBadge status={currentJob.status} />
              </div>

              {currentJob.status === 'bidding' && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    🔍 Recherche du meilleur technicien disponible...
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Vous recevrez une notification dès qu'un technicien sera assigné
                  </p>
                </div>
              )}

              {currentJob.status === 'in-progress' && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => navigate(`/client/job/${currentJob.id}/tracking`)}
                  >
                    Suivre en Temps Réel
                  </Button>
                  {currentJob.technicianPhone && (
                    <Button
                      outline
                      onClick={() => window.open(`tel:${currentJob.technicianPhone}`)}
                    >
                      Appeler
                    </Button>
                  )}
                </div>
              )}

              {(currentJob.status === 'assigned' || currentJob.status === 'pending') && (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} />
                    <span>{formatDate(currentJob.scheduledDate)} à {currentJob.scheduledTime}</span>
                  </div>
                  {currentJob.amount && (
                    <div className="mt-2 text-green-600 font-semibold">
                      Montant: {formatCurrency(currentJob.amount)}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </Block>
        )}

        {/* Stats */}
        <Block>
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <Clock size={32} className="mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{activeJobs.length}</div>
              <div className="text-xs text-gray-600">En cours</div>
            </Card>
            <Card className="text-center">
              <FileText size={32} className="mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{completedJobs.length}</div>
              <div className="text-xs text-gray-600">Complétés</div>
            </Card>
            <Card className="text-center">
              <Star size={32} className="mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-xs text-gray-600">Note moyenne</div>
            </Card>
          </div>
        </Block>

        {/* Recent Jobs */}
        {completedJobs.length > 0 && (
          <Block>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Travaux Récents</h2>
              <Button
                clear
                onClick={() => navigate('/client/jobs')}
                className="text-blue-600"
              >
                Voir tout
              </Button>
            </div>
            {completedJobs.slice(0, 3).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showTechnician
                showClient={false}
                onClick={() => navigate(`/client/job/${job.id}`)}
              />
            ))}
          </Block>
        )}

        {/* Quick Links */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Liens Rapides</h2>
          <List strong inset>
            <ListItem
              link
              chevron
              title="Mes Travaux"
              after={myJobs.length > 0 ? `${myJobs.length}` : ''}
              onClick={() => navigate('/client/jobs')}
            />
            <ListItem
              link
              chevron
              title="Mes Factures"
              onClick={() => navigate('/client/invoices')}
            />
            <ListItem
              link
              chevron
              title="Mon Profil"
              onClick={() => navigate('/client/profile')}
            />
          </List>
        </Block>

        {/* Empty State */}
        {myJobs.length === 0 && (
          <Block className="text-center py-8">
            <Plus size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2">Aucun Service Demandé</h3>
            <p className="text-gray-600 mb-6">
              Commencez par demander un service d'urgence ou planifié
            </p>
            <Button
              large
              onClick={() => navigate('/client/request/urgent')}
              className="max-w-md mx-auto"
            >
              Demander un Service
            </Button>
          </Block>
        )}
      </div>
    </Page>
  )
}

export default ClientDashboard
