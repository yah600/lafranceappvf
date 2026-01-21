import { useNavigate, useLocation } from 'react-router-dom'
import { Tabbar, TabbarLink } from 'konsta/react'
import { Home, Briefcase, DollarSign, User } from 'lucide-react'

function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname.startsWith(path)

  const tabs = [
    { path: '/tech/dashboard', icon: Home, label: 'Accueil' },
    { path: '/tech/jobs', icon: Briefcase, label: 'Travaux' },
    { path: '/tech/earnings', icon: DollarSign, label: 'Revenus' },
    { path: '/tech/profile', icon: User, label: 'Profil' },
  ]

  return (
    <Tabbar
      className="left-0 bottom-0 fixed"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(tab.path)

        return (
          <TabbarLink
            key={tab.path}
            active={active}
            onClick={() => navigate(tab.path)}
            label={tab.label}
            icon={
              <Icon
                size={24}
                className={active ? 'text-primary' : 'text-gray-400'}
              />
            }
          />
        )
      })}
    </Tabbar>
  )
}

export default MobileBottomNav
