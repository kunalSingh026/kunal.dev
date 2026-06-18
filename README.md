# KUNAL.DEV - Personal Portfolio & Admin Panel

A modern, highly-interactive, full-stack personal portfolio application built with Next.js, Tailwind CSS v4, GSAP, Express.js, and SQLite. This repository contains both the frontend (portfolio presentation and admin control panel) and the backend (API endpoints, database management, and authentication).

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP (GreenSock Animation Platform)
- **Icons:** Lucide React
- **API Client:** Axios

### Backend
- **Runtime Environment:** Node.js / Express.js
- **Database:** SQLite (using Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens) & Cookie Parser (HTTP-only cookies)
- **Security:** bcryptjs (password hashing), CORS

---

## 📁 Repository Structure

```text
kunal.dev/
├── frontend/             # Next.js App Router frontend application
│   ├── src/
│   │   ├── app/          # Pages and routing (including admin panel)
│   │   ├── components/   # Interactive components (Hero, Projects, Experience, etc.)
│   │   └── utils/        # Axios API wrapper configurations
│   ├── public/           # Project images, icons, and static assets
│   └── package.json
│
├── backend/              # Node.js + Express API backend
│   ├── src/
│   │   ├── config/       # Database configuration (Sequelize SQLite)
│   │   ├── controllers/  # Request handlers (Auth, Experience, Projects, Messages)
│   │   ├── middleware/   # JWT authentication verification middleware
│   │   ├── models/       # Sequelize database models
│   │   ├── routes/       # API router endpoints
│   │   ├── scripts/      # Administrative scripts (Seeding admins, testing login)
│   │   └── server.js     # Entrypoint server script
│   └── package.json
│
└── .gitignore            # Root git ignore configuration
```

---

## ⚙️ Setup & Installation

Follow these steps to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/kunalSingh026/kunal.dev.git
cd kunal.dev
```

### 2. Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
```

---

### 3. Initialize & Seed the Backend

Open a terminal window, navigate to the `backend/` directory, install dependencies, seed the administrator user, and start the server:

```bash
cd backend
npm install

# Seed the admin user (stores credentials in SQLite database)
npm run seed:admin

# Start the backend development server
npm run dev
```

The backend server will run at: **`http://localhost:5000`**

---

### 4. Initialize & Run the Frontend

Open a second terminal window, navigate to the `frontend/` directory, install dependencies, and start the Next.js development server:

```bash
cd frontend
npm install

# Start the frontend development server
npm run dev
```

The frontend application will run at: **`http://localhost:3000`**

---

## 🔌 API Endpoints Reference

The backend exposes the following API routes under the `/api` prefix:

### Authentication (`/api/auth`)
* `POST /api/auth/login` - Authenticate admin and set HTTP-only cookie.
* `POST /api/auth/logout` - Clear cookie and logout admin.
* `GET /api/auth/me` - Validate session and return user info.

### Projects (`/api/projects`)
* `GET /api/projects` - Get all projects.
* `POST /api/projects` - Create a new project (Admin only).
* `PUT /api/projects/:id` - Update project details (Admin only).
* `DELETE /api/projects/:id` - Remove a project (Admin only).

### Experiences (`/api/experiences`)
* `GET /api/experiences` - Fetch work experience entries.
* `POST /api/experiences` - Add new experience entry (Admin only).
* `PUT /api/experiences/:id` - Edit experience details (Admin only).
* `DELETE /api/experiences/:id` - Delete experience entry (Admin only).

### Messages (`/api/messages`)
* `POST /api/messages` - Submit contact/inquiry message.
* `GET /api/messages` - View all submitted messages (Admin only).

---

## 📝 License

This project is licensed under the MIT License.
