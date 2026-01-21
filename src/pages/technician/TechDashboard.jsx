import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Card, Button, List, ListItem } from 'konsta/react'
import { Briefcase, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useBiddingStore } from '@stores/biddingStore'
import { useNotificationsStore } from '@stores/notificationsStore'
import { useUIStore } from '@stores/uiStore'
import MobileBottomNav from '@components/layout/MobileBottomNav'
import BiddingJobCard from '@components/cards/BiddingJobCard'
import StatusBadge from '@components/common/StatusBadge'
import { formatCurrency, formatDate, formatTime } from '@utils/formatters'
import mockJobs from '@data/mockJobs'

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
    <Page>
      <Navbar
        title={`Bonjour, ${user?.name?.split(' ')[0]} 👋`}
        subtitle={`⭐ ${user?.rating || 0} | ${user?.completedJobs || 0} travaux complétés`}
      />

      <div className="pb-20">
        {/* Stats Cards */}
        <Block className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <Briefcase size={24} className="mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{todayJobs.length}</div>
              <div className="text-sm text-gray-600">Aujourd'hui</div>
            </Card>
            <Card className="text-center">
              <TrendingUp size={24} className="mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{formatCurrency(12450, false)}</div>
              <div className="text-sm text-gray-600">Ce mois</div>
            </Card>
          </div>
        </Block>

        {/* Urgent Jobs - Bidding */}
        {activeBiddings.length > 0 && (
          <Block>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertCircle size={24} className="text-red-600" />
                Urgences Disponibles ({activeBiddings.length})
              </h2>
            </div>

            {activeBiddings.map((job) => (
              <BiddingJobCard
                key={job.id}
                job={job}
                onBid={handleBid}
                onPass={handlePass}
              />
            ))}
          </Block>
        )}

        {/* Next Scheduled Job */}
        {nextJob && (
          <Block>
            <h2 className="text-xl font-bold mb-3">Prochain Travail</h2>
            <Card>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{nextJob.serviceName}</h3>
                  <p className="text-sm text-gray-600">{nextJob.clientName}</p>
                </div>
                <StatusBadge status={nextJob.status} />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{formatDate(nextJob.scheduledDate)} à {nextJob.scheduledTime}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{nextJob.address.street}, {nextJob.address.city}</p>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => navigate(`/tech/job/${nextJob.id}/active`)}
                >
                  Démarrer GPS
                </Button>
                <Button
                  outline
                  className="flex-1"
                  onClick={() => window.open(`tel:${nextJob.clientPhone}`)}
                >
                  Appeler
                </Button>
              </div>
            </Card>
          </Block>
        )}

        {/* Quick Actions */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Actions Rapides</h2>
          <List strong inset>
            <ListItem
              link
              chevron
              title="Voir tous les travaux"
              onClick={() => navigate('/tech/jobs')}
            />
            <ListItem
              link
              chevron
              title="Mes revenus"
              onClick={() => navigate('/tech/earnings')}
            />
            <ListItem
              link
              chevron
              title="Mon profil"
              onClick={() => navigate('/tech/profile')}
            />
          </List>
        </Block>

        {/* Empty state if no urgent jobs */}
        {activeBiddings.length === 0 && !nextJob && (
          <Block className="text-center py-8">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Aucun travail disponible</h3>
            <p className="text-gray-600">
              Vous serez notifié dès qu'une nouvelle urgence sera disponible
            </p>
          </Block>
        )}
      </div>

      <MobileBottomNav />
    </Page>
  )
}

export default TechDashboard
