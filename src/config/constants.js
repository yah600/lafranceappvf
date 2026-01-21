// Payment configuration
export const PAYMENT_SPLIT_IMMEDIATE = parseInt(import.meta.env.VITE_PAYMENT_SPLIT_IMMEDIATE) || 75
export const PAYMENT_SPLIT_HOLDBACK = parseInt(import.meta.env.VITE_PAYMENT_SPLIT_HOLDBACK) || 25
export const HOLDBACK_DAYS_DEFAULT = parseInt(import.meta.env.VITE_HOLDBACK_DAYS_DEFAULT) || 7

// Bidding configuration
export const URGENT_BIDDING_DURATION_MINUTES = parseInt(import.meta.env.VITE_URGENT_BIDDING_DURATION_MINUTES) || 5

// Photo configuration
export const PHOTO_INTERVAL_MINUTES = parseInt(import.meta.env.VITE_PHOTO_INTERVAL_MINUTES) || 45
export const MINIMUM_PHOTOS_PER_JOB = 3

// Job status constants
export const JOB_STATUS = {
  PENDING: 'pending',
  BIDDING: 'bidding',
  ASSIGNED: 'assigned',
  EN_ROUTE: 'en-route',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Job types
export const JOB_TYPES = {
  URGENT: 'urgent',
  SCHEDULED: 'scheduled',
}

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super-admin',
  DIVISION_HEAD: 'division-head',
  DISPATCHER: 'dispatcher',
  TECHNICIAN: 'technician',
  CLIENT: 'client',
}

// Invoice status
export const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  DISPUTED: 'disputed',
  CANCELLED: 'cancelled',
}

// Geofence settings
export const GEOFENCE_RADIUS_METERS = 100
export const GEOFENCE_DURATION_MINUTES = 3

// Tax rates (Quebec)
export const GST_RATE = 0.05 // 5%
export const QST_RATE = 0.09975 // 9.975%

// App info
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Groupe G. Lafrance'
export const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE || '1-800-XXX-XXXX'
