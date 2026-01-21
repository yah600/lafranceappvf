import { useEffect } from 'react'
import { useBiddingStore } from '@stores/biddingStore'
import { formatCountdown } from '@utils/formatters'
import { Clock } from 'lucide-react'
import clsx from 'clsx'

function CountdownTimer({ jobId, onExpire }) {
  const decrementTimer = useBiddingStore((state) => state.decrementTimer)
  const timeRemaining = useBiddingStore((state) => state.getTimeRemaining(jobId))

  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer(jobId)

      if (timeRemaining <= 0) {
        clearInterval(interval)
        if (onExpire) onExpire()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [jobId, timeRemaining, decrementTimer, onExpire])

  const minutes = Math.floor(timeRemaining / 60)
  const isUrgent = timeRemaining < 60

  return (
    <div
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-lg font-semibold',
        isUrgent ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
      )}
    >
      <Clock size={20} className={isUrgent ? 'animate-pulse' : ''} />
      <span className="text-lg">{formatCountdown(timeRemaining)}</span>
      <span className="text-xs font-normal">restant</span>
    </div>
  )
}

export default CountdownTimer
