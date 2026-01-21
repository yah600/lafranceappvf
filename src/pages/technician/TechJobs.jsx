import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Segmented, SegmentedButton } from 'konsta/react'
import { Gavel, Calendar, PlayCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useBiddingStore } from '@stores/biddingStore'
import { useUIStore } from '@stores/uiStore'
import MobileBottomNav from '@components/layout/MobileBottomNav'
import BiddingJobCard from '@components/cards/BiddingJobCard'
import JobCard from '@components/cards/JobCard'
import LoadingSpinner from '@components/common/LoadingSpinner'
import mockJobs from '@data/mockJobs'

function TechJobs() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const jobs = useJobsStore((state) => state.jobs)
  const setJobs = useJobsStore((state) => state.setJobs)
  const activeBiddings = useBiddingStore((state) => state.activeBiddings)
  const startBidding = useBiddingStore((state) => state.startBidding)
  const placeBid = useBiddingStore((state) => state.placeBid)
  const showToast = useUIStore((state) => state.showToast)

  const [activeTab, setActiveTab] = useState('available')
  const [loading, setLoading] = useState(true)

  // Initialize jobs
  useEffect(() => {
    if (jobs.length === 0) {
      setJobs(mockJobs)
    }
    setLoading(false)
  }, [jobs.length, setJobs])

  // Initialize bidding
  useEffect(() => {
    const urgentJobs = jobs.filter((job) => job.type === 'urgent' && job.status === 'bidding')
    urgentJobs.forEach((job) => {
      const alreadyInBidding = activeBiddings.some((b) => b.id === job.id)
      if (!alreadyInBidding) {
        startBidding(job)
      }
    })
  }, [jobs, activeBiddings, startBidding])

  // Filter jobs by tab
  const myJobs = jobs.filter((job) => job.technicianId === user?.id)

  const availableJobs = activeBiddings // Urgent bidding jobs
  const assignedJobs = myJobs.filter((job) => job.status === 'assigned')
  const activeJobs = myJobs.filter((job) => job.status === 'in-progress')
  const completedJobs = myJobs
    .filter((job) => job.status === 'completed')
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))

  // Handle bid
  const handleBid = (jobId, amount) => {
    placeBid(jobId, amount)
    showToast(`Enchère de $${amount} soumise!`, 'success')
  }

  // Handle pass
  const handlePass = (jobId) => {
    if (confirm('Passer cette opportunité?')) {
      showToast('Opportunité ignorée', 'info')
    }
  }

  // Handle job click
  const handleJobClick = (job) => {
    if (job.status === 'in-progress') {
      navigate(`/tech/job/${job.id}/active`)
    }
  }

  // Render content based on tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <Block className="text-center py-12">
          <LoadingSpinner size="lg" />
        </Block>
      )
    }

    switch (activeTab) {
      case 'available':
        return (
          <Block>
            <h2 className="text-lg font-bold mb-3">
              🚨 Urgences Disponibles ({availableJobs.length})
            </h2>
            {availableJobs.length === 0 ? (
              <div className="text-center py-8">
                <Gavel size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Aucune urgence disponible</p>
                <p className="text-sm text-gray-500 mt-2">
                  Vous serez notifié des nouvelles opportunités
                </p>
              </div>
            ) : (
              availableJobs.map((job) => (
                <BiddingJobCard
                  key={job.id}
                  job={job}
                  onBid={handleBid}
                  onPass={handlePass}
                />
              ))
            )}
          </Block>
        )

      case 'assigned':
        return (
          <Block>
            <h2 className="text-lg font-bold mb-3">
              📅 Travaux Assignés ({assignedJobs.length})
            </h2>
            {assignedJobs.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Aucun travail assigné</p>
              </div>
            ) : (
              assignedJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={handleJobClick} />
              ))
            )}
          </Block>
        )

      case 'active':
        return (
          <Block>
            <h2 className="text-lg font-bold mb-3">
              🔵 En Cours ({activeJobs.length})
            </h2>
            {activeJobs.length === 0 ? (
              <div className="text-center py-8">
                <PlayCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Aucun travail en cours</p>
              </div>
            ) : (
              activeJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={handleJobClick} />
              ))
            )}
          </Block>
        )

      case 'completed':
        return (
          <Block>
            <h2 className="text-lg font-bold mb-3">
              ✅ Complétés ({completedJobs.length})
            </h2>
            {completedJobs.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Aucun travail complété</p>
              </div>
            ) : (
              completedJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={handleJobClick} />
              ))
            )}
          </Block>
        )

      default:
        return null
    }
  }

  return (
    <Page>
      <Navbar title="Mes Travaux" />

      {/* Tabs */}
      <Block className="space-y-0 mb-4">
        <Segmented raised>
          <SegmentedButton
            active={activeTab === 'available'}
            onClick={() => setActiveTab('available')}
          >
            <div className="flex flex-col items-center py-1">
              <Gavel size={20} />
              <span className="text-xs mt-1">Disponibles</span>
              {availableJobs.length > 0 && (
                <span className="text-xs font-bold text-red-600">({availableJobs.length})</span>
              )}
            </div>
          </SegmentedButton>
          <SegmentedButton
            active={activeTab === 'assigned'}
            onClick={() => setActiveTab('assigned')}
          >
            <div className="flex flex-col items-center py-1">
              <Calendar size={20} />
              <span className="text-xs mt-1">Assignés</span>
              {assignedJobs.length > 0 && (
                <span className="text-xs font-bold">({assignedJobs.length})</span>
              )}
            </div>
          </SegmentedButton>
          <SegmentedButton
            active={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          >
            <div className="flex flex-col items-center py-1">
              <PlayCircle size={20} />
              <span className="text-xs mt-1">En cours</span>
              {activeJobs.length > 0 && (
                <span className="text-xs font-bold text-green-600">({activeJobs.length})</span>
              )}
            </div>
          </SegmentedButton>
          <SegmentedButton
            active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
          >
            <div className="flex flex-col items-center py-1">
              <CheckCircle size={20} />
              <span className="text-xs mt-1">Complétés</span>
            </div>
          </SegmentedButton>
        </Segmented>
      </Block>

      {/* Tab Content */}
      <div className="pb-20">{renderTabContent()}</div>

      <MobileBottomNav />
    </Page>
  )
}

export default TechJobs
