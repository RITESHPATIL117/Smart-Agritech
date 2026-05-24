# Deploy Smart AgriTech on AWS (Free Tier)

This guide uses **two AWS free-tier services**:

| Part | AWS service | Free tier (typical new account) |
|------|-------------|----------------------------------|
| **React frontend** | [AWS Amplify Hosting](https://aws.amazon.com/amplify/) | Build minutes + hosting bandwidth |
| **Node API** | [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) | Runs on **EC2 t2.micro** (750 hrs/month × 12 months) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Free M0 cluster (already used by the project) |

> **Note:** Disease image uploads are stored on the EB server disk and may reset on redeploy. For production, move uploads to **Amazon S3** later.

---

## Prerequisites

1. [AWS account](https://aws.amazon.com/free/) (credit card required; stay within free tier)
2. GitHub repo with this project pushed
3. MongoDB Atlas cluster + connection string
4. API keys: `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`
5. Strong `JWT_SECRET` (random 32+ characters)

---

## Part 1 — MongoDB Atlas (allow AWS)

1. Atlas → **Network Access** → **Add IP Address**
2. Choose **Allow access from anywhere** (`0.0.0.0/0`) for student/demo deploys  
   *(tighten to EB static IP in production)*
3. Copy your `MONGODB_URI`

---

## Part 2 — Deploy backend (Elastic Beanstalk)

### Option A — AWS Console (no CLI)

1. Open [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk)
2. **Create application** → name: `smart-agritech`
3. **Platform:** Node.js 20 running on 64bit Amazon Linux 2023
4. **Application code:** Upload your code as zip **of the `server` folder only**  
   - Zip contents: `server.js`, `package.json`, `routes/`, `models/`, etc. (not the parent `client` folder)
5. Create environment → name e.g. `smart-agritech-api`
6. Wait until health is **Ok** (5–10 min)

### Option B — EB CLI (recommended)

```bash
pip install awsebcli
cd server
eb init -p "Node.js 20 running on 64bit Amazon Linux 2023" smart-agritech --region us-east-1
eb create smart-agritech-api --single
```

### Set environment variables (required)

EB Console → your environment → **Configuration** → **Software** → **Environment properties**:

| Key | Value |
|-----|--------|
| `PORT` | `8080` (EB sets this automatically; app reads `process.env.PORT`) |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | your Atlas URI |
| `JWT_SECRET` | long random secret |
| `JWT_EXPIRE` | `7d` |
| `GEMINI_API_KEY` | your key |
| `OPENWEATHER_API_KEY` | your key |
| `CLIENT_URL` | leave empty for now; add Amplify URL after Part 3 |

Click **Apply** and wait for environment restart.

### Test API

Open in browser:

```
https://YOUR-EB-URL.elasticbeanstalk.com/api/health
```

Expected: `"database": "connected"`

### Seed database (once)

From your PC (with `server/.env` pointing to same Atlas URI):

```bash
cd server
npm run seed
```

---

## Part 3 — Deploy frontend (AWS Amplify)

1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. **Create new app** → **Host web app**
3. Connect **GitHub** → select `SmartAgriTech` repo
4. **Branch:** `main` (or your default branch)
5. Amplify detects `amplify.yml` at repo root — confirm:
   - App root: repository root
   - Build spec: `amplify.yml`
6. **Environment variables** (Amplify → App settings → Environment variables):

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-EB-URL.elasticbeanstalk.com` |

7. **Save and deploy** (first build ~3–5 min)
8. Copy your Amplify URL, e.g. `https://main.d1abc2def3.amplifyapp.com`

### Fix CORS on backend

1. EB → **Configuration** → **Software** → edit `CLIENT_URL`:
   ```
   https://main.d1abc2def3.amplifyapp.com
   ```
   (no trailing slash; add `http://localhost:3000` comma-separated for local dev if needed)
2. Apply and wait for restart

### Redeploy frontend

Amplify → **Redeploy this version** (or push a git commit) after setting `VITE_API_URL`.

---

## Part 4 — Verify end-to-end

1. Open Amplify URL → landing page loads
2. Register / login as farmer (`npm run seed` users or new register)
3. Crop recommendation works (Gemini)
4. Weather for a city works
5. Disease image upload works
6. Admin login → dashboard loads

---

## Cost tips (stay free)

- Use **one** EB environment (`--single` = one t2.micro)
- Use **us-east-1** unless you need another region
- Delete unused EB environments and Amplify apps after the project
- Set [AWS Budgets](https://console.aws.amazon.com/billing/home#/budgets) alert at $1–5
- MongoDB Atlas M0 stays free within limits

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error in browser | Set `CLIENT_URL` on EB to exact Amplify URL (https, no slash) |
| API 502 on EB | Check EB logs: Logs → Request logs; verify `MONGODB_URI` |
| Blank page after refresh on Amplify | `amplify.yml` includes SPA redirect rule |
| Login works locally, not prod | `VITE_API_URL` must be EB URL; rebuild Amplify after changing |
| Disease upload fails | Nginx limit: `server/.platform/nginx/conf.d/upload_size.conf` included |
| Gemini errors | Confirm `GEMINI_API_KEY` in EB env properties |

---

## Optional: custom domain

- **Amplify:** App settings → Domain management → add domain (Route 53 or external DNS)
- **EB:** Can add HTTPS via load balancer (may incur cost outside free tier) — for FYP, Amplify default URL is enough

---

## Architecture after deploy

```
User → Amplify (React static)
         ↓ VITE_API_URL
       Elastic Beanstalk (Express API)
         ↓
       MongoDB Atlas + Gemini API + OpenWeather
```

Good luck with your deployment.
