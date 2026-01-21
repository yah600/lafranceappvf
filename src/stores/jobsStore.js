import { create } from 'zustand'

export const useJobsStore = create((set, get) => ({
  jobs: [],
  activeJob: null,
  loading: false,
  error: null,

  // Set all jobs
  setJobs: (jobs) => set({ jobs }),

  // Add new job
  addJob: (job) =>
    set((state) => ({
      jobs: [job, ...state.jobs],
    })),

  // Update job
  updateJob: (jobId, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job
      ),
    })),

  // Delete job
  deleteJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== jobId),
    })),

  // Set active job (currently viewing/working on)
  setActiveJob: (job) => set({ activeJob: job }),

  // Get job by ID
  getJobById: (jobId) => {
    const { jobs } = get()
    return jobs.find((job) => job.id === jobId)
  },

  // Get jobs by division
  getJobsByDivision: (divisionId) => {
    const { jobs } = get()
    return jobs.filter((job) => job.division === divisionId)
  },

  // Get jobs by status
  getJobsByStatus: (status) => {
    const { jobs } = get()
    return jobs.filter((job) => job.status === status)
  },

  // Get jobs by technician
  getJobsByTechnician: (technicianId) => {
    const { jobs } = get()
    return jobs.filter((job) => job.technicianId === technicianId)
  },

  // Get jobs by client
  getJobsByClient: (clientId) => {
    const { jobs } = get()
    return jobs.filter((job) => job.clientId === clientId)
  },

  // Get urgent jobs in bidding
  getUrgentJobs: () => {
    const { jobs } = get()
    return jobs.filter((job) => job.type === 'urgent' && job.status === 'bidding')
  },

  // Get linked jobs (cross-division projects)
  getLinkedJobs: (linkedProjectId) => {
    const { jobs } = get()
    return jobs.filter((job) => job.linkedProjectId === linkedProjectId)
  },

  // Get today's jobs
  getTodaysJobs: (technicianId = null) => {
    const { jobs } = get()
    const today = new Date().toISOString().split('T')[0]

    return jobs.filter((job) => {
      const jobDate = (job.scheduledDate || job.createdAt)?.split('T')[0]
      const matchesDate = jobDate === today
      const matchesTech = technicianId ? job.technicianId === technicianId : true
      return matchesDate && matchesTech
    })
  },

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),
}))
