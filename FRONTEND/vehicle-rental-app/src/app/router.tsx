import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/common/AppShell'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { RoleGuard } from './guards/RoleGuard'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ProfilePage } from '../features/auth/pages/ProfilePage'
import { HomePage } from '../features/vehicles/pages/HomePage'
import { VehiclesPage } from '../features/vehicles/pages/VehiclesPage'
import { VehicleDetailsPage } from '../features/vehicles/pages/VehicleDetailsPage'
import { BookingCreatePage } from '../features/bookings/pages/BookingCreatePage'
import { BookingsPage } from '../features/bookings/pages/BookingsPage'
import { BookingDetailsPage } from '../features/bookings/pages/BookingDetailsPage'
import { PaymentPage } from '../features/payments/pages/PaymentPage'
import { InvoicePage } from '../features/payments/pages/InvoicePage'
import { FleetVehiclesPage } from '../features/vehicles/pages/FleetVehiclesPage'
import { FleetBookingsPage } from '../features/bookings/pages/FleetBookingsPage'
import { FleetMaintenancePage } from '../features/maintenance/pages/FleetMaintenancePage'
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage'
import { AdminUsersPage } from '../features/admin/pages/AdminUsersPage'
import { AdminPricingPage } from '../features/pricing/pages/AdminPricingPage'
import { ReviewsPage } from '../features/reviews/pages/ReviewsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
          <Route path="/bookings/new" element={<BookingCreatePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailsPage />} />
          <Route path="/payments/:id" element={<PaymentPage />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />

          <Route
            path="/fleet/vehicles"
            element={
              <RoleGuard roles={['fleet_manager', 'admin']}>
                <FleetVehiclesPage />
              </RoleGuard>
            }
          />
          <Route
            path="/fleet/bookings"
            element={
              <RoleGuard roles={['fleet_manager', 'admin']}>
                <FleetBookingsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/fleet/maintenance"
            element={
              <RoleGuard roles={['fleet_manager', 'admin']}>
                <FleetMaintenancePage />
              </RoleGuard>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RoleGuard roles={['admin']}>
                <AdminDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleGuard roles={['admin']}>
                <AdminUsersPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/pricing"
            element={
              <RoleGuard roles={['admin']}>
                <AdminPricingPage />
              </RoleGuard>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
