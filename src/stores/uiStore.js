import { create } from 'zustand'

export const useUIStore = create((set) => ({
  // Modal state
  activeModal: null,
  modalData: null,

  // Drawer state
  isDrawerOpen: false,
  drawerContent: null,

  // Loading states
  globalLoading: false,

  // Toast/Snackbar
  toast: null,

  // Actions - Modal
  openModal: (modalName, data = null) =>
    set({ activeModal: modalName, modalData: data }),

  closeModal: () =>
    set({ activeModal: null, modalData: null }),

  // Actions - Drawer
  openDrawer: (content) =>
    set({ isDrawerOpen: true, drawerContent: content }),

  closeDrawer: () =>
    set({ isDrawerOpen: false, drawerContent: null }),

  // Actions - Loading
  setGlobalLoading: (loading) =>
    set({ globalLoading: loading }),

  // Actions - Toast
  showToast: (message, type = 'info', duration = 3000) => {
    set({
      toast: {
        message,
        type, // 'success', 'error', 'warning', 'info'
        timestamp: Date.now(),
      },
    })

    // Auto-hide after duration
    setTimeout(() => {
      set({ toast: null })
    }, duration)
  },

  hideToast: () => set({ toast: null }),
}))
