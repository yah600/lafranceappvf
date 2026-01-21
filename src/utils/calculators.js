import { GST_RATE, QST_RATE, PAYMENT_SPLIT_IMMEDIATE, PAYMENT_SPLIT_HOLDBACK } from '@config/constants'

// Calculate taxes (Quebec)
export const calculateTaxes = (subtotal) => {
  const gst = subtotal * GST_RATE
  const qst = subtotal * QST_RATE
  const total = subtotal + gst + qst

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    gst: parseFloat(gst.toFixed(2)),
    qst: parseFloat(qst.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  }
}

// Calculate payment split (75% immediate, 25% holdback)
export const calculatePaymentSplit = (totalAmount, immediatePercent = PAYMENT_SPLIT_IMMEDIATE, holdbackPercent = PAYMENT_SPLIT_HOLDBACK) => {
  const immediate = (totalAmount * immediatePercent) / 100
  const holdback = (totalAmount * holdbackPercent) / 100

  return {
    total: totalAmount,
    immediate: parseFloat(immediate.toFixed(2)),
    holdback: parseFloat(holdback.toFixed(2)),
    immediatePercent,
    holdbackPercent,
  }
}

// Calculate suggested bid (10% below current lowest or 75% of budget)
export const calculateSuggestedBid = (job) => {
  if (job.bids && job.bids.length > 0) {
    const lowestBid = Math.min(...job.bids.map(b => b.amount))
    return Math.max(lowestBid - 10, job.minimumBid)
  }

  // No bids yet, suggest 75% of client budget
  return Math.floor(job.clientBudget * 0.75)
}

// Calculate profit margin
export const calculateProfitMargin = (revenue, cost) => {
  if (revenue === 0) return 0
  return ((revenue - cost) / revenue) * 100
}

// Calculate company profit from bid
export const calculateCompanyProfit = (clientBudget, winningBid) => {
  const profit = clientBudget - winningBid
  const margin = (profit / clientBudget) * 100

  return {
    profit: parseFloat(profit.toFixed(2)),
    margin: parseFloat(margin.toFixed(2)),
  }
}

// Calculate ETA based on distance and speed
export const calculateETA = (distanceKm, averageSpeedKmh = 40) => {
  const hours = distanceKm / averageSpeedKmh
  const minutes = Math.ceil(hours * 60)

  const now = new Date()
  const eta = new Date(now.getTime() + minutes * 60000)

  return {
    minutes,
    eta: eta.toISOString(),
    etaFormatted: eta.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
  }
}

// Calculate distance between coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return parseFloat(distance.toFixed(2))
}

const toRad = (degrees) => degrees * (Math.PI / 180)

// Calculate on-site quote with materials + labor
export const calculateOnSiteQuote = (materials, laborHours, laborRate = 100) => {
  const materialsCost = materials.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice)
  }, 0)

  const laborCost = laborHours * laborRate
  const subtotal = materialsCost + laborCost
  const taxes = calculateTaxes(subtotal)

  return {
    materials: parseFloat(materialsCost.toFixed(2)),
    labor: parseFloat(laborCost.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    ...taxes,
  }
}

// Calculate technician earnings
export const calculateEarningsBreakdown = (jobs, technicianId, holdbackDays = 7) => {
  const techJobs = jobs.filter(j => j.technicianId === technicianId && j.status === 'completed')

  let available = 0
  let pending = 0

  techJobs.forEach(job => {
    if (!job.payment) return

    // Check if holdback period expired
    const releaseDate = new Date(job.endTime)
    releaseDate.setDate(releaseDate.getDate() + holdbackDays)

    if (new Date() >= releaseDate) {
      // Holdback released
      available += job.payment.immediate + job.payment.holdback
    } else {
      // Immediate available, holdback pending
      available += job.payment.immediate
      pending += job.payment.holdback
    }
  })

  return {
    available: parseFloat(available.toFixed(2)),
    pending: parseFloat(pending.toFixed(2)),
    total: parseFloat((available + pending).toFixed(2)),
  }
}

// Calculate job duration
export const calculateJobDuration = (startTime, endTime = new Date()) => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime

  const diffMs = end - start
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)

  return {
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    formatted: `${diffHours}h ${diffMinutes % 60}m`,
  }
}

// Calculate minimum bid based on company profit margin
export const calculateMinimumBid = (clientBudget, minimumProfitPercent = 40) => {
  // Company must make at least minimumProfitPercent profit
  // If client budget is $600 and company needs 40%, minimum bid is $360
  return Math.floor((clientBudget * (100 - minimumProfitPercent)) / 100)
}
