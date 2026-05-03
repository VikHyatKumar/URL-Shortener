# SnapURL — Full-Stack URL Shortener

A production-ready URL Shortener built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, click analytics, QR code generation, custom aliases, dark mode, and a fully responsive modern UI.

---

## Features

### Core
- Shorten any long URL into a clean short link
- Custom alias support (e.g. `snap/my-brand`)
- One-click redirect via short code
- Click counter + click history (user-agent, referer, timestamp)
- Delete and edit original URLs

### Authentication
- JWT-based register / login / logout
- Protected routes — dashboard and shortening require login
- Session persists across browser refresh via `localStorage`
- Password hashing with bcrypt 

### Dashboard
- Personal URL history (each user sees only their own links)
- Real-time search and filter
- Stats cards — total links, total clicks, avg clicks, active links
- Inline edit without leaving the table

### UI / UX
- Dark mode with system preference detection + localStorage persistence
- QR code modal for every short link
- Copy-to-clipboard with toast feedback
- Skeleton loaders while fetching
- Fully responsive — mobile, tablet, desktop
- Lucide React icons throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios (with request/response interceptors) |
| Icons | Lucide React |
| QR Code | qrcode.react |
| Toasts | react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password | bcryptjs |
| Short Code | nanoid |
| Env | dotenv |

---

## Project Structure

```
url-shortener/
│
├── server/                         # Express + Node.js backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection (Mongoose)
│   ├── controllers/
│   │   ├── authController.js       # register, login, getMe
│   │   └── urlController.js        # shorten, redirect, CRUD (user-scoped)
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verify → attaches req.user
│   │   └── validateUrl.js          # Rejects malformed URLs early
│   ├── models/
│   │   ├── User.js                 # name, email, bcrypt-hashed password
│   │   └── Url.js                  # originalUrl, shortCode, user FK, clicks
│   ├── routes/
│   │   ├── authRoutes.js           # POST /register, POST /login, GET /me
│   │   └── urlRoutes.js            # All protected URL CRUD routes
│   ├── .env                        # Secrets (never commit)
│   ├── .env.example                # Template for environment variables
│   └── server.js                   # Express app entry point
│
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Auth-aware nav, dark mode toggle
│   │   │   ├── ProtectedRoute.jsx  # Redirects to /login if unauthenticated
│   │   │   ├── QRCodeModal.jsx     # Full-screen QR code overlay
│   │   │   └── UrlCard.jsx         # Dashboard table row (copy/QR/edit/delete)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state (user, token, login/logout)
│   │   │   └── ThemeContext.jsx    # Dark/light mode with localStorage
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Shorten form + result display
│   │   │   ├── Dashboard.jsx       # Stats + searchable URL table
│   │   │   ├── Login.jsx           # Sign-in form
│   │   │   └── Register.jsx        # Sign-up with password strength bar
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance for URL API (auth interceptor)
│   │   │   └── authApi.js          # Axios calls for auth endpoints
│   │   ├── App.jsx                 # Router + AuthProvider + ThemeProvider
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind + custom component classes
│   ├── index.html
│   ├── vite.config.js              # Dev proxy /api → localhost:5000
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                    # Root scripts (npm run dev starts both)
└── .gitignore
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | ❌ | Create account, returns JWT |
| `POST` | `/api/auth/login` | `{ email, password }` | ❌ | Sign in, returns JWT |
| `GET` | `/api/auth/me` | — | ✅ Bearer | Get current user profile |

### URL Routes — `/api/url`

| Method | Endpoint | Body / Query | Auth | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/url/shorten` | `{ originalUrl, customAlias? }` | ✅ | Create short URL |
| `GET` | `/api/url/all` | `?search=` | ✅ | Get all user's URLs |
| `PUT` | `/api/url/:id` | `{ originalUrl }` | ✅ | Edit original URL |
| `DELETE` | `/api/url/:id` | — | ✅ | Delete a URL |

### Redirect Route

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/:shortCode` | ❌ Public | Redirects to original URL + increments click count |

---

## Setup & Run Locally

### Prerequisites
- Node.js v18+
- MongoDB (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster

### 1 — Clone & Install

```bash
git clone https://github.com/VikHyatKumar/URL-Shortener.git
cd url-shortener

# Install all dependencies (server + client + root)
npm run install:all
```

### 2 — Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3 — Run in Development

```bash
# From the project root — starts both server and client concurrently
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## Environment Variables

### Server (`server/.env`)

| Variable | Example | Required | Description |
|---|---|---|---|
| `PORT` | `5000` | Yes | Express server port |
| `MONGO_URI` | `mongodb+srv://...` | Yes | MongoDB connection string |
| `BASE_URL` | `http://localhost:5000` | Yes | Used to build the short URL |
| `CLIENT_URL` | `http://localhost:5173` | Yes | CORS allowed origin |
| `JWT_SECRET` | `abc123...` | Yes | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | No | Token expiry (default: 7d) |

### Client (`client/.env`) — optional for production

| Variable | Example | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.yourapp.com/api/url` | Override API base in production |
| `VITE_AUTH_BASE_URL` | `https://api.yourapp.com/api/auth` | Override auth base in production |

---

## How JWT Authentication Works

```
REGISTER
  Client → POST /api/auth/register { name, email, password }
  Server → bcrypt.hash(password, 12) via pre-save hook
         → User.create() → jwt.sign({ id }) → return { token, user }
  Client → store token in localStorage → redirect to home

LOGIN
  Client → POST /api/auth/login { email, password }
  Server → User.findOne().select("+password")
         → bcrypt.compare(input, hash) → jwt.sign({ id }) → return { token, user }
  Client → store token in localStorage → redirect to home

PROTECTED REQUEST
  Client → Axios request interceptor adds: Authorization: Bearer <token>
  Server → authMiddleware: jwt.verify(token) → User.findById(decoded.id)
         → attaches req.user → controller runs

SESSION RESTORE (page refresh)
  AuthContext useEffect → GET /api/auth/me with stored token
  Server → verify token → return user profile
  Client → restores user state without re-login

LOGOUT
  Client → localStorage.removeItem("token") → setUser(null) → redirect /login
```

---

## Scripts

```bash
# Root
npm run dev            # Start both server + client (concurrently)
npm run install:all    # Install dependencies for server, client, and root

# Server only
cd server
npm run dev            # nodemon server.js
npm start              # node server.js

# Client only
cd client
npm run dev            # Vite dev server
npm run build          # Production build → dist/
npm run preview        # Preview production build locally
```

---

