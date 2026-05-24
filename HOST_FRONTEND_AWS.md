# Host frontend on AWS + backend on your laptop

This is the **simplest working setup** for your presentation.

## Important (read once)

| Who opens the site | Backend on your laptop |
|--------------------|-------------------------|
| **You** on the **same PC** that runs `npm run dev` (server) | Works |
| **Examiner** on their phone/laptop | Does **not** work with `localhost` API |

`localhost:5000` always means **that person's computer**, not yours.

For examiners to use the cloud URL, the API must be on **Elastic Beanstalk** (or ngrok).  
For **your demo tomorrow**, use one of the options below.

---

## Option A — Easiest demo (recommended)

Run everything locally. No AWS needed for the demo.

**Terminal 1**
```bash
cd server
npm run dev
```

**Terminal 2**
```bash
cd client
npm run dev
```

Open **http://localhost:3000** — login, AI, marketplace all work.

In the presentation say: *"Frontend can deploy to AWS S3/Amplify; backend on Elastic Beanstalk — demo runs locally for reliability."*

---

## Option B — Frontend on AWS S3 + API on your laptop (same PC)

Use this if you want an **AWS URL** open in the browser **on your laptop** while the API runs locally.

### 1. Build frontend pointing to local API

```bash
cd client
npm run build:aws-local
```

This sets `VITE_API_URL=http://localhost:5000` in the build.

### 2. Start backend on your laptop

```bash
cd server
# In server/.env add (comma-separated if you have more URLs):
# CLIENT_URL=http://localhost:3000,http://YOUR-S3-WEBSITE-URL
npm run dev
```

Test: **http://localhost:5000/api/health** → `"status":"OK"`

### 3. Upload `client/dist` to S3

1. AWS Console → **S3** → Create bucket e.g. `smart-agritech-frontend`
2. **Block public access** → turn **off** (for static website only; student demo)
3. Upload **all files** inside `client/dist/` to the bucket root
4. Bucket → **Properties** → **Static website hosting** → Enable  
   - Index: `index.html`  
   - Error: `index.html` (SPA)
5. Bucket policy (replace `BUCKET_NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::BUCKET_NAME/*"
  }]
}
```

6. Open the **HTTP** website endpoint (looks like `http://BUCKET_NAME.s3-website-us-east-1.amazonaws.com`)

### 4. Demo on your laptop only

1. Keep `npm run dev` running in `server/`
2. Open the **S3 website URL** (HTTP, not HTTPS — avoids mixed-content block to `http://localhost:5000`)
3. Login: `farmer@smartagritech.com` / `farmer123` (after `npm run seed`)

---

## Option C — Keep Amplify for frontend only

1. Amplify → **delete** `VITE_API_URL`
2. For demo: still use **Option A** (localhost:3000)
3. Show Amplify URL in slides as *"deployed UI"*; live demo on localhost

Do **not** expect Amplify HTTPS + `http://localhost:5000` to work (browser blocks it).

---

## Option D — Amplify + local API via ngrok (others can test)

If examiners must open your Amplify HTTPS site:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2 — install ngrok once, then:
ngrok http 5000
```

Copy the `https://xxxx.ngrok-free.app` URL.

1. Amplify → Environment variable:  
   `VITE_API_URL` = `https://xxxx.ngrok-free.app` (no trailing slash)
2. `server/.env`:  
   `CLIENT_URL=https://main.dy7ok62s84b3g.amplifyapp.com`
3. Redeploy Amplify
4. Restart server after changing `.env`

---

## What to say in viva

- **Frontend:** AWS Amplify / S3 (static React build)  
- **Backend:** Node.js on Elastic Beanstalk + MongoDB Atlas (production)  
- **Demo:** Local MERN stack for live AI/weather/login (reliable on college network)

---

## Stop using (for now)

- `VITE_API_URL=http://elasticbeanstalk.com` on **HTTPS** Amplify → mixed content blocked  
- Amplify `/api` proxy unless redirects are confirmed working (`/api/health` returns JSON)

---

## Quick checklist before presentation

- [ ] `cd server && npm run seed`
- [ ] `server/.env` has `MONGODB_URI`, `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`
- [ ] Demo path chosen: **A** (localhost) or **B** (S3 + local server on same PC)
- [ ] Test login once on the URL you will actually use
