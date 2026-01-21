import { format, parseISO, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'

// Currency formatter (Canadian dollars)
export const formatCurrency = (amount, showCents = true) => {
  if (amount === null || amount === undefined) return '-'

  const formatted = new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount)

  return formatted
}

// Format date for display
export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: fr })
}

// Format time only
export const formatTime = (date) => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'HH:mm', { locale: fr })
}

// Format date with relative time
export const formatRelativeDate = (date) => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (isToday(dateObj)) {
    return `Aujourd'hui à ${formatTime(dateObj)}`
  }
  if (isYesterday(dateObj)) {
    return `Hier à ${formatTime(dateObj)}`
  }
  return formatDate(dateObj, 'dd MMM à HH:mm')
}

// Get time ago (e.g., "il y a 5 minutes")
export const getTimeAgo = (date) => {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { locale: fr, addSuffix: true })
}

// Format duration (minutes to "Xh Ym")
export const formatDuration = (minutes) => {
  if (!minutes) return '0m'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// Convert seconds to MM:SS
export const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Format phone number (514-555-1234)
export const formatPhone = (phone) => {
  if (!phone) return '-'
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

// Parse phone to clean format
export const parsePhone = (phone) => {
  return phone.replace(/\D/g, '')
}

// Format distance (km)
export const formatDistance = (km) => {
  if (!km) return '-'
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(1)} km`
}

// Format percentage
export const formatPercent = (value, decimals = 0) => {
  if (value === null || value === undefined) return '-'
  return `${value.toFixed(decimals)}%`
}

// Format address
export const formatAddress = (address) => {
  if (typeof address === 'string') return address
  if (!address) return '-'

  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.province) parts.push(address.province)
  if (address.postalCode) parts.push(address.postalCode)

  return parts.join(', ')
}

// Truncate text
export const truncate = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
