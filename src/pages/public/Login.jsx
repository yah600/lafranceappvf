import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, Navbar, List, ListInput, Block, Button } from 'konsta/react'
import { useAuthStore } from '@stores/authStore'
import { getMockUserByEmail } from '@data/mockUsers'
import { APP_NAME } from '@config/constants'

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user in mock data
    const user = getMockUserByEmail(email)

    if (!user) {
      setError('Email non trouvé')
      setLoading(false)
      return
    }

    if (user.password !== password) {
      setError('Mot de passe incorrect')
      setLoading(false)
      return
    }

    // Login successful
    login(user)
    setLoading(false)

    // Navigate based on role
    const roleRoutes = {
      'super-admin': '/admin/overview',
      'division-head': '/division/dashboard',
      'dispatcher': '/dispatch/dashboard',
      'technician': '/tech/dashboard',
      'client': '/client/dashboard',
    }

    navigate(roleRoutes[user.role] || '/')
  }

  const quickLogin = (email) => {
    const user = getMockUserByEmail(email)
    if (user) {
      setEmail(email)
      setPassword(user.password)
    }
  }

  return (
    <Page>
      <Navbar title={APP_NAME} />

      <Block className="text-center mt-8 mb-4">
        <h1 className="text-3xl font-bold mb-2">Connexion</h1>
        <p className="text-gray-600">Accédez à votre compte</p>
      </Block>

      <form onSubmit={handleLogin}>
        <List strong inset>
          <ListInput
            label="Email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <ListInput
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </List>

        {error && (
          <Block className="text-red-500 text-center mt-2">
            {error}
          </Block>
        )}

        <Block>
          <Button
            large
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Block>
      </form>

      <Block className="mt-8">
        <p className="text-center text-sm text-gray-600 mb-4">Connexion rapide (demo):</p>

        <div className="space-y-2">
          <Button
            outline
            className="w-full"
            onClick={() => quickLogin('gabriel@lafrance.com')}
          >
            Admin: gabriel@lafrance.com
          </Button>

          <Button
            outline
            className="w-full"
            onClick={() => quickLogin('michael@lafrance.com')}
          >
            Division Head: michael@lafrance.com
          </Button>

          <Button
            outline
            className="w-full"
            onClick={() => quickLogin('dispatcher@lafrance.com')}
          >
            Dispatcher: dispatcher@lafrance.com
          </Button>

          <Button
            outline
            className="w-full"
            onClick={() => quickLogin('marc@lafrance.com')}
          >
            Technician: marc@lafrance.com
          </Button>

          <Button
            outline
            className="w-full"
            onClick={() => quickLogin('jean.bertrand@example.com')}
          >
            Client: jean.bertrand@example.com
          </Button>
        </div>
      </Block>

      <Block className="text-center text-xs text-gray-500 mt-8">
        Mot de passe pour tous les comptes demo:<br />
        Admin: admin123 | Division: plomb123/toit123<br />
        Dispatcher: dispatch123 | Tech: tech123 | Client: client123
      </Block>
    </Page>
  )
}

export default Login
