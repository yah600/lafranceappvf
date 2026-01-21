import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { path: '/dispatch-dashboard', icon: '📊', label: 'Dashboard', exact: true },
        { path: '/dispatch', icon: '📋', label: 'Dispatch' },
        { path: '/calendar', icon: '📅', label: 'Calendar' },
        { path: '/jobs', icon: '💼', label: 'Jobs' },
      ]
    },
    {
      section: 'Management',
      items: [
        { path: '/employees', icon: '👥', label: 'Employees' },
        { path: '/clients', icon: '🏢', label: 'Clients' },
        { path: '/equipment', icon: '🚛', label: 'Equipment' },
        { path: '/inventory', icon: '📦', label: 'Inventory' },
      ]
    },
    {
      section: 'Operations',
      items: [
        { path: '/bids', icon: '💰', label: 'Bids & Quotes' },
        { path: '/invoices', icon: '🧾', label: 'Invoices' },
        { path: '/payroll', icon: '💵', label: 'Payroll' },
        { path: '/reports', icon: '📈', label: 'Reports' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { path: '/settings', icon: '⚙️', label: 'Settings' },
        { path: '/profile', icon: '👤', label: 'Profile' },
      ]
    }
  ]

  const handleNavClick = () => {
    // Close sidebar on mobile when nav item is clicked
    if (window.innerWidth <= 768) {
      onClose?.()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <span>L</span>
            </div>
            <div className="logo-text">
              <h3>Lafrance</h3>
              <p>Dispatch Platform</p>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((section) => (
            <div key={section.section} className="nav-section">
              <h4 className="nav-section-title">{section.section}</h4>
              <ul className="nav-list">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                      }
                      onClick={handleNavClick}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                      {location.pathname === item.path && (
                        <span className="nav-indicator" />
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <span>JD</span>
            </div>
            <div className="user-info">
              <h4 className="user-name">John Doe</h4>
              <p className="user-role">Administrator</p>
            </div>
            <button className="user-menu-btn" aria-label="User menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="1" />
                <circle cx="10" cy="4" r="1" />
                <circle cx="10" cy="16" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
