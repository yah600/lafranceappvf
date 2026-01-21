import { create } from 'zustand'

export const useClientsStore = create((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  // Set all clients
  setClients: (clients) => set({ clients }),

  // Add client
  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, client],
    })),

  // Update client
  updateClient: (clientId, updates) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === clientId ? { ...client, ...updates } : client
      ),
    })),

  // Delete client
  deleteClient: (clientId) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== clientId),
    })),

  // Get client by ID
  getClientById: (clientId) => {
    const { clients } = get()
    return clients.find((client) => client.id === clientId)
  },

  // Search clients
  searchClients: (query) => {
    const { clients } = get()
    const lowerQuery = query.toLowerCase()
    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(lowerQuery) ||
        client.email?.toLowerCase().includes(lowerQuery) ||
        client.phone?.includes(query) ||
        client.address?.toLowerCase().includes(lowerQuery)
    )
  },

  // Get clients by type (residential/commercial)
  getClientsByType: (type) => {
    const { clients } = get()
    return clients.filter((client) => client.type === type)
  },

  // Set loading/error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
