import { useNavigate } from 'react-router-dom'
import { Wrench, HardHat, Home, Wind, Package, Droplets, Table2, Building, ArrowRight } from 'lucide-react'
import { APP_NAME } from '@config/constants'
import { DIVISIONS } from '@config/divisions'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  const divisionIcons = {
    plomberie: Wrench,
    construction: HardHat,
    toitures: Home,
    isolation: Wind,
    conteneurs: Package,
    gutters: Droplets,
    decks: Table2,
    'real-estate': Building,
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <h1 className="header-logo">{APP_NAME}</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{APP_NAME}</h1>
          <p className="hero-subtitle">8 Divisions à Votre Service</p>
          <p className="hero-description">
            Services professionnels pour le résidentiel et commercial
          </p>

          <div className="hero-actions">
            <Button
              size="large"
              variant="primary"
              onClick={() => navigate('/login')}
              className="hero-btn-primary"
            >
              Connexion
              <ArrowRight size={20} />
            </Button>

            <div className="hero-buttons-grid">
              <Button
                variant="outline"
                onClick={() => navigate('/signup/client')}
              >
                Nouveau Client
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/signup/technician')}
              >
                Devenir Technicien
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services - 8 Divisions */}
      <section className="services-section">
        <h2 className="section-title">Nos Services</h2>
        <div className="divisions-grid">
          {DIVISIONS.map((division) => {
            const Icon = divisionIcons[division.id]
            return (
              <Card
                key={division.id}
                className="division-card clickable"
                style={{ borderTop: `4px solid ${division.color}` }}
              >
                <Icon size={40} className="division-icon" style={{ color: division.color }} />
                <h3 className="division-name">{division.shortName}</h3>
                <p className="division-contact">{division.contact.name}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Pourquoi Nous Choisir?</h2>
        <div className="features-list">
          <Card className="feature-card">
            <div className="feature-content">
              <div className="feature-icon feature-icon-red">
                <span>🚨</span>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Service d'Urgence 24/7</h3>
                <p className="feature-description">
                  Réponse rapide pour vos urgences. Techniciens disponibles en moins de 30 minutes.
                </p>
              </div>
            </div>
          </Card>

          <Card className="feature-card">
            <div className="feature-content">
              <div className="feature-icon feature-icon-blue">
                <span>⭐</span>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Techniciens Certifiés</h3>
                <p className="feature-description">
                  Tous nos techniciens sont licenciés (RBQ, CMMTQ) et assurés.
                </p>
              </div>
            </div>
          </Card>

          <Card className="feature-card">
            <div className="feature-content">
              <div className="feature-icon feature-icon-green">
                <span>💰</span>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Prix Compétitifs</h3>
                <p className="feature-description">
                  Système d'enchères pour les urgences garantit le meilleur prix.
                </p>
              </div>
            </div>
          </Card>

          <Card className="feature-card">
            <div className="feature-content">
              <div className="feature-icon feature-icon-purple">
                <span>📱</span>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Suivi en Temps Réel</h3>
                <p className="feature-description">
                  Suivez votre technicien en direct avec GPS et photos du travail.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Prêt à Commencer?</h2>
        <Button
          size="large"
          variant="success"
          onClick={() => navigate('/login')}
          className="cta-button"
        >
          Demander un Service
          <ArrowRight size={20} />
        </Button>
        <p className="cta-description">
          Service disponible dans la grande région de Montréal
        </p>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="footer-title">{APP_NAME}</p>
        <p className="footer-tagline">8 Divisions | Service Professionnel | Techniciens Certifiés</p>
        <p className="footer-copyright">© 2026 Groupe G. Lafrance. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default Landing
