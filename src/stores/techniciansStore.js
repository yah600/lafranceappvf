import { create } from 'zustand'

export const useTechniciansStore = create((set, get) => ({
  technicians: [],
  loading: false,
  error: null,

  // Set all technicians
  setTechnicians: (technicians) => set({ technicians }),

  // Add technician
  addTechnician: (technician) =>
    set((state) => ({
      technicians: [...state.technicians, technician],
    })),

  // Update technician
  updateTechnician: (technicianId, updates) =>
    set((state) => ({
      technicians: state.technicians.map((tech) =>
        tech.id === technicianId ? { ...tech, ...updates } : tech
      ),
    })),

  // Delete technician
  deleteTechnician: (technicianId) =>
    set((state) => ({
      technicians: state.technicians.filter((tech) => tech.id !== technicianId),
    })),

  // Get technician by ID
  getTechnicianById: (technicianId) => {
    const { technicians } = get()
    return technicians.find((tech) => tech.id === technicianId)
  },

  // Get technicians by division
  getTechniciansByDivision: (divisionId) => {
    const { technicians } = get()
    return technicians.filter((tech) => tech.divisions?.includes(divisionId))
  },

  // Get available technicians for division
  getAvailableTechnicians: (divisionId) => {
    const { technicians } = get()
    return technicians.filter(
      (tech) =>
        tech.divisions?.includes(divisionId) &&
        tech.status === 'available' &&
        !tech.currentJob
    )
  },

  // Get technicians by status
  getTechniciansByStatus: (status) => {
    const { technicians } = get()
    return technicians.filter((tech) => tech.status === status)
  },

  // Search technicians
  searchTechnicians: (query) => {
    const { technicians } = get()
    const lowerQuery = query.toLowerCase()
    return technicians.filter(
      (tech) =>
        tech.name?.toLowerCase().includes(lowerQuery) ||
        tech.email?.toLowerCase().includes(lowerQuery) ||
        tech.phone?.includes(query)
    )
  },

  // Update technician location
  updateLocation: (technicianId, location) => {
    set((state) => ({
      technicians: state.technicians.map((tech) =>
        tech.id === technicianId
          ? { ...tech, location, lastLocationUpdate: new Date().toISOString() }
          : tech
      ),
    }))
  },

  // Update technician rating
  updateRating: (technicianId, newRating) => {
    const tech = get().getTechnicianById(technicianId)
    if (!tech) return

    const totalJobs = tech.completedJobs || 0
    const currentAvg = tech.rating || 0
    const newAvg = totalJobs > 0
      ? ((currentAvg * (totalJobs - 1)) + newRating) / totalJobs
      : newRating

    set((state) => ({
      technicians: state.technicians.map((t) =>
        t.id === technicianId
          ? { ...t, rating: parseFloat(newAvg.toFixed(2)) }
          : t
      ),
    }))
  },

  // Set loading/error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
