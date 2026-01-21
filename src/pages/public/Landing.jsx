import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Button, Card } from 'konsta/react'
import { Wrench, HardHat, Home, Wind, Package, Droplets, Table2, Building, ArrowRight } from 'lucide-react'
import { APP_NAME } from '@config/constants'
import { DIVISIONS } from '@config/divisions'

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
    <Page>
      <Navbar title={APP_NAME} />

      {/* Hero Section */}
      <Block className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {APP_NAME}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          8 Divisions à Votre Service
        </p>
        <p className="text-gray-500 mb-8">
          Services professionnels pour le résidentiel et commercial
        </p>

        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <Button
            large
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          >
            Connexion
            <ArrowRight size={20} className="ml-2" />
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              outline
              onClick={() => navigate('/signup/client')}
            >
              Nouveau Client
            </Button>
            <Button
              outline
              onClick={() => navigate('/signup/technician')}
            >
              Devenir Technicien
            </Button>
          </div>
        </div>
      </Block>

      {/* Services - 8 Divisions */}
      <Block>
        <h2 className="text-2xl font-bold mb-4 text-center">Nos Services</h2>
        <div className="grid grid-cols-2 gap-4">
          {DIVISIONS.map((division) => {
            const Icon = divisionIcons[division.id]
            return (
              <Card
                key={division.id}
                className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                style={{ borderTop: `4px solid ${division.color}` }}
              >
                <Icon size={40} className="mx-auto mb-2" style={{ color: division.color }} />
                <h3 className="font-bold text-sm mb-1">{division.shortName}</h3>
                <p className="text-xs text-gray-600">{division.contact.name}</p>
              </Card>
            )
          })}
        </div>
      </Block>

      {/* Features */}
      <Block>
        <h2 className="text-2xl font-bold mb-4 text-center">Pourquoi Nous Choisir?</h2>
        <div className="space-y-4">
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Service d'Urgence 24/7</h3>
                <p className="text-sm text-gray-600">
                  Réponse rapide pour vos urgences. Techniciens disponibles en moins de 30 minutes.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Techniciens Certifiés</h3>
                <p className="text-sm text-gray-600">
                  Tous nos techniciens sont licenciés (RBQ, CMMTQ) et assurés.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Prix Compétitifs</h3>
                <p className="text-sm text-gray-600">
                  Système d'enchères pour les urgences garantit le meilleur prix.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Suivi en Temps Réel</h3>
                <p className="text-sm text-gray-600">
                  Suivez votre technicien en direct avec GPS et photos du travail.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Block>

      {/* CTA */}
      <Block className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Prêt à Commencer?</h2>
        <Button
          large
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white max-w-md mx-auto"
        >
          Demander un Service
          <ArrowRight size={20} className="ml-2" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Service disponible dans la grande région de Montréal
        </p>
      </Block>

      {/* Footer */}
      <Block className="text-center text-sm text-gray-500 border-t py-6">
        <p className="mb-2">{APP_NAME}</p>
        <p>8 Divisions | Service Professionnel | Techniciens Certifiés</p>
        <p className="mt-4">© 2026 Groupe G. Lafrance. Tous droits réservés.</p>
      </Block>
    </Page>
  )
}

export default Landing
