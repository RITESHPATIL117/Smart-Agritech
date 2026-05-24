# Amplify login fix (read this only)

## What went wrong

1. **Mixed content** — Amplify is `https://`, your API is `http://`. The browser **will never** call EB directly from the React app. Delete `VITE_API_URL` in Amplify.

2. **API proxy never worked** — With "Monorepo app root = `client`", Amplify **ignored** `customRedirects` in `amplify.yml` (only `customHeaders` applied). So `/api/*` returned 404.

## Fix in 5 minutes

### Step 1 — Amplify Console → App settings → General

- **Monorepo app root:** leave **EMPTY** (clear the field — use repository root, not `client`)

### Step 2 — Environment variables

- **Delete** `VITE_API_URL` completely (or leave blank)

### Step 3 — Rewrites and redirects (required)

Hosting → **Rewrites and redirects** → open **JSON editor** → paste this exactly:

```json
[
  {
    "source": "/api/<*>",
    "target": "http://smart-agritech-env.eba-mjmv3nxz.us-east-1.elasticbeanstalk.com/api/<*>",
    "status": "200"
  },
  {
    "source": "/uploads/<*>",
    "target": "http://smart-agritech-env.eba-mjmv3nxz.us-east-1.elasticbeanstalk.com/uploads/<*>",
    "status": "200"
  },
  {
    "source": "/<*>",
    "target": "/index.html",
    "status": "404-200"
  }
]
```

Save.

### Step 4 — Push latest code and redeploy

```bash
git pull
git push
```

Wait for Amplify build **Succeeded**.

### Step 5 — Test (must pass before login)

Open in browser:

```
https://main.dy7ok62s84b3g.amplifyapp.com/api/health
```

You must see JSON like:

```json
{"status":"OK","database":"connected",...}
```

If this fails, login will never work. Fix redirects first.

### Step 6 — Elastic Beanstalk

Environment property:

```
CLIENT_URL=https://main.dy7ok62s84b3g.amplifyapp.com
```

(Use your real Amplify URL.)

---

## Login should call

```
POST https://main.dy7ok62s84b3g.amplifyapp.com/api/auth/login
```

**Not** `http://smart-agritech-env...`

---

## Demo users (run once on your PC)

```bash
cd server
npm run seed
```

- Farmer: `farmer@smartagritech.com` / `farmer123`
- Admin: `admin@smartagritech.com` / `admin123`
