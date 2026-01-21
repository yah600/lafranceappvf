import './StatCard.css'

function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendLabel = 'vs last month',
  gradient = 'blue',
  onClick,
  className = ''
}) {
  const gradientClass = `stat-card-gradient-${gradient}`
  const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral'

  return (
    <div
      className={`stat-card ${gradientClass} ${onClick ? 'stat-card-clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card-content">
        {/* Title & Value */}
        <div className="stat-card-main">
          <h3 className="stat-card-title">{title}</h3>
          <div className="stat-card-value">{value}</div>
        </div>

        {/* Icon */}
        {icon && (
          <div className="stat-card-icon">
            <span>{icon}</span>
          </div>
        )}
      </div>

      {/* Trend Indicator */}
      {(trend || trendValue) && (
        <div className="stat-card-footer">
          <div className={`stat-card-trend ${trendClass}`}>
            {trend === 'up' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {trend === 'down' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 4V12M8 12L12 8M8 12L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {trendValue && <span className="trend-value">{trendValue}</span>}
          </div>
          <span className="trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
