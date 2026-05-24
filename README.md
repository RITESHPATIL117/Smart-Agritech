# Smart AgriTech — AI-Powered Smart Agriculture Platform

A full-stack web application that empowers farmers with **Google Gemini AI** recommendations, **vision-based plant disease detection**, **weather monitoring**, and an **admin dashboard** — built with the MERN stack and cloud-ready architecture.

![Stack](https://img.shields.io/badge/React-Vite-61DAFB)
![Stack](https://img.shields.io/badge/Node-Express-339933)
![Stack](https://img.shields.io/badge/MongoDB-Atlas-47A248)
![Stack](https://img.shields.io/badge/AI-Gemini-4285F4)

> **Presenting this project?** See **[PRESENTATION.md](./PRESENTATION.md)** for demo script, credentials, and Q&A.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **AI Crop Recommendation** | Soil NPK, temperature, humidity, pH, rainfall → top crop suggestions |
| **AI Fertilizer Recommendation** | Crop + soil type → fertilizer plan with dosage |
| **AI Disease Detection** | Upload leaf image → Gemini Vision analysis + printable report |
| **Weather Monitoring** | Live weather + forecast + farming tips (OpenWeather) |
| **Farmer Dashboard** | Activity stats, charts, recommendation history |
| **Admin Dashboard** | User management, platform stats, AI usage analytics |
| **Agri Marketplace** | Product catalog, cart, COD orders, admin order management |
| **My History** | Past crop, fertilizer, and disease recommendations |
| **Admin Leads** | View farmer inputs + AI outputs; CSV export |
| **Contact & Admin Messages** | Public contact form + admin inbox |
| **Authentication** | JWT login/register, Farmer & Admin roles |

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Recharts, React Router |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | MongoDB Atlas (Mongoose) |
| **AI/ML** | Google Gemini 2.5 Flash (text + vision) |
| **APIs** | OpenWeather Map |
| **Security** | JWT, bcrypt, Helmet, rate limiting, express-validator, RBAC |

**Cloud services used:** MongoDB Atlas (database), Google Gemini API (AI), OpenWeather API (weather).

**Planned extensions:** Azure App Service + Blob Storage deployment, IoT soil sensors, CNN disease model, online payments, equipment rental, labor portal.

> **Presenting?** See [PRESENTATION.md](./PRESENTATION.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [TESTING.md](./TESTING.md).

---

## Project Structure

```
SmartAgriTech/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
├── server/                 # Express API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/ai.js         # Gemini integration
├── PRESENTATION.md         # Demo script & Q&A
├── ARCHITECTURE.md         # System & cloud architecture
├── TESTING.md              # Manual test cases for report/PPT
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- [OpenWeather](https://openweathermap.org/api) API key (free tier)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your keys
npm run seed
npm run dev
```

Server runs at **http://localhost:5000**

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at **http://localhost:3000**

---

## Demo Login

| Role | Email | Password |
|------|-------|------------|
| Admin | admin@smartagritech.com | admin123 |
| Farmer | farmer@smartagritech.com | farmer123 |

---

## Environment Variables

**server/.env**

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=7d
OPENWEATHER_API_KEY=your_key
GEMINI_API_KEY=your_gemini_key
NODE_ENV=development
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/crops/recommend` | AI crop recommendation |
| POST | `/api/fertilizers/recommend` | AI fertilizer recommendation |
| POST | `/api/diseases/detect` | Image disease detection |
| GET | `/api/weather/:city` | Current weather |
| GET | `/api/weather/forecast/:city` | Weather forecast |
| GET | `/api/admin/stats` | Admin dashboard data |
| GET | `/api/admin/leads` | Farmer inputs + AI recommendations |
| GET | `/api/marketplace/products` | Marketplace catalog |
| POST | `/api/marketplace/orders` | Place COD order |
| GET | `/api/users/history` | User recommendation history |
| GET | `/api/health` | API + database health check |
| POST | `/api/contact` | Contact form submission |

---

## Deployment (AWS Free Tier)

Step-by-step guide: **[DEPLOY_AWS.md](./DEPLOY_AWS.md)**

- **Frontend:** AWS Amplify Hosting (monorepo app root: `client`, see root `amplify.yml`)
- **Backend:** AWS Elastic Beanstalk (deploy `server/` folder)
- **Database:** MongoDB Atlas
- **Production env:** `VITE_API_URL` (client) + `CLIENT_URL` (server CORS)

---

## License

ISC

---

**Smart AgriTech** — *Smarter farming with AI and data.*
