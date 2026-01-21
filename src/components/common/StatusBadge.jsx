import { Badge } from 'konsta/react'
import clsx from 'clsx'

const statusConfig = {
  pending: { label: 'En attente', colors: 'bg-gray-100 text-gray-800' },
  bidding: { label: 'Enchères', colors: 'bg-blue-100 text-blue-800' },
  assigned: { label: 'Assigné', colors: 'bg-indigo-100 text-indigo-800' },
  'en-route': { label: 'En route', colors: 'bg-yellow-100 text-yellow-800' },
  'in-progress': { label: 'En cours', colors: 'bg-green-100 text-green-800' },
  completed: { label: 'Complété', colors: 'bg-green-200 text-green-900' },
  cancelled: { label: 'Annulé', colors: 'bg-red-100 text-red-800' },
  paid: { label: 'Payé', colors: 'bg-green-100 text-green-800' },
  overdue: { label: 'En retard', colors: 'bg-red-100 text-red-800' },
  available: { label: 'Disponible', colors: 'bg-green-100 text-green-800' },
  busy: { label: 'Occupé', colors: 'bg-orange-100 text-orange-800' },
  'off-duty': { label: 'Hors service', colors: 'bg-gray-100 text-gray-800' },
  urgent: { label: 'Urgent', colors: 'bg-red-100 text-red-800' },
  high: { label: 'Haute', colors: 'bg-orange-100 text-orange-800' },
  normal: { label: 'Normale', colors: 'bg-blue-100 text-blue-800' },
  low: { label: 'Basse', colors: 'bg-gray-100 text-gray-800' },
}

function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { label: status, colors: 'bg-gray-100 text-gray-800' }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        config.colors,
        className
      )}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge
