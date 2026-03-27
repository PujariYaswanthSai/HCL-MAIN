# Vehicle Rental Platform — Backend API

A Flask-based REST API for the Vehicle Rental Management System with complete database integration, JWT authentication, booking management, and role-based access control.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///rental.db
CORS_ORIGINS=http://localhost:5173
```

### 3. Initialize Database

```bash
python init_db.py
```

This will:
- Create all 9 database tables
- Seed users/bookings/pricing data and import vehicle inventory from `Automobile_data.csv` when available
- Generate demo credentials for testing

Optional dataset override:

```env
AUTOMOBILE_DATASET_PATH=d:\\VEHICLE!\\Automobile_data.csv
```

If the CSV path is missing, the backend falls back to the default sample fleet.

### 4. Run the Server

```bash
python run.py
```

Server starts at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` — Create new account
- `POST /login` — Login, get JWT tokens
- `POST /refresh` — Refresh access token
- `GET /me` — Get current user profile
- `PUT /me` — Update current user profile

### Vehicles (`/api/vehicles`)
- `GET /` — List vehicles with filters (paginated)
- `GET /<id>` — Get vehicle details
- `GET /<id>/availability` — Check availability in a time window
- `POST /` — Create vehicle (fleet_manager/admin)
- `PUT /<id>` — Update vehicle (fleet_manager/admin)
- `DELETE /<id>` — Soft-delete vehicle (fleet_manager/admin)

### Bookings (`/api/bookings`)
- `POST /estimate` — Price preview without creating booking
- `POST /` — Create booking
- `GET /` — List current user's bookings (paginated)
- `GET /<id>` — Get booking details
- `PUT /<id>/cancel` — Cancel pending/confirmed booking
- `PUT /<id>/pickup` — Mark vehicle picked up (fleet_manager/admin)
- `PUT /<id>/return` — Mark vehicle returned/completed (fleet_manager/admin)
- `PUT /<id>/status` — Update booking status (fleet_manager/admin)

### Payments (`/api/payments`)
- `POST /initiate` — Start payment, confirm booking on success
- `GET /<id>` — Get payment status by payment id
- `POST /refund/<id>` — Refund a successful payment (admin)
- `POST /simulate` — Backward-compatible alias for initiate
- `GET /invoice/<booking_id>` — Get invoice for completed booking

### Maintenance (`/api/maintenance`)
- `GET /` — View maintenance logs (fleet_manager/admin)
- `POST /` — Create maintenance record (fleet_manager/admin)
- `GET /vehicle/<vehicle_id>` — Get vehicle maintenance history
- `GET /upcoming` — Get upcoming maintenance within 30 days
- `PATCH /<id>/complete` — Mark maintenance as complete

### Admin (`/api/admin`)
- `GET /users` — View users (admin)
- `GET /analytics` — System insights (admin)

### Pricing Rules (`/api/pricing`)
- `GET /rules` — List active pricing rules (admin)
- `POST /rules` — Create pricing rule (admin)
- `PUT /rules/<id>` — Update pricing rule (admin)
- `DELETE /rules/<id>` — Deactivate pricing rule (admin)

### Reviews (`/api/reviews`)
- `GET /` — View reviews (optional filter by `vehicle_id`)
- `POST /` — Submit review for completed booking
- `GET /vehicle/<vehicle_id>` — Get all reviews for a vehicle (public)

## Database Schema

9 normalized tables (3NF):

1. **users** — Login, roles (customer, admin, fleet_manager)
2. **vehicle_categories** — Car types with base pricing
3. **vehicles** — Individual cars with FK to categories
4. **bookings** — Rental reservations with availability conflict checks
5. **booking_status_log** — Append-only status history
6. **payments** — One-to-one with bookings, simulated payment processing
7. **maintenance** — Service records with scheduled/completion tracking
8. **pricing_rules** — Dynamic pricing (seasonal, weekend, peak)
9. **reviews** — Post-booking customer feedback with ratings

All relationships enforced with foreign keys, cascade rules, and soft-deletes.

## Architecture

```
backend/
├── run.py                   # Entry point
├── config.py                # Environment-based config
├── requirements.txt         # Python dependencies
├── init_db.py              # Database initialization
├── seed.py                 # Sample data generation
│
└── app/
    ├── __init__.py         # App factory, blueprint registration, logging
    ├── extensions.py       # SQLAlchemy, JWT, CORS instances
    │
    ├── models/             # SQLAlchemy ORM models
    │   ├── user.py
    │   ├── vehicle.py
    │   ├── vehicle_category.py
    │   ├── booking.py
    │   ├── booking_status_log.py
    │   ├── payment.py
    │   ├── maintenance.py
    │   ├── pricing_rule.py
    │   └── review.py
    │
    ├── schemas/            # Marshmallow input validation
    │   ├── auth_schema.py
    │   ├── vehicle_schema.py
    │   ├── booking_schema.py
    │   ├── payment_schema.py
    │   ├── maintenance_schema.py
    │   ├── pricing_schema.py
    │   └── review_schema.py
    │
    ├── blueprints/         # Flask route handlers
    │   ├── admin_bp.py
    │   ├── auth_bp.py
    │   ├── vehicles_bp.py
    │   ├── bookings_bp.py
    │   ├── payments_bp.py
    │   ├── maintenance_bp.py
    │   ├── pricing_bp.py
    │   └── reviews_bp.py
    │
    ├── services/           # Business logic layer
    │   ├── booking_service.py      # Availability checks, price calc
    │   └── pricing_engine.py       # Dynamic pricing pipeline
    │
    └── utils/
        ├── responses.py    # Standard success/error envelopes
        ├── decorators.py   # @role_required, @rate_limit
        └── validators.py   # Marshmallow validation helper
```

## Authentication Flow

1. Register: `POST /api/auth/register` → creates user account
2. Login: `POST /api/auth/login` → returns `access_token` + `refresh_token`
3. Protected Routes: Include `Authorization: Bearer {access_token}` header
4. Token Expiry: Use `POST /api/auth/refresh` to get new `access_token`
5. Roles: JWT carries `role` claim — used by `@role_required` decorator

## Request/Response Format

### Success Response (200/201)
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "meta": { "page": 1, "per_page": 20, "total": 100 },
  "request_id": "uuid"
}
```

### Error Response (4xx/5xx)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "issue": "Invalid format" }
    ],
    "request_id": "uuid"
  }
}
```

## Backend Features Implemented

✅ **Database Layer**
- All 9 tables with relationships and constraints
- Soft deletes (users, vehicles)
- Append-only status logging (bookings)
- Automatic timestamp tracking (created_at, updated_at)

✅ **API Features**
- JWT auth with access token refresh
- Role-based access control (customer, admin, fleet_manager)
- Request rate limiting (20-60 calls/min per route)
- Request tracing with X-Request-Id header
- Structured error responses

✅ **Business Logic**
- Booking conflict detection (overlapping reservations)
- Dynamic price calculation (base rate × duration × multipliers)
- Weekend surcharges
- Seasonal pricing rules
- Status state machine (pending → confirmed → active → completed/canceled)
- Fleet status actions (`pickup`, `return`, custom status updates)

✅ **Infrastructure**
- CORS enabled for frontend integration
- Logging with request duration tracking
- Database migrations ready (Flask-Migrate)

## Demo Credentials

After running `python init_db.py`:

```
Customer:       customer@example.com / password123
Admin:          admin@example.com / password123
Fleet Manager:  fleet@example.com / password123
```

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123",
    "role": "customer"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 3. Get Available Vehicles
```bash
curl http://localhost:5000/api/vehicles
```

### 4. Create Booking (requires JWT)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "vehicle_id": 1,
    "pickup_time": "2026-04-01T10:00:00",
    "return_time": "2026-04-03T10:00:00",
    "pickup_location": "Main Airport"
  }'
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_ENV` | development or production | `development` |
| `SECRET_KEY` | Flask session secret | `change-me` |
| `JWT_SECRET_KEY` | JWT token signing key | `change-me-too` |
| `DATABASE_URL` | SQLite or PostgreSQL URI | `sqlite:///rental.db` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |
| `ACCESS_TOKEN_EXPIRES_MINUTES` | JWT access token lifetime | `30` |
| `REFRESH_TOKEN_EXPIRES_DAYS` | Refresh token lifetime | `30` |

## Production Deployment

1. Switch to PostgreSQL: Update `DATABASE_URL` to PostgreSQL connection string
2. Set `FLASK_ENV=production`
3. Generate strong `SECRET_KEY` and `JWT_SECRET_KEY`
4. Run `flask db upgrade` for schema migrations
5. Use a production WSGI server (gunicorn, etc.)

## Notes

- All external calls (email, payment) are simulated for demo purposes
- Bearer token refresh is automatic on 401 responses (to be implemented in frontend)
- Booking conflicts checked at creation time (no overbooking allowed)
- Soft deletes preserve booking history for audit trails
