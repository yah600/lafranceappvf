import { useNavigate } from 'react-router-dom'
import { Page, Navbar, Block, Card, List, ListItem, Button } from 'konsta/react'
import { Star, Award, Settings, LogOut, Phone, Mail, MapPin } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import MobileBottomNav from '@components/layout/MobileBottomNav'
import { formatPhone } from '@utils/formatters'

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
    <Page>
      <Navbar title="Mon Profil" />

      <div className="pb-20">
        {/* Profile Header */}
        <Block>
          <Card className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                  <Star size={20} fill="currentColor" />
                  <span className="font-bold text-xl">{user?.rating || 0}</span>
                </div>
                <div className="text-xs text-gray-600">Note</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {user?.completedJobs || 0}
                </div>
                <div className="text-xs text-gray-600">Jobs complétés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-xs text-gray-600">Acceptation</div>
              </div>
            </div>
          </Card>
        </Block>

        {/* Contact Info */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Coordonnées</h2>
          <List strong inset>
            <ListItem
              title="Téléphone"
              after={formatPhone(user?.phone || '')}
              media={<Phone size={24} className="text-blue-600" />}
            />
            <ListItem
              title="Email"
              after={user?.email}
              media={<Mail size={24} className="text-blue-600" />}
            />
            <ListItem
              title="Rayon de service"
              after="50 km"
              media={<MapPin size={24} className="text-blue-600" />}
            />
          </List>
        </Block>

        {/* Licenses */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Licences & Attestations</h2>
          <List strong inset>
            {user?.licenses && Object.entries(user.licenses).map(([type, number]) => (
              <ListItem
                key={type}
                title={type}
                after={
                  <span className="text-green-600 text-sm font-semibold">
                    {number === 'Valid' ? '✓ Valide' : number}
                  </span>
                }
                media={<Award size={24} className="text-green-600" />}
              />
            ))}
          </List>
        </Block>

        {/* Divisions */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Divisions</h2>
          <Card>
            <div className="flex flex-wrap gap-2">
              {user?.divisions?.map((division) => (
                <span
                  key={division}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {division.charAt(0).toUpperCase() + division.slice(1)}
                </span>
              ))}
            </div>
          </Card>
        </Block>

        {/* Settings */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Paramètres</h2>
          <List strong inset>
            <ListItem
              link
              chevron
              title="Préférences"
              media={<Settings size={24} className="text-gray-600" />}
            />
            <ListItem
              link
              chevron
              title="Notifications"
              after={
                <span className="text-green-600 text-sm">Actif</span>
              }
            />
            <ListItem
              link
              chevron
              title="Disponibilité"
              after={
                <span className="text-green-600 text-sm">Disponible</span>
              }
            />
            <ListItem
              link
              chevron
              title="Accepter urgences"
              after={
                <span className="text-green-600 text-sm">Oui</span>
              }
            />
          </List>
        </Block>

        {/* Performance */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Performance</h2>
          <Card>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'acceptation:</span>
                <span className="font-semibold text-green-600">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'annulation:</span>
                <span className="font-semibold text-green-600">2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temps de réponse moyen:</span>
                <span className="font-semibold">4 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Note moyenne:</span>
                <span className="font-semibold text-yellow-600">
                  {user?.rating || 0} ⭐
                </span>
              </div>
            </div>
          </Card>
        </Block>

        {/* Logout */}
        <Block>
          <Button
            large
            onClick={handleLogout}
            className="w-full bg-red-500 text-white"
          >
            <LogOut size={20} className="mr-2" />
            Se déconnecter
          </Button>
        </Block>
      </div>

      <MobileBottomNav />
    </Page>
  )
}

export default TechProfile
