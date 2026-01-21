import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import { getMockUserByEmail } from '@data/mockUsers'
import { APP_NAME } from '@config/constants'
import './Login.css'

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
    <div className="login-page">
      <div className="login-header">
        <h1 className="login-app-name">{APP_NAME}</h1>
      </div>

      <div className="login-container">
        <div className="login-intro">
          <h2 className="login-title">Connexion</h2>
          <p className="login-subtitle">Accédez à votre compte</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="quick-login">
          <p className="quick-login-title">Connexion rapide (demo):</p>

          <div className="quick-login-buttons">
            <button
              className="quick-login-button"
              onClick={() => quickLogin('gabriel@lafrance.com')}
            >
              Admin: gabriel@lafrance.com
            </button>

            <button
              className="quick-login-button"
              onClick={() => quickLogin('michael@lafrance.com')}
            >
              Division Head: michael@lafrance.com
            </button>

            <button
              className="quick-login-button"
              onClick={() => quickLogin('dispatcher@lafrance.com')}
            >
              Dispatcher: dispatcher@lafrance.com
            </button>

            <button
              className="quick-login-button"
              onClick={() => quickLogin('marc@lafrance.com')}
            >
              Technician: marc@lafrance.com
            </button>

            <button
              className="quick-login-button"
              onClick={() => quickLogin('jean.bertrand@example.com')}
            >
              Client: jean.bertrand@example.com
            </button>
          </div>
        </div>

        <div className="login-footer">
          Mot de passe pour tous les comptes demo:<br />
          Admin: admin123 | Division: plomb123/toit123<br />
          Dispatcher: dispatch123 | Tech: tech123 | Client: client123
        </div>
      </div>
    </div>
  )
}

export default Login
