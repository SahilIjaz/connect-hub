# Deployment Guide: Render (Backend) + Vercel (Frontend)

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment
1. Push your code to GitHub (already done ✓)
2. Ensure your `.env` is in `.gitignore` (already done ✓)
3. Create a `.env.example` file:

```bash
cd /Users/sahilijaz/Desktop/oldToNew/connect-hub/backend
```

Create `backend/.env.example`:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/connect-hub?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=https://your-frontend-url.vercel.app
```

4. Verify `package.json` has a start script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (`SahilIjaz/connect-hub`)
4. Configure:
   - **Name**: `connect-hub-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free or Paid

### Step 3: Set Environment Variables on Render
1. In your Render dashboard, go to **"Environment"**
2. Add these variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key (change from local one)
   - `CLIENT_URL`: Your Vercel frontend URL (you'll update this after deploying frontend)
   - `PORT`: `10000` (Render assigns dynamic ports)

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Render will automatically deploy when you push to GitHub
3. Note your backend URL: `https://your-service-name.onrender.com`

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Deployment
1. Update `frontend/next.config.js` (if needed for API routes):
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig
```

2. Update all API calls to use the environment variable. Find files calling the backend:
```bash
grep -r "http://localhost:5000" /Users/sahilijaz/Desktop/oldToNew/connect-hub/frontend/
```

Replace with:
```js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/auth/register`, ...)
```

3. Ensure `frontend/package.json` has build script:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Step 2: Create Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository (`SahilIjaz/connect-hub`)
4. Configure:
   - **Framework**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `next build`
   - **Start Command**: `next start`

### Step 3: Set Environment Variables on Vercel
1. In project settings, go to **"Environment Variables"**
2. Add:
   - `NEXT_PUBLIC_API_URL`: `https://your-render-backend-url.onrender.com`

### Step 4: Deploy
1. Click **"Deploy"**
2. Note your frontend URL: `https://your-project.vercel.app`

---

## Part 3: Update Backend Environment Variable

1. Go back to Render dashboard
2. Update `CLIENT_URL` environment variable to your Vercel URL: `https://your-project.vercel.app`
3. Render will automatically redeploy

---

## Troubleshooting

### Backend not connecting to MongoDB
- Verify `MONGO_URI` is correct
- Add Render's IP to MongoDB Atlas whitelist: https://cloud.mongodb.com/v2 → Network Access → Add IP (allow all: 0.0.0.0/0)

### CORS errors
- Check `CLIENT_URL` matches your Vercel domain exactly
- Verify backend CORS middleware has correct origin

### Frontend API calls failing
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Test backend health endpoint: `https://your-backend.onrender.com/api/health`

### Vercel build failing
- Check `build` output in Vercel dashboard
- Ensure TypeScript types are correct
- Verify all imports are correct

---

## Summary of URLs After Deployment

```
Backend:  https://your-service-name.onrender.com
Frontend: https://your-project.vercel.app
```

Update these in your docs and share with users!
