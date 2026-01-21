import { useLocation } from 'react-router-dom'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import './AppLayout.css'

function AppLayout({ children, title, subtitle, showHeader = true, showMobileNav = false }) {
  const location = useLocation()

  return (
    <div className="app-layout">
      {showHeader && <Header title={title} subtitle={subtitle} />}

      <main className="app-main">
        {children}
      </main>

      {showMobileNav && <MobileBottomNav />}
    </div>
  )
}

export default AppLayout
