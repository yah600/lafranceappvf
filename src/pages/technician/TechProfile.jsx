import { useNavigate } from 'react-router-dom'
import { Star, Award, Settings, LogOut, Phone, Mail, MapPin, Bell, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import { formatPhone } from '@utils/formatters'
import './TechProfile.css'

function TechProfile() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    if (confirm('Se déconnecter?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <AppLayout title="Mon Profil" showHeader={true} showMobileNav={true}>
      {/* Profile Header */}
      <Section>
        <Card className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0)}
          </div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">
                <Star size={20} fill="currentColor" className="star-icon" />
                <span>{user?.rating || 0}</span>
              </div>
              <div className="profile-stat-label">Note</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value profile-stat-success">
                {user?.completedJobs || 0}
              </div>
              <div className="profile-stat-label">Jobs complétés</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value profile-stat-primary">95%</div>
              <div className="profile-stat-label">Acceptation</div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Contact Info */}
      <Section title="Coordonnées">
        <Card>
          <div className="info-list">
            <div className="info-item">
              <div className="info-icon-wrapper">
                <Phone size={24} className="info-icon" />
              </div>
              <div className="info-content">
                <div className="info-label">Téléphone</div>
                <div className="info-value">{formatPhone(user?.phone || '')}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-wrapper">
                <Mail size={24} className="info-icon" />
              </div>
              <div className="info-content">
                <div className="info-label">Email</div>
                <div className="info-value">{user?.email}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-wrapper">
                <MapPin size={24} className="info-icon" />
              </div>
              <div className="info-content">
                <div className="info-label">Rayon de service</div>
                <div className="info-value">50 km</div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Licenses */}
      <Section title="Licences & Attestations">
        <Card>
          <div className="license-list">
            {user?.licenses && Object.entries(user.licenses).map(([type, number]) => (
              <div key={type} className="license-item">
                <div className="license-icon-wrapper">
                  <Award size={24} className="license-icon" />
                </div>
                <div className="license-content">
                  <div className="license-type">{type}</div>
                  <div className="license-status">
                    {number === 'Valid' ? '✓ Valide' : number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* Divisions */}
      <Section title="Divisions">
        <Card>
          <div className="divisions-list">
            {user?.divisions?.map((division) => (
              <span key={division} className="division-badge">
                {division.charAt(0).toUpperCase() + division.slice(1)}
              </span>
            ))}
          </div>
        </Card>
      </Section>

      {/* Settings */}
      <Section title="Paramètres">
        <Card>
          <div className="settings-list">
            <button className="settings-item" type="button">
              <div className="settings-icon-wrapper">
                <Settings size={24} className="settings-icon" />
              </div>
              <div className="settings-content">
                <span className="settings-label">Préférences</span>
              </div>
              <span className="settings-chevron">›</span>
            </button>
            <button className="settings-item" type="button">
              <div className="settings-icon-wrapper">
                <Bell size={24} className="settings-icon" />
              </div>
              <div className="settings-content">
                <span className="settings-label">Notifications</span>
                <span className="settings-value">Actif</span>
              </div>
              <span className="settings-chevron">›</span>
            </button>
            <button className="settings-item" type="button">
              <div className="settings-icon-wrapper">
                <CheckCircle size={24} className="settings-icon" />
              </div>
              <div className="settings-content">
                <span className="settings-label">Disponibilité</span>
                <span className="settings-value">Disponible</span>
              </div>
              <span className="settings-chevron">›</span>
            </button>
            <button className="settings-item" type="button">
              <div className="settings-icon-wrapper">
                <Settings size={24} className="settings-icon" />
              </div>
              <div className="settings-content">
                <span className="settings-label">Accepter urgences</span>
                <span className="settings-value">Oui</span>
              </div>
              <span className="settings-chevron">›</span>
            </button>
          </div>
        </Card>
      </Section>

      {/* Performance */}
      <Section title="Performance">
        <Card>
          <div className="performance-list">
            <div className="performance-row">
              <span className="performance-label">Taux d'acceptation:</span>
              <span className="performance-value performance-success">95%</span>
            </div>
            <div className="performance-row">
              <span className="performance-label">Taux d'annulation:</span>
              <span className="performance-value performance-success">2%</span>
            </div>
            <div className="performance-row">
              <span className="performance-label">Temps de réponse moyen:</span>
              <span className="performance-value">4 min</span>
            </div>
            <div className="performance-row">
              <span className="performance-label">Note moyenne:</span>
              <span className="performance-value performance-warning">
                {user?.rating || 0} ⭐
              </span>
            </div>
          </div>
        </Card>
      </Section>

      {/* Logout */}
      <Section>
        <Button
          size="large"
          variant="danger"
          onClick={handleLogout}
          fullWidth={true}
          icon={<LogOut size={20} />}
        >
          Se déconnecter
        </Button>
      </Section>
    </AppLayout>
  )
}

export default TechProfile
