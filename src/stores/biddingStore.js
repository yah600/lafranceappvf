import { create } from 'zustand'

export const useBiddingStore = create((set, get) => ({
  // State
  activeBiddings: [], // Jobs currently in bidding
  myBids: {}, // { jobId: bidAmount }
  timers: {}, // { jobId: remainingSeconds }

  // Start a new bidding job
  startBidding: (job) => {
    const durationMinutes = job.biddingDuration || 5
    const durationSeconds = durationMinutes * 60

    set((state) => ({
      activeBiddings: [...state.activeBiddings, job],
      timers: {
        ...state.timers,
        [job.id]: durationSeconds,
      },
    }))
  },

  // End bidding for a job
  endBidding: (jobId) => {
    set((state) => ({
      activeBiddings: state.activeBiddings.filter((job) => job.id !== jobId),
      timers: {
        ...state.timers,
        [jobId]: 0,
      },
    }))
  },

  // Place a bid
  placeBid: (jobId, bidAmount) => {
    set((state) => ({
      myBids: {
        ...state.myBids,
        [jobId]: bidAmount,
      },
    }))
  },

  // Update countdown timer (called every second)
  decrementTimer: (jobId) => {
    const { timers, endBidding } = get()
    const currentTime = timers[jobId] || 0

    if (currentTime <= 1) {
      // Timer expired
      endBidding(jobId)
    } else {
      set((state) => ({
        timers: {
          ...state.timers,
          [jobId]: currentTime - 1,
        },
      }))
    }
  },

  // Add competitor bid (for demo/simulation)
  addCompetitorBid: (jobId, technicianName, bidAmount) => {
    set((state) => {
      const biddings = state.activeBiddings.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            bids: [
              ...(job.bids || []),
              {
                technicianId: `tech-${Math.random().toString(36).substr(2, 9)}`,
                technicianName,
                amount: bidAmount,
                timestamp: new Date().toISOString(),
              },
            ].sort((a, b) => a.amount - b.amount), // Lowest first
          }
        }
        return job
      })
      return { activeBiddings: biddings }
    })
  },

  // Get active bidding by job ID
  getActiveBiddingByJobId: (jobId) => {
    const { activeBiddings } = get()
    return activeBiddings.find((job) => job.id === jobId)
  },

  // Get time remaining for job
  getTimeRemaining: (jobId) => {
    const { timers } = get()
    return timers[jobId] || 0
  },

  // Get my bid for job
  getMyBid: (jobId) => {
    const { myBids } = get()
    return myBids[jobId]
  },

  // Get current lowest bid
  getLowestBid: (jobId) => {
    const job = get().getActiveBiddingByJobId(jobId)
    if (!job?.bids || job.bids.length === 0) return null
    return Math.min(...job.bids.map(b => b.amount))
  },

  // Check if user is winning
  isWinning: (jobId, userId) => {
    const job = get().getActiveBiddingByJobId(jobId)
    if (!job?.bids || job.bids.length === 0) return false

    const lowestBid = Math.min(...job.bids.map(b => b.amount))
    const userBid = job.bids.find(b => b.technicianId === userId)

    return userBid && userBid.amount === lowestBid
  },

  // Determine winner when bidding ends
  determineWinner: (jobId) => {
    const job = get().getActiveBiddingByJobId(jobId)
    if (!job?.bids || job.bids.length === 0) return null

    const lowestAmount = Math.min(...job.bids.map(b => b.amount))
    const tiedBids = job.bids.filter(b => b.amount === lowestAmount)

    if (tiedBids.length === 1) {
      return tiedBids[0]
    }

    // If tied, earliest bid wins
    return tiedBids.sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    )[0]
  },
}))
