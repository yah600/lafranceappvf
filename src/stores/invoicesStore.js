import { create } from 'zustand'

export const useInvoicesStore = create((set, get) => ({
  invoices: [],
  loading: false,
  error: null,

  // Set all invoices
  setInvoices: (invoices) => set({ invoices }),

  // Add invoice
  addInvoice: (invoice) =>
    set((state) => ({
      invoices: [invoice, ...state.invoices],
    })),

  // Update invoice
  updateInvoice: (invoiceId, updates) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, ...updates } : inv
      ),
    })),

  // Delete invoice
  deleteInvoice: (invoiceId) =>
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
    })),

  // Get invoice by ID
  getInvoiceById: (invoiceId) => {
    const { invoices } = get()
    return invoices.find((inv) => inv.id === invoiceId)
  },

  // Get invoices by client
  getInvoicesByClient: (clientId) => {
    const { invoices } = get()
    return invoices.filter((inv) => inv.clientId === clientId)
  },

  // Get invoices by job
  getInvoicesByJob: (jobId) => {
    const { invoices } = get()
    return invoices.filter((inv) => inv.jobId === jobId)
  },

  // Get invoices by status
  getInvoicesByStatus: (status) => {
    const { invoices } = get()
    return invoices.filter((inv) => inv.status === status)
  },

  // Get invoices by division
  getInvoicesByDivision: (divisionId) => {
    const { invoices } = get()
    return invoices.filter((inv) => inv.division === divisionId)
  },

  // Get overdue invoices
  getOverdueInvoices: () => {
    const { invoices } = get()
    const today = new Date()
    return invoices.filter((inv) => {
      if (inv.status === 'paid') return false
      const dueDate = new Date(inv.dueDate)
      return dueDate < today
    })
  },

  // Calculate total revenue
  getTotalRevenue: (divisionId = null) => {
    const { invoices } = get()
    const relevantInvoices = divisionId
      ? invoices.filter((inv) => inv.division === divisionId && inv.status === 'paid')
      : invoices.filter((inv) => inv.status === 'paid')

    return relevantInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
  },

  // Set loading/error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
