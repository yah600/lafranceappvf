import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gavel, Calendar, PlayCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useJobsStore } from '@stores/jobsStore'
import { useBiddingStore } from '@stores/biddingStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import TabBar from '@components/common/TabBar'
import BiddingJobCard from '@components/cards/BiddingJobCard'
import JobCard from '@components/cards/JobCard'
import LoadingSpinner from '@components/common/LoadingSpinner'
import mockJobs from '@data/mockJobs'
import './TechJobs.css'

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
        <div className="loading-container">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    switch (activeTab) {
      case 'available':
        return (
          <Section title={`🚨 Urgences Disponibles (${availableJobs.length})`}>
            {availableJobs.length === 0 ? (
              <div className="empty-state">
                <Gavel size={48} className="empty-icon" />
                <p className="empty-text">Aucune urgence disponible</p>
                <p className="empty-subtext">
                  Vous serez notifié des nouvelles opportunités
                </p>
              </div>
            ) : (
              <div className="jobs-list">
                {availableJobs.map((job) => (
                  <BiddingJobCard
                    key={job.id}
                    job={job}
                    onBid={handleBid}
                    onPass={handlePass}
                  />
                ))}
              </div>
            )}
          </Section>
        )

      case 'assigned':
        return (
          <Section title={`📅 Travaux Assignés (${assignedJobs.length})`}>
            {assignedJobs.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} className="empty-icon" />
                <p className="empty-text">Aucun travail assigné</p>
              </div>
            ) : (
              <div className="jobs-list">
                {assignedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={handleJobClick} />
                ))}
              </div>
            )}
          </Section>
        )

      case 'active':
        return (
          <Section title={`🔵 En Cours (${activeJobs.length})`}>
            {activeJobs.length === 0 ? (
              <div className="empty-state">
                <PlayCircle size={48} className="empty-icon" />
                <p className="empty-text">Aucun travail en cours</p>
              </div>
            ) : (
              <div className="jobs-list">
                {activeJobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={handleJobClick} />
                ))}
              </div>
            )}
          </Section>
        )

      case 'completed':
        return (
          <Section title={`✅ Complétés (${completedJobs.length})`}>
            {completedJobs.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} className="empty-icon" />
                <p className="empty-text">Aucun travail complété</p>
              </div>
            ) : (
              <div className="jobs-list">
                {completedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={handleJobClick} />
                ))}
              </div>
            )}
          </Section>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout title="Mes Travaux" showHeader={true} showMobileNav={true}>
      <TabBar>
        <TabBar.Tab
          active={activeTab === 'available'}
          onClick={() => setActiveTab('available')}
          icon={<Gavel size={20} />}
          label="Disponibles"
          badge={availableJobs.length > 0 && `(${availableJobs.length})`}
        />
        <TabBar.Tab
          active={activeTab === 'assigned'}
          onClick={() => setActiveTab('assigned')}
          icon={<Calendar size={20} />}
          label="Assignés"
          badge={assignedJobs.length > 0 && `(${assignedJobs.length})`}
        />
        <TabBar.Tab
          active={activeTab === 'active'}
          onClick={() => setActiveTab('active')}
          icon={<PlayCircle size={20} />}
          label="En cours"
          badge={activeJobs.length > 0 && `(${activeJobs.length})`}
        />
        <TabBar.Tab
          active={activeTab === 'completed'}
          onClick={() => setActiveTab('completed')}
          icon={<CheckCircle size={20} />}
          label="Complétés"
        />
      </TabBar>

      {renderTabContent()}
    </AppLayout>
  )
}

export default TechJobs
