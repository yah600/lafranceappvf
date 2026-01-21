import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

// Public pages
import Landing from '@pages/public/Landing'
import Login from '@pages/public/Login'

// Technician pages
import TechDashboard from '@pages/technician/TechDashboard'
import TechJobs from '@pages/technician/TechJobs'
import TechJobActive from '@pages/technician/TechJobActive'
import TechEarnings from '@pages/technician/TechEarnings'
import TechProfile from '@pages/technician/TechProfile'

// Client pages
import ClientDashboard from '@pages/client/ClientDashboard'
import ClientRequestUrgent from '@pages/client/ClientRequestUrgent'
import ClientJobTracking from '@pages/client/ClientJobTracking'
import ClientRating from '@pages/client/ClientRating'
import ClientInvoices from '@pages/client/ClientInvoices'
import ClientPayment from '@pages/client/ClientPayment'

// Dispatcher pages
import DispatchDashboard from '@pages/dispatcher/DispatchDashboard'

// Admin pages
import AdminOverview from '@pages/admin/AdminOverview'

// Placeholder component for pages we haven't built yet
const Placeholder = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>This page is under construction...</p>
  </div>
)

function AppRoutes() {
  const { user, isAuthenticated } = useAuthStore()

  const getRootRedirect = () => {
    if (!isAuthenticated) return '/landing'

    switch (user?.role) {
      case 'super-admin':
        return '/admin/overview'
      case 'division-head':
        return '/division/dashboard'
      case 'dispatcher':
        return '/dispatch/dashboard'
      case 'technician':
        return '/tech/dashboard'
      case 'client':
        return '/client/dashboard'
      default:
        return '/landing'
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/client" element={<Placeholder title="Client Signup" />} />
      <Route path="/signup/technician" element={<Placeholder title="Technician Signup" />} />

      {/* Technician Routes */}
      <Route
        path="/tech/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['technician']}>
              <Routes>
                <Route path="dashboard" element={<TechDashboard />} />
                <Route path="jobs" element={<TechJobs />} />
                <Route path="job/:id/active" element={<TechJobActive />} />
                <Route path="earnings" element={<TechEarnings />} />
                <Route path="profile" element={<TechProfile />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/client/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['client']}>
              <Routes>
                <Route path="dashboard" element={<ClientDashboard />} />
                <Route path="request/urgent" element={<ClientRequestUrgent />} />
                <Route path="request/scheduled" element={<Placeholder title="Scheduled Request" />} />
                <Route path="jobs" element={<Placeholder title="My Jobs" />} />
                <Route path="job/:id/tracking" element={<ClientJobTracking />} />
                <Route path="invoices" element={<ClientInvoices />} />
                <Route path="invoice/:id/payment" element={<ClientPayment />} />
                <Route path="job/:id/rating" element={<ClientRating />} />
                <Route path="profile" element={<Placeholder title="Profile" />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Dispatcher Routes */}
      <Route
        path="/dispatch/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['dispatcher', 'division-head', 'super-admin']}>
              <Routes>
                <Route path="dashboard" element={<DispatchDashboard />} />
                <Route path="jobs" element={<Placeholder title="All Jobs" />} />
                <Route path="job/:id" element={<Placeholder title="Job Detail" />} />
                <Route path="create-urgent" element={<Placeholder title="Create Urgent Job" />} />
                <Route path="assign/:jobId" element={<Placeholder title="Assign Job" />} />
                <Route path="technicians" element={<Placeholder title="Technicians" />} />
                <Route path="clients" element={<Placeholder title="Clients" />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Division Head Routes */}
      <Route
        path="/division/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['division-head', 'super-admin']}>
              <Routes>
                <Route path="dashboard" element={<Placeholder title="Division Dashboard" />} />
                <Route path="analytics" element={<Placeholder title="Analytics" />} />
                <Route path="technicians" element={<Placeholder title="Manage Technicians" />} />
                <Route path="settings" element={<Placeholder title="Settings" />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Super Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['super-admin']}>
              <Routes>
                <Route path="overview" element={<AdminOverview />} />
                <Route path="division/:divisionId" element={<Placeholder title="Division Detail" />} />
                <Route path="analytics" element={<Placeholder title="Global Analytics" />} />
                <Route path="technicians" element={<Placeholder title="All Technicians" />} />
                <Route path="technician-approval" element={<Placeholder title="Approve Technicians" />} />
                <Route path="compliance" element={<Placeholder title="Compliance" />} />
                <Route path="cross-division" element={<Placeholder title="Cross-Division Projects" />} />
                <Route path="bidding-marketplace" element={<Placeholder title="Bidding Marketplace" />} />
                <Route path="settings" element={<Placeholder title="System Settings" />} />
              </Routes>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
