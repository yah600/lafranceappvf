import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      activeDivision: null,

      // Actions
      login: (userData, divisionId = null) => {
        set({
          user: userData,
          isAuthenticated: true,
          activeDivision: divisionId || userData.divisions?.[0] || null,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          activeDivision: null,
        })
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },

      setActiveDivision: (divisionId) => {
        const { user } = get()
        if (user?.divisions?.includes(divisionId) || user?.role === 'super-admin') {
          set({ activeDivision: divisionId })
        }
      },

      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      hasDivisionAccess: (divisionId) => {
        const { user } = get()
        if (user?.role === 'super-admin') return true
        return user?.divisions?.includes(divisionId) || false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeDivision: state.activeDivision,
      }),
    }
  )
)
