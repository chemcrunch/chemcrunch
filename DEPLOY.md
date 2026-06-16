# ChemFeed — Deployment Guide
## Deploy to Vercel in ~10 minutes

---

## What's in this folder

```
chemfeed/
├── index.html      ← Full app (all UI, logic, content)
├── api/
│   └── claude.js   ← Secure API proxy (hides your Anthropic key)
├── vercel.json     ← Vercel routing config
├── package.json    ← Project metadata
└── DEPLOY.md       ← This file
```

---

## Prerequisites (one-time setup)

1. **Node.js** → https://nodejs.org (download LTS version)
2. **Git** → https://git-scm.com/downloads
3. **GitHub account** → https://github.com (free)
4. **Vercel account** → https://vercel.com (free, sign up with GitHub)
5. **Anthropic API key** → https://console.anthropic.com

---

## Step 1 — Push to GitHub

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd path/to/chemfeed        # navigate to this folder

git init
git add .
git commit -m "ChemFeed v1 — AP Chemistry Study App"
```

Then go to https://github.com/new and create a new repo called `chemfeed`.
Copy the commands GitHub shows you to push, which look like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/chemfeed.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy on Vercel

1. Go to https://vercel.com → click **Add New Project**
2. Click **Import Git Repository** → select your `chemfeed` repo
3. Leave all settings as default — Vercel auto-detects the config
4. Before clicking Deploy, click **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com (starts with `sk-ant-...`)
5. Click **Deploy**

Vercel will build and deploy in about 60 seconds.

---

## Step 3 — Your app is live!

You'll get a URL like: `https://chemfeed-yourname.vercel.app`

Share it with students. On iPhone/Android they can tap:
**Share → Add to Home Screen** and it installs like a real app icon.

---

## Step 4 (Optional) — Custom domain

1. Buy a domain at https://namecheap.com (~$12/year), e.g. `chemfeed.app`
2. In Vercel dashboard → your project → **Settings → Domains**
3. Add your domain and follow the DNS instructions (5 min setup)

---

## Updating the app

Any time you push changes to GitHub, Vercel auto-redeploys:

```bash
git add .
git commit -m "Update: added Unit 2 content"
git push
```

---

## Cost reminder

- Vercel hosting: **Free**
- Anthropic API: ~$0.001–0.002 per AI question generated
- 10 students doing 10 sessions/day ≈ **$5/month**

To control costs, set a monthly spending limit at:
https://console.anthropic.com → Billing → Usage limits
