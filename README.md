# Vehicle Rental Management Platform

A robust, modern web application for vehicle rentals. This platform includes a Flask backend for the API and a Vite + React + TypeScript frontend with Tailwind CSS.

## Project Structure

- `backend/`: Flask API with SQLite database.
- `FRONTEND/vehicle-rental-app/`: React (Vite) frontend application.

---

## 🚀 Getting Started

Follow these instructions to set up and run both the backend and frontend servers locally.

### 1. Backend Setup (Flask)

The backend runs on Python with a SQLite database.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (optional but recommended):**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the environment variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   (You can modify the `.env` file if needed, but the defaults work out of the box for local development).

5. **Initialize the database and seed initial data:**
   ```bash
   python init_db.py
   ```

6. **Run the backend development server:**
   ```bash
   python run.py
   ```
   The backend will start running on **http://localhost:5000**.

---

### 2. Frontend Setup (React + Vite)

The frontend uses Vite, React, TypeScript, and TailwindCSS.

1. **Navigate to the frontend directory:**
   ```bash
   cd FRONTEND/vehicle-rental-app
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   *(We recommend using `npm`, but `yarn` or `pnpm` will also work).*

3. **Run the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will start running on **http://localhost:5173**.

---

## 🔧 Usage

1. Open your browser and go to `http://localhost:5173`
2. You can register a new account or log in with the seeded users.
3. Passwords no longer require a minimum 8-character limit.

## 🛠 Tech Stack

**Frontend:**
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Framer Motion

**Backend:**
- Python 3.x
- Flask
- Flask-SQLAlchemy (SQLite)
- Flask-JWT-Extended
- Marshmallow (Data Validation)
