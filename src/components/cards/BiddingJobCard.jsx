import { Card } from 'konsta/react'
import { MapPin, DollarSign, Users } from 'lucide-react'
import CountdownTimer from '@components/bidding/CountdownTimer'
import BidInput from '@components/bidding/BidInput'
import { formatAddress, formatCurrency } from '@utils/formatters'
import { getDivisionColor } from '@config/divisions'

function BiddingJobCard({ job, onBid, onPass }) {
  const handleBidSubmit = (jobId, amount) => {
    if (onBid) onBid(jobId, amount)
  }

  const handlePass = () => {
    if (onPass) onPass(job.id)
  }

  return (
    <Card
      className="mb-4"
      style={{ borderLeft: `4px solid ${getDivisionColor(job.division)}` }}
    >
      {/* Header with countdown */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{job.serviceName}</h3>
          <p className="text-sm text-gray-600">{job.clientName}</p>
        </div>
        <CountdownTimer jobId={job.id} />
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-2 text-sm">
        <MapPin size={16} className="text-gray-400 mt-0.5" />
        <span className="text-gray-700">{formatAddress(job.address)}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">{job.description}</p>

      {/* Current bids */}
      {job.bids && job.bids.length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1 text-xs font-medium text-gray-600">
            <Users size={14} />
            <span>Enchères actuelles ({job.bids.length})</span>
          </div>
          <div className="space-y-1">
            {job.bids.slice(0, 3).map((bid, index) => (
              <div key={bid.technicianId} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {index === 0 && '🥇 '}
                  {index === 1 && '🥈 '}
                  {index === 2 && '🥉 '}
                  {bid.technicianName}
                </span>
                <span className="font-semibold">{formatCurrency(bid.amount, false)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bid input */}
      <BidInput job={job} onSubmit={handleBidSubmit} />

      {/* Pass button */}
      <button
        onClick={handlePass}
        className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
      >
        Passer cette opportunité
      </button>
    </Card>
  )
}

export default BiddingJobCard
