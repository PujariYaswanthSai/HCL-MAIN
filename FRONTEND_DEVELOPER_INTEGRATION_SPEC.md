# Frontend Developer Integration Spec

Date: 2026-03-27  
Owner: AGT-005 Frontend Developer  
Source of truth: Backend APIs implemented in Flask blueprints

## 1. Purpose

This document is the frontend handoff for integrating all implemented backend domains into the UI.
It maps backend models, services, and APIs to frontend pages, components, and data flows so implementation is modular and role-based.

## 2. Backend Components the Frontend Must Integrate

### 2.1 Backend Domain Modules (UI-facing)
- auth blueprint: registration, login, token refresh, profile read/update
- vehicles blueprint: catalog listing, details, availability, fleet CRUD
- bookings blueprint: estimate, create, list, details, cancel, fleet pickup/return/status
- payments blueprint: initiate, status, refund, invoice
- maintenance blueprint: list, create, history, upcoming, complete
- pricing blueprint: admin pricing rule CRUD
- reviews blueprint: list, create, vehicle reviews
- admin blueprint: users list and analytics dashboard

### 2.2 Core Data Entities for Frontend Types
- User
- VehicleCategory
- Vehicle
- Booking
- Payment
- Maintenance
- PricingRule
- Review

### 2.3 Common Response Contract
All UI services should parse the backend envelope:
- success response: success, data, optional meta, request_id
- error response: error.code, error.message, error.details, error.request_id

## 3. Frontend Architecture (Required)

## 3.1 Recommended App Structure
- src/app: router and providers
- src/services/http: axios/fetch wrapper, auth interceptor, error parser
- src/services/api: one file per backend domain
- src/types: backend entity interfaces
- src/features/auth
- src/features/vehicles
- src/features/bookings
- src/features/payments
- src/features/maintenance
- src/features/pricing
- src/features/reviews
- src/features/admin
- src/components/common: table, pagination, form controls, state views

## 3.2 Mandatory Shared UI Components
- ProtectedRoute
- RoleGuard
- AppShell (header, role navigation, user menu)
- ApiErrorBanner
- LoadingState
- EmptyState
- ConfirmDialog
- PaginationControls
- Toast/Notifier

## 3.3 Role-based Navigation
- Customer: vehicles, booking estimate/create, my bookings, payments, reviews, profile
- Fleet Manager: vehicles manage, bookings operations, maintenance
- Admin: admin dashboard, users, pricing rules, refunds, fleet operations

## 4. Full API Integration Matrix

Base URL: http://localhost:5000

### 4.1 Auth APIs
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/me
- PUT /api/auth/me

Frontend components:
- RegisterForm
- LoginForm
- ProfileView
- ProfileEditForm
- AuthProvider (access + refresh token lifecycle)

### 4.2 Vehicle APIs
- GET /api/vehicles
- GET /api/vehicles/<id>
- GET /api/vehicles/<id>/availability
- POST /api/vehicles
- PUT /api/vehicles/<id>
- DELETE /api/vehicles/<id>

Frontend components:
- VehicleFilters
- VehicleGrid
- VehicleCard
- VehicleDetailPanel
- AvailabilityChecker
- VehicleForm (fleet/admin)
- VehicleManagementTable (fleet/admin)

### 4.3 Booking APIs
- POST /api/bookings/estimate
- POST /api/bookings
- GET /api/bookings
- GET /api/bookings/<id>
- PUT /api/bookings/<id>/cancel
- PUT /api/bookings/<id>/pickup
- PUT /api/bookings/<id>/return
- PUT /api/bookings/<id>/status

Frontend components:
- BookingEstimator
- BookingCreateForm
- MyBookingsTable
- BookingStatusBadge
- BookingDetailDrawer
- CancelBookingButton
- PickupActionButton (fleet/admin)
- ReturnActionButton (fleet/admin)
- StatusUpdateMenu (fleet/admin)

### 4.4 Payment APIs
- POST /api/payments/initiate
- POST /api/payments/simulate (alias, optional UI use)
- GET /api/payments/<id>
- POST /api/payments/refund/<id>
- GET /api/payments/invoice/<booking_id>

Frontend components:
- PaymentMethodSelector
- PaymentActionPanel
- PaymentStatusCard
- RefundActionPanel (admin)
- InvoiceView

### 4.5 Maintenance APIs
- GET /api/maintenance
- POST /api/maintenance
- GET /api/maintenance/vehicle/<vehicle_id>
- GET /api/maintenance/upcoming
- PATCH /api/maintenance/<id>/complete

Frontend components:
- MaintenanceLogsTable
- MaintenanceCreateForm
- VehicleMaintenanceTimeline
- UpcomingMaintenanceWidget
- CompleteMaintenanceButton

### 4.6 Pricing APIs (Admin)
- GET /api/pricing/rules
- POST /api/pricing/rules
- PUT /api/pricing/rules/<id>
- DELETE /api/pricing/rules/<id>

Frontend components:
- PricingRulesTable
- PricingRuleForm
- DeactivateRuleAction

### 4.7 Reviews APIs
- GET /api/reviews
- POST /api/reviews
- GET /api/reviews/vehicle/<id>

Frontend components:
- ReviewsList
- ReviewForm
- VehicleRatingSummary

### 4.8 Admin APIs
- GET /api/admin/users
- GET /api/admin/analytics

Frontend components:
- AdminUsersTable
- AnalyticsDashboardCards
- RevenueSummaryWidget

## 5. Required Screens and Route Map

- /auth/login
- /auth/register
- /profile
- /vehicles
- /vehicles/:id
- /bookings/new
- /bookings
- /bookings/:id
- /payments/:id
- /invoice/:bookingId
- /fleet/vehicles
- /fleet/bookings
- /fleet/maintenance
- /admin/dashboard
- /admin/users
- /admin/pricing
- /reviews

## 6. Service Layer Contract for Frontend

Create one frontend API service per backend domain:
- authService
- vehicleService
- bookingService
- paymentService
- maintenanceService
- pricingService
- reviewService
- adminService

Each service method must:
- attach Authorization bearer token when required
- parse envelope responses consistently
- throw normalized UI errors from error.code/message/details
- support pagination query params where available

## 7. Integration Flows (Must Work)

### 7.1 Customer Rental Flow
1. Login
2. View vehicles
3. Check availability with pickup/return time
4. Estimate booking price
5. Create booking
6. Initiate payment
7. View booking status
8. View invoice after completion
9. Submit review

### 7.2 Fleet Ops Flow
1. Login as fleet_manager
2. Manage vehicles
3. Mark pickup
4. Mark return
5. Create and complete maintenance

### 7.3 Admin Flow
1. Login as admin
2. View users
3. View analytics
4. Manage pricing rules
5. Refund payments

## 8. Validation and Error Handling Requirements

- show field-level validation messages from error.details
- do not swallow request_id; surface it in error UI for traceability
- add route-level loading and empty states
- enforce role-based route guards before API calls
- handle token expiry with refresh and retry logic

## 9. Frontend Completion Checklist (SOP-aligned)

- all listed routes implemented and connected
- all APIs integrated through shared service layer
- role-based guards enforced for customer/fleet/admin
- loading, error, and empty states implemented on all screens
- form validation implemented before API submission
- pagination wired where backend returns meta
- invoice and analytics views render correctly
- critical user journeys tested end to end in UI

## 10. Demo Credentials (Seed Data)

- customer@example.com / password123
- fleet@example.com / password123
- admin@example.com / password123

## 11. Presentation Mapping Line

Each requirement is mapped to a specific set of APIs, ensuring modular design and clear separation of responsibilities across user roles.

Our API design ensures scalability, security, and real-time consistency, especially in handling vehicle availability and booking conflicts.
