import { Card } from 'konsta/react'
import { MapPin, Clock, DollarSign, User, Calendar } from 'lucide-react'
import StatusBadge from '@components/common/StatusBadge'
import { formatAddress, formatCurrency, formatDate, formatTime, formatDuration } from '@utils/formatters'
import { getDivisionColor } from '@config/divisions'

function JobCard({ job, onClick, showTechnician = false, showClient = true }) {
  return (
    <Card
      className="mb-4 cursor-pointer"
      onClick={() => onClick && onClick(job)}
      style={{ borderLeft: `4px solid ${getDivisionColor(job.division)}` }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{job.serviceName}</h3>
          {showClient && job.clientName && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User size={14} />
              <span>{job.clientName}</span>
            </div>
          )}
          {showTechnician && job.technicianName && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User size={14} />
              <span>{job.technicianName}</span>
            </div>
          )}
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Location */}
      {job.address && (
        <div className="flex items-start gap-2 mb-2 text-sm">
          <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">{formatAddress(job.address)}</span>
        </div>
      )}

      {/* Date/Time */}
      <div className="flex flex-wrap gap-3 mb-2 text-sm text-gray-600">
        {job.scheduledDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(job.scheduledDate)}</span>
          </div>
        )}
        {job.scheduledTime && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{job.scheduledTime}</span>
          </div>
        )}
        {job.duration && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Durée: {formatDuration(job.duration)}</span>
          </div>
        )}
      </div>

      {/* Amount */}
      {(job.amount || job.finalAmount) && (
        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <DollarSign size={16} />
          <span>{formatCurrency(job.finalAmount || job.amount)}</span>
        </div>
      )}

      {/* Rating (for completed jobs) */}
      {job.rating && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-yellow-500">{'⭐'.repeat(job.rating)}</span>
          {job.ratingComment && (
            <span className="text-xs text-gray-500 italic">"{job.ratingComment}"</span>
          )}
        </div>
      )}

      {/* Payment info (for completed jobs) */}
      {job.payment && (
        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
          <div className="flex justify-between">
            <span className="text-green-700">✅ Immédiat ({job.payment.immediatePercent}%)</span>
            <span className="font-semibold">{formatCurrency(job.payment.immediate)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-orange-700">⏳ Retenu ({job.payment.holdbackPercent}%)</span>
            <span className="font-semibold">{formatCurrency(job.payment.holdback)}</span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default JobCard
