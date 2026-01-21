import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Briefcase, DollarSign, User } from 'lucide-react'
import './MobileBottomNav.css'

function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/tech/dashboard', icon: Home, label: 'Accueil' },
    { path: '/tech/jobs', icon: Briefcase, label: 'Travaux' },
    { path: '/tech/earnings', icon: DollarSign, label: 'Revenus' },
    { path: '/tech/profile', icon: User, label: 'Profil' },
  ]

  return (
    <nav className="mobile-bottom-nav">
      <div className="bottom-nav-content">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path

          return (
            <button
              key={tab.path}
              className={`nav-tab ${isActive ? 'nav-tab-active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              <Icon size={24} className="nav-icon" />
              <span className="nav-label">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
