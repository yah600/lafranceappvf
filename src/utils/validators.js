// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate phone (Canadian format)
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10
}

// Validate postal code (Canadian)
export const isValidPostalCode = (postal) => {
  const regex = /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i
  return regex.test(postal)
}

// Validate license number (CMMTQ)
export const isValidCMMTQ = (license) => {
  const regex = /^M\d{6}$/
  return regex.test(license)
}

// Validate license number (RBQ)
export const isValidRBQ = (license) => {
  const regex = /^\d{4}-\d{4}-\d{2}$/
  return regex.test(license)
}

// Validate bid amount
export const isValidBid = (amount, minimumBid, clientBudget) => {
  const num = parseFloat(amount)

  if (isNaN(num)) return { valid: false, error: 'Montant invalide' }
  if (num < minimumBid) return { valid: false, error: `Minimum: ${minimumBid}$` }
  if (num > clientBudget) return { valid: false, error: `Maximum: ${clientBudget}$` }

  return { valid: true }
}

// Validate minimum photos based on duration
export const hasMinimumPhotos = (photos, durationMinutes) => {
  const requiredPhotos = Math.max(3, Math.ceil(durationMinutes / 45)) // 1 per 45 min, min 3
  return {
    hasMinimum: photos.length >= requiredPhotos,
    current: photos.length,
    required: requiredPhotos,
  }
}

// Validate work description
export const isValidDescription = (description) => {
  if (!description || description.trim().length < 10) {
    return { valid: false, error: 'Minimum 10 caractères requis' }
  }
  if (description.length > 1000) {
    return { valid: false, error: 'Maximum 1000 caractères' }
  }
  return { valid: true }
}

// Validate password strength
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, error: 'Minimum 8 caractères' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Doit contenir une majuscule' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Doit contenir une minuscule' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Doit contenir un chiffre' }
  }

  return { valid: true }
}

// Validate required field
export const isRequired = (value, fieldName = 'Ce champ') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} est requis` }
  }
  return { valid: true }
}

// Validate number range
export const isInRange = (value, min, max) => {
  const num = parseFloat(value)
  if (isNaN(num)) return { valid: false, error: 'Valeur invalide' }
  if (num < min) return { valid: false, error: `Minimum: ${min}` }
  if (num > max) return { valid: false, error: `Maximum: ${max}` }
  return { valid: true }
}
