import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import './AppLayout.css'

function AppLayout({
  children,
  title,
  subtitle,
  showHeader = true,
  showMobileNav = false,
  showSidebar = true,
  breadcrumbs = [],
  pageTitle,
  pageDescription
}) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}

      {/* Main Content */}
      <div className={`app-content ${showSidebar ? 'with-sidebar' : ''}`}>
        {/* Header/Navbar */}
        {showHeader && (
          <div className="app-navbar">
            <div className="navbar-content">
              {/* Mobile Menu Button */}
              {showSidebar && (
                <button
                  className="navbar-menu-btn"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </button>
              )}

              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="breadcrumb-item">
                      {index > 0 && <span className="breadcrumb-separator">/</span>}
                      <span className={index === breadcrumbs.length - 1 ? 'breadcrumb-current' : ''}>
                        {crumb}
                      </span>
                    </span>
                  ))}
                </nav>
              )}

              {/* Page Title in Navbar (optional) */}
              {!pageTitle && title && (
                <div className="navbar-title-section">
                  <h1 className="navbar-title">{title}</h1>
                  {subtitle && <p className="navbar-subtitle">{subtitle}</p>}
                </div>
              )}

              {/* Navbar Actions */}
              <div className="navbar-actions">
                <button className="navbar-icon-btn" aria-label="Notifications">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span className="notification-dot"></span>
                </button>
                <button className="navbar-icon-btn" aria-label="Settings">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="10" r="3" />
                    <path d="M10 1v2m0 14v2M3.93 3.93l1.41 1.41m11.32 11.32l1.41 1.41M1 10h2m14 0h2M3.93 16.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Header Section */}
        {pageTitle && (
          <div className="page-header">
            <div className="page-header-content">
              <div>
                <h1 className="page-title">{pageTitle}</h1>
                {pageDescription && <p className="page-description">{pageDescription}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="app-main">
          <div className="app-main-content">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      {showMobileNav && <MobileBottomNav />}
    </div>
  )
}

export default AppLayout
