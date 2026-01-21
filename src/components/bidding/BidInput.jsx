import { useState } from 'react'
import { Button } from 'konsta/react'
import { useBiddingStore } from '@stores/biddingStore'
import { calculateSuggestedBid } from '@utils/calculators'
import { isValidBid } from '@utils/validators'
import { formatCurrency } from '@utils/formatters'
import { TrendingDown } from 'lucide-react'

function BidInput({ job, onSubmit }) {
  const myBid = useBiddingStore((state) => state.getMyBid(job.id))
  const lowestBid = useBiddingStore((state) => state.getLowestBid(job.id))

  const [bidAmount, setBidAmount] = useState('')
  const [error, setError] = useState('')

  const suggestedBid = calculateSuggestedBid(job)

  const handleSubmit = () => {
    setError('')

    const validation = isValidBid(bidAmount, job.minimumBid, job.clientBudget)

    if (!validation.valid) {
      setError(validation.error)
      return
    }

    const amount = parseFloat(bidAmount)

    // Check if lower than current lowest
    if (lowestBid && amount >= lowestBid) {
      setError(`Votre enchère doit être < ${formatCurrency(lowestBid, false)}`)
      return
    }

    onSubmit(job.id, amount)
    setBidAmount('')
  }

  const handleUseSuggested = () => {
    setBidAmount(suggestedBid.toString())
    setError('')
  }

  return (
    <div className="space-y-3">
      {/* Budget info */}
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-gray-600">Minimum:</span>
          <span className="ml-2 font-semibold">{formatCurrency(job.minimumBid, false)}</span>
        </div>
        <div>
          <span className="text-gray-600">Budget:</span>
          <span className="ml-2 font-semibold">{formatCurrency(job.clientBudget, false)}</span>
        </div>
      </div>

      {/* Current lowest bid */}
      {lowestBid && (
        <div className="p-2 bg-blue-50 rounded-lg text-sm">
          <span className="text-blue-700">Enchère la plus basse: </span>
          <span className="font-bold text-blue-900">{formatCurrency(lowestBid, false)}</span>
        </div>
      )}

      {/* My current bid */}
      {myBid && (
        <div className="p-2 bg-green-50 rounded-lg text-sm">
          <span className="text-green-700">Votre enchère actuelle: </span>
          <span className="font-bold text-green-900">{formatCurrency(myBid, false)}</span>
        </div>
      )}

      {/* Bid input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => {
            setBidAmount(e.target.value)
            setError('')
          }}
          placeholder={`Min: ${job.minimumBid}$`}
          className="flex-1 p-3 border border-gray-300 rounded-lg text-lg font-semibold"
          min={job.minimumBid}
          max={job.clientBudget}
        />
        <Button large onClick={handleSubmit} className="px-6">
          Enchérir
        </Button>
      </div>

      {/* Suggested bid */}
      <button
        onClick={handleUseSuggested}
        className="flex items-center gap-2 text-sm text-primary font-medium"
      >
        <TrendingDown size={16} />
        Utiliser suggéré: {formatCurrency(suggestedBid, false)}
      </button>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm font-medium">{error}</div>
      )}
    </div>
  )
}

export default BidInput
