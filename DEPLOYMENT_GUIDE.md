# 🚀 SAATHI Deployment Guide (Vercel & Render)

This repository is pre-configured for automated, zero-error deployment of the **Frontend on Vercel** and the **Backend on Render**.

---

## 🌐 Live Services Reference

- **Live Backend (Render)**: [https://orignal-saathi-ixw7.onrender.com](https://orignal-saathi-ixw7.onrender.com)
  - Health Endpoint: [`/health`](https://orignal-saathi-ixw7.onrender.com/health)
  - Swagger Documentation: [`/api/docs`](https://orignal-saathi-ixw7.onrender.com/api/docs)
  - Status Info: [`/`](https://orignal-saathi-ixw7.onrender.com/)

---

## ⚡ Part 1: Deploying Frontend to Vercel

The frontend is built using **TanStack Start** with **Nitro**. It uses Vercel Build Output API v3 (`.vercel/output`).

### Recommended Method: Set Root Directory

1. Log in to [Vercel](https://vercel.com/) and click **"Add New..."** → **"Project"**.
2. Select and import the repository: `AVISHJAIN9/orignal-saathi`.
3. In the **Configure Project** screen:
   - **Project Name**: `saathi-frontend` (or any preferred name)
   - **Framework Preset**: Leave as `Other` (or `Vite`)
   - **Root Directory**: Click **Edit** and select:
     ```text
     SAATHI-main-2/frontend/frontend
     ```
     *(Alternatively: `contributors/naisarg/FRONTEND`)*
4. Under **Build and Output Settings**:
   - Build Command: `npm run build` *(auto-populated)*
   - Output Directory: `.vercel/output` *(automatically defined in `vercel.json`)*
   - Install Command: `npm install` *(auto-populated)*
5. Under **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://orignal-saathi-ixw7.onrender.com` | Live backend API URL |
   | `NODE_ENV` | `production` | Production mode |
6. Click **Deploy**.

> **Note**: Even if you leave the **Root Directory** as `./` (repo root), the repository's root `package.json`, `vercel.json`, and `scripts/build-vercel.js` will automatically compile and route the frontend build for Vercel without manual intervention.

---

## 🛠️ Part 2: Deploying Backend to Render

The backend is a NestJS application located in `contributors/naisarg/backend_extra_clean/`.

### Option A: Render Blueprint (1-Click Automated)
1. In your [Render Dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**.
2. Connect `AVISHJAIN9/orignal-saathi`.
3. Render will automatically detect `render.yaml` and configure the Web Service with health check, Docker build, and environment variables.
4. Click **Apply**.

### Option B: New Web Service (Docker)
1. Click **New +** → **Web Service**.
2. Connect `AVISHJAIN9/orignal-saathi`.
3. Choose **Docker** as the Environment:
   - **Dockerfile Path**: `./Dockerfile` (or `contributors/naisarg/backend_extra_clean/Dockerfile`)
   - **Health Check Path**: `/health`
   - **Instance Type**: Free
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3005`
5. Click **Create Web Service**.

### Option C: New Web Service (Native Node.js)
1. Click **New +** → **Web Service**.
2. Connect `AVISHJAIN9/orignal-saathi`.
3. Configure:
   - **Root Directory**: `contributors/naisarg/backend_extra_clean`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Health Check Path**: `/health`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3005`
5. Click **Create Web Service**.

---

## 🔒 Verification & Zero-Error Checkpoints

- [x] **CORS Support**: Backend allows requests from all `*.vercel.app` domains with `credentials: true`.
- [x] **Dynamic Port Binding**: Backend listens on Render's dynamic `process.env.PORT` (defaults to 3005).
- [x] **Favicon Handling**: GET `/favicon.ico` returns `204 No Content` to avoid unnecessary 404 or logging noise.
- [x] **SSR / Nitro Preset**: Frontend detects `VERCEL=1` and dynamically applies the `vercel` preset, outputting to `.vercel/output`.
- [x] **Fallback API URL**: Frontend automatically defaults `VITE_API_BASE_URL` to `https://orignal-saathi-ixw7.onrender.com` when not explicitly provided.
