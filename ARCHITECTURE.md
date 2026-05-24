# Smart AgriTech — System Architecture

## 1. High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Farmer / Admin Browser                    │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS (production)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              React SPA (Vite) — Port 3000                    │
│  Pages: Dashboard, Crop, Fertilizer, Weather, Disease,       │
│         Marketplace, Cart, Orders, History, Admin            │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST JSON /api/*
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           Node.js + Express API — Port 5000                  │
│  Middleware: Helmet, CORS, rate limit, JWT auth,           │
│              express-validator, error handler                │
└──────┬──────────────────┬──────────────────┬──────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ MongoDB      │  │ Google       │  │ OpenWeather      │
│ Atlas        │  │ Gemini API   │  │ API              │
│ (cloud DB)   │  │ (text+vision)│  │ (weather/forecast)│
└──────────────┘  └──────────────┘  └──────────────────┘
```

## 2. Cloud services map

| Component | Current implementation | Production target (Azure) |
|-----------|------------------------|---------------------------|
| Database | MongoDB Atlas | MongoDB Atlas or Azure Cosmos DB (optional) |
| AI | Google Gemini 2.5 Flash | Same (or Azure OpenAI as alternative) |
| Weather | OpenWeather API | Same |
| API hosting | Local / Node | **Azure App Service** |
| Frontend | Local / Vite dev | **Azure Static Web Apps** or App Service |
| Image uploads | Local `uploads/` folder | **Azure Blob Storage** |
| Secrets | `.env` file | **Azure Key Vault** |

## 3. API modules

| Prefix | Purpose |
|--------|---------|
| `/api/auth` | Register, login, JWT |
| `/api/crops` | AI crop recommendation |
| `/api/fertilizers` | AI fertilizer recommendation |
| `/api/diseases` | Image upload + disease detection |
| `/api/weather` | Current + forecast |
| `/api/users` | Profile, recommendation history |
| `/api/marketplace` | Products, cart orders |
| `/api/admin` | Stats, users, leads, contacts, orders |
| `/api/contact` | Contact form messages |
| `/api/public` | Public landing stats |
| `/api/health` | API + database health |

## 4. Database entities (ER overview)

```
User ─────────────┬──< Recommendation (crop | fertilizer | disease)
                  │
                  └──< Order ──< OrderItem (embedded in Order model)

Product (marketplace catalog)
ContactMessage
Crop, Fertilizer, Disease (reference catalogs)
```

### Recommendation document
- `user`, `type`, `inputData`, `result`, `confidence`, `createdAt`
- Powers **My History** and **Admin Leads**

### Order document
- `user`, `items[]`, `totalAmount`, `shippingAddress`, `status`, `paymentMethod` (COD)

## 5. Security architecture

1. **Authentication:** JWT bearer token after login  
2. **Authorization:** `protect` middleware + `admin` role check  
3. **Passwords:** bcrypt hashing (salt rounds: 10)  
4. **HTTP hardening:** Helmet security headers  
5. **Abuse prevention:** Rate limits on `/api/auth` and `/api`  
6. **Validation:** express-validator on auth, contact, crop inputs  
7. **Upload safety:** Image type + 5 MB limit (Multer)

## 6. AI data flow — disease detection

```
Farmer uploads image → POST /api/diseases/detect
  → Multer saves to uploads/ (temp/local)
  → Buffer sent to Gemini Vision with JSON prompt
  → Parsed disease object returned
  → Saved as Recommendation (type: disease)
  → UI shows severity, confidence, treatment + print report
```

## 7. Deployment view (for presentation slide)

```
[GitHub Repo] → CI/CD (future) → Azure App Service (API)
                              → Azure Static Web Apps (React build)
MongoDB Atlas ← connection string in App Service config
Gemini / OpenWeather keys ← App Service application settings
```

## 8. Limitations (state honestly in viva)

- No on-device / edge hardware (IoT) in current scope  
- Disease images stored locally in dev (not cloud blob yet)  
- AI accuracy depends on external Gemini model, not a custom-trained CNN  
- COD only for marketplace payments  
- English UI only  
