import { create } from 'zustand'

export const useNotificationsStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  // Add notification
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          read: false,
          timestamp: new Date().toISOString(),
          ...notification,
        },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  // Mark notification as read
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  // Mark all as read
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
      unreadCount: 0,
    })),

  // Delete notification
  deleteNotification: (notificationId) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === notificationId)
      const wasUnread = notification && !notification.read

      return {
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }
    }),

  // Clear all notifications
  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  // Get unread notifications
  getUnreadNotifications: () => {
    const { notifications } = get()
    return notifications.filter((notif) => !notif.read)
  },

  // Get notifications by type
  getNotificationsByType: (type) => {
    const { notifications } = get()
    return notifications.filter((notif) => notif.type === type)
  },
}))
