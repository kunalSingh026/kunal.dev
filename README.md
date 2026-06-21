# KUNAL.DEV - Personal Portfolio & Admin Panel

A modern, highly-interactive, full-stack personal portfolio application built with Next.js, Tailwind CSS v4, GSAP, Express.js, PostgreSQL (production), and SQLite (local dev). This repository contains both the frontend (portfolio presentation and admin control panel) and the backend (API endpoints, database management, SMTP mailing, and JWT authentication).

---

## ✨ Features & Enhancements

*   **Interactive Creative UI**: Implemented state-of-the-art designs, custom animations via GSAP, smooth scroll transitions, and custom 3D card tilt behaviors.
*   **Premium Dark Footer**: Features a layered dark design, sitemap navigation layout, systems status monitor, custom brand socials, and a live client-side local timezone clock (UTC+5:30) updating every second.
*   **Hybrid Database System**: Uses SQLite dynamically for zero-config local development, and switches to high-performance PostgreSQL (e.g., Neon or Supabase) in production when a `DATABASE_URL` is detected.
*   **Nodemailer SMTP Portal**: Securely routes contact requests through a Gmail App Password transport to immediately notify the administrator of new inquiries.
*   **GitHub Actions CI Pipeline**: Integrated automated build quality checks running linting and TypeScript compilation on every push to verify branch stability.
*   **Production Standalone Builds**: Standardized frontend configurations optimized for light image builds and rapid deployments.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS v4 (with fluid utility configurations)
- **Animations:** GSAP (GreenSock Animation Platform)
- **Icons:** Lucide React
- **API Client:** Axios

### Backend
- **Runtime Environment:** Node.js / Express.js
- **Database:** SQLite (local development) / PostgreSQL (production) with Sequelize ORM
- **Email Notifications:** Nodemailer SMTP Transporter
- **Authentication:** JWT (JSON Web Tokens) & Cookie Parser (HTTP-only cookies)
- **Security:** bcryptjs (password hashing), CORS dynamic mapping

---

## 📁 Repository Structure

```text
kunal.dev/
├── .github/workflows/    # CI/CD Workflows (Quality checks)
├── frontend/             # Next.js App Router frontend application
│   ├── src/
│   │   ├── app/          # Pages and routing (including admin panel)
│   │   ├── components/   # Interactive components (Hero, Projects, Footer, etc.)
│   │   └── utils/        # Axios API wrapper configurations
│   ├── public/           # Project images, icons, and static assets
│   └── package.json
│
├── backend/              # Node.js + Express API backend
│   ├── src/
│   │   ├── config/       # Database configuration (Sequelize PostgreSQL/SQLite)
│   │   ├── controllers/  # Request handlers (Auth, Experience, Projects, Messages)
│   │   ├── middleware/   # JWT authentication verification middleware
│   │   ├── models/       # Sequelize database models
│   │   ├── routes/       # API router endpoints
│   │   ├── scripts/      # Administrative scripts (Seeding admins)
│   │   └── server.js     # Entrypoint server script
│   └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org) (v20+ LTS recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/kunalSingh026/kunal.dev.git
cd kunal.dev
```

### 2. Configure Environment Variables

#### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_key_here
CORS_ORIGIN=http://localhost:3000
ADMIN_USER=admin
ADMIN_PASS=secure_admin_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
EMAIL_RECEIVER=your_email@gmail.com
```

#### Frontend Configuration (`frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3. Initialize & Seed the Backend
Navigate to the `backend/` directory, install dependencies, seed the database, and start the development server:
```bash
cd backend
npm install
npm run seed:admin
npm run dev
```
The backend API will run at: **`http://localhost:5000`**

---

### 4. Initialize & Run the Frontend
Navigate to the `frontend/` directory, install dependencies, and start the Next.js dev server:
```bash
cd ../frontend
npm install
npm run dev
```
The portfolio presentation will run at: **`http://localhost:3000`**

---

## ☁️ Production Deployment

### Backend (Render)
1. Set the **Root Directory** to `backend`.
2. Select the **Express** preset (Start command: `npm start`).
3. Add a free PostgreSQL database on [Neon](https://neon.tech/) and set the `DATABASE_URL` environment variable.
4. Set `CORS_ORIGIN` to your frontend Vercel URL.
5. Seed the database initially by temporarily updating the Render Start Command to `npm run seed:admin && npm start` (then change it back to `npm start`).

### Frontend (Vercel)
1. Select the **Next.js** framework preset.
2. Set the **Root Directory** to `frontend`.
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your Render API endpoint.
4. Deploy!

---

## 📝 License

This project is licensed under the MIT License.
