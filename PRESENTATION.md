# Smart AgriTech — Final Presentation Guide

**Project title:** Smart AgriTech Using Cloud Services  
**Duration:** 8–10 min demo + Q&A

---

## 1. One-line pitch (30 seconds)

> **Smart AgriTech** is a cloud-hosted web platform that helps farmers make data-driven decisions using **Google Gemini AI** for crop and fertilizer recommendations, **vision-based plant disease detection**, **live weather** with farming advice, and an **agri marketplace** — with an **admin dashboard** for platform oversight, leads, and orders.

---

## 2. How to explain “Cloud Services” (important)

Use this wording so examiners see consistency between title and implementation:

| Service | Role in project | Provider |
|---------|-----------------|----------|
| **Database** | Users, recommendations, orders, products | **MongoDB Atlas** (cloud) |
| **AI engine** | Crop, fertilizer, disease vision | **Google Gemini API** (cloud) |
| **Weather data** | Live + forecast | **OpenWeather API** (cloud) |
| **Application hosting** | Demo: local; production-ready for **Azure App Service** / Static Web Apps or Render/Vercel | Deployment target |

**Say:** *“Our system uses multiple cloud SaaS services today. The application layer is designed to deploy on Microsoft Azure App Service with Azure Blob Storage for images in production.”*

**Do not claim** Azure is fully implemented unless you deploy tonight and show a URL + Azure portal screenshot.

---

## 3. Tech stack (say this clearly)

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, Multer |
| Database | MongoDB Atlas (Mongoose) |
| AI | Google Gemini 2.5 Flash (text + vision) |
| Weather | OpenWeather API |
| Security | JWT, bcrypt, Helmet, rate limiting, express-validator |
| Roles | Farmer, Admin |

**Implemented modules:** Crop AI, Fertilizer AI, Disease detection, Weather, Marketplace (COD), History, Admin (stats, leads, messages, orders).

**Future scope:** IoT soil sensors, trained CNN model, Azure Blob for uploads, online payments, equipment rental, labor portal, Hindi UI.

---

## 4. Demo credentials

Run seed first: `cd server && npm run seed`

| Role | Email | Password |
|------|-------|------------|
| Admin | admin@smartagritech.com | admin123 |
| Farmer | farmer@smartagritech.com | farmer123 |

---

## 5. How to run before presenting

**Terminal 1 — Backend**
```bash
cd server
npm install
# Copy .env.example to .env and fill: MONGODB_URI, JWT_SECRET, OPENWEATHER_API_KEY, GEMINI_API_KEY
npm run seed
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd client
npm install
npm run dev
```

Open: **http://localhost:3000**

**Health check:** http://localhost:5000/api/health → `"database": "connected"`

---

## 6. Demo flow (8–10 minutes) — follow this order

### Step 1: Landing page (30 sec)
- Show hero and feature cards (crop, weather, disease, fertilizer, marketplace)
- Point out **live platform stats** (farmers / recommendations from MongoDB Atlas)
- Click **Get Started** → Login as farmer

### Step 2: Farmer dashboard (45 sec)
- Show **live stats** (crop / fertilizer / disease counts)
- **Quick Actions** — brief overview of each module

### Step 3: Crop recommendation (1.5 min)
Sample inputs:
- N: 90, P: 40, K: 50
- Temp: 28°C, Humidity: 65%, pH: 6.5, Rainfall: 120 mm

Submit → show Gemini crop list. Say: *“Stored in MongoDB Atlas for history and admin leads.”*

### Step 4: Fertilizer recommendation (1 min)
- Crop: **Rice**, Soil: **Clay**, enter N/P/K
- Show AI fertilizer suggestions with dosage

### Step 5: Weather monitoring (1 min)
- City: **Delhi** or **Mumbai**
- Current weather + forecast cards + farming tips

### Step 6: Disease detection (1.5 min) — highlight feature
- Upload a **prepared leaf JPG** (&lt; 5 MB)
- Show scan animation → disease name, severity, confidence, treatment
- Click **Download / Print Report**
- Say: *“Gemini Vision analyzes the image; results are advisory — verify with agronomist.”*

### Step 7: Marketplace (1 min)
- Browse products (seeds, fertilizer, tools)
- Add item to cart → **Place Order (COD)**
- Open **My Orders** → show order + status timeline

### Step 8: History (20 sec)
- Open **My History** — past crop/fertilizer/disease recommendations

### Step 9: Admin dashboard (1.5 min)
- Logout → Login as **admin**
- **Overview:** user counts, charts (user growth, AI usage by feature), user management
- **Leads:** expand a row — farmer inputs + full AI response; mention CSV export
- **Messages:** contact form submissions (optional: submit from Contact page earlier)
- **Orders:** update marketplace order status

**Do not delete** the demo farmer account during presentation.

### Step 10: Closing (30 sec)
- Problem: fragmented farming decisions (crop, disease, weather, inputs)
- Solution: one cloud-connected platform with AI + marketplace + admin oversight
- Future: Azure hosting, Blob storage, IoT sensors, CNN model, payments

---

## 7. Architecture (for PPT slide)

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for full diagram and entity list.

```
[ Farmer Browser ]
        ↓
[ React App :3000 ]
        ↓ REST /api
[ Express API :5000 ]
   ↙      ↓       ↘
[ MongoDB Atlas ] [ Gemini API ] [ OpenWeather ]
```

---

## 8. Suggested PPT slide order (12–15 slides)

1. Title, team, guide  
2. Problem statement  
3. Objectives  
4. Literature / existing solutions (brief)  
5. System architecture (diagram above + cloud table)  
6. Tech stack  
7. Database / ER (User, Recommendation, Product, Order)  
8. Key modules (6 bullets)  
9. Security features  
10. Screenshots (4–6)  
11. Manual testing (see [TESTING.md](./TESTING.md))  
12. Results / admin analytics charts  
13. Demo flow  
14. Limitations & future scope  
15. Conclusion + thank you  

---

## 9. Expected Q&A

**Q: Is disease detection a CNN?**  
A: We use **Gemini Vision API** for fast, accurate prototyping. A dedicated CNN on crop-specific datasets is planned for offline use and higher domain accuracy.

**Q: Microsoft Azure / cloud deployment?**  
A: Database is on **MongoDB Atlas**; AI on **Google Gemini**; weather on **OpenWeather**. The app is cloud-ready and can be deployed on **Azure App Service** with **Azure Blob** for image storage — our demo runs locally with the same architecture.

**Q: Security?**  
A: JWT auth, bcrypt passwords, Helmet headers, API rate limiting, input validation, admin-only routes, role-based access.

**Q: How accurate are AI recommendations?**  
A: They are **decision-support** outputs from Gemini based on soil/climate inputs and images — farmers should confirm with local KVK/agronomists before applying chemicals.

**Q: Marketplace payment?**  
A: **Cash on Delivery (COD)** implemented; online payment gateway is future work.

**Q: Hardware / IoT?**  
A: Current project is software-focused. Soil moisture and NPK sensors via IoT are planned future scope.

**Q: What did you build vs use APIs?**  
A: Full-stack integration — UI, APIs, auth, DB models, admin leads/orders, prompts, validation, and security middleware.

---

## 10. Night-before checklist

- [ ] `.env` has valid `MONGODB_URI`, `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `JWT_SECRET`
- [ ] `npm run seed` completed (marketplace products exist)
- [ ] Test farmer + admin login
- [ ] Test weather (Delhi/Mumbai)
- [ ] Test disease upload with sample image
- [ ] Test marketplace order end-to-end
- [ ] Capture 6–8 screenshots for PPT backup
- [ ] `/api/health` shows database connected
- [ ] Laptop charged; mobile hotspot as backup

---

## 11. If something fails during demo

| Issue | Fix |
|-------|-----|
| Gemini error | Check `GEMINI_API_KEY`, restart server; use screenshots |
| Disease without API key | Reference catalog still works |
| Empty marketplace | Run `npm run seed` in `server/` |
| MongoDB error | Check Atlas IP whitelist and `MONGODB_URI` |
| Weather fails | Try another city; use screenshot |

Good luck with your presentation.
