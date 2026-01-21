import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'

function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate dashboard
    const redirectMap = {
      'super-admin': '/admin/overview',
      'division-head': '/division/dashboard',
      'dispatcher': '/dispatch/dashboard',
      'technician': '/tech/dashboard',
      'client': '/client/dashboard',
    }

    return <Navigate to={redirectMap[user?.role] || '/login'} replace />
  }

  return children
}

export default RoleRoute
