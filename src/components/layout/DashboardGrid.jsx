import './DashboardGrid.css'

function DashboardGrid({
  children,
  columns = 4,
  gap = 'default',
  className = ''
}) {
  const columnClass = `grid-cols-${columns}`
  const gapClass = gap !== 'default' ? `grid-gap-${gap}` : ''

  return (
    <div className={`dashboard-grid ${columnClass} ${gapClass} ${className}`}>
      {children}
    </div>
  )
}

export default DashboardGrid
