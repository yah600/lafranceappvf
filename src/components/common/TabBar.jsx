import './TabBar.css'

function TabBar({ children, className = '' }) {
  return (
    <div className={`tab-bar ${className}`}>
      {children}
    </div>
  )
}

function Tab({ active, onClick, icon, label, badge, children }) {
  return (
    <button
      className={`tab ${active ? 'tab-active' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="tab-content">
        {icon && <span className="tab-icon">{icon}</span>}
        {label && <span className="tab-label">{label}</span>}
        {badge && <span className="tab-badge">{badge}</span>}
        {children}
      </div>
    </button>
  )
}

TabBar.Tab = Tab

export default TabBar
