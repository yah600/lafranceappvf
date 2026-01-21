import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Menu, Bell } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import './Header.css'

function Header({ title, subtitle, showBack = false, onBackClick, showNotifications = false }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const handleBack = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="app-header">
      <div className="header-content">
        {showBack && (
          <button className="header-back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
        )}

        <div className="header-title-section">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>

        <div className="header-actions">
          {showNotifications && (
            <button className="header-icon-btn">
              <Bell size={22} />
              <span className="notification-badge">3</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
