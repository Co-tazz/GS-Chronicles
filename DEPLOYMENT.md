# WoW Auction House Dashboard - Deployment Guide

This guide will help you deploy the WoW Auction House Dashboard to production using Vercel for the frontend and Render for the backend.

## Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster for production database
3. **Blizzard API**: Register for Blizzard API credentials
4. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
5. **Render Account**: Sign up at [render.com](https://render.com)

## Backend Deployment (Render)

### 1. Prepare Backend for Deployment

The backend is already configured for production deployment with:
- ✅ `package.json` with proper start script
- ✅ Environment variable support
- ✅ CORS configuration
- ✅ Production-ready middleware (helmet, compression, rate limiting)

### 2. Deploy to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your WoW AH project

2. **Configure Service**:
   - **Name**: `wow-ah-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   Add these environment variables in Render:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wowah
   REGION=us
   BLIZZARD_CLIENT_ID=your_blizzard_client_id
   BLIZZARD_CLIENT_SECRET=your_blizzard_client_secret
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   PORT=4000
   ADMIN_EMAIL=admin@example.com
   ```

4. **Deploy**: Click "Create Web Service"

### 3. Get Backend URL
After deployment, note your backend URL (e.g., `https://wow-ah-backend.onrender.com`)

## Frontend Deployment (Vercel)

### 1. Prepare Frontend for Deployment

The frontend is already configured for production deployment with:
- ✅ Vite build configuration
- ✅ Optimized bundle splitting
- ✅ Environment variable support
- ✅ Production-ready build scripts

### 2. Configure Environment Variables

Create a `.env` file in the `goldspun-chronicles` directory:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### 3. Deploy to Vercel

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `goldspun-chronicles`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**:
   Add in Vercel project settings:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**: Click "Deploy"

## Post-Deployment Setup

### 1. Update CORS Origin
After frontend deployment, update the backend's `CORS_ORIGIN` environment variable in Render with your Vercel URL.

### 2. Database Setup
1. **MongoDB Atlas**:
   - Create a new cluster
   - Set up database user
   - Configure network access (allow all IPs: `0.0.0.0/0` for Render)
   - Get connection string

2. **Seed Data** (Optional):
   - Run the seed script locally pointing to production DB
   - Or manually create initial admin user

### 3. Test Deployment
1. Visit your Vercel URL
2. Test authentication
3. Verify API connectivity
4. Check all major features

## Environment Variables Reference

### Backend (.env)
```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wowah

# Blizzard API
REGION=us
BLIZZARD_CLIENT_ID=your_blizzard_client_id
BLIZZARD_CLIENT_SECRET=your_blizzard_client_secret

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_here

# CORS
CORS_ORIGIN=https://your-frontend-url.vercel.app

# Server
PORT=4000

# Admin
ADMIN_EMAIL=admin@example.com
```

### Frontend (.env)
```bash
# Backend API URL
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CORS_ORIGIN` in backend matches your Vercel URL exactly
   - Check that both HTTP and HTTPS are handled correctly

2. **API Connection Issues**:
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check that backend is running and accessible

3. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Ensure network access is configured for Render's IPs

4. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

### Monitoring

- **Backend**: Monitor logs in Render dashboard
- **Frontend**: Check Vercel function logs and analytics
- **Database**: Monitor MongoDB Atlas metrics

## Security Checklist

- ✅ Strong JWT secret
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ Environment variables secured
- ✅ Database access restricted

## Performance Optimization

- ✅ Gzip compression enabled
- ✅ Bundle splitting configured
- ✅ CDN delivery via Vercel
- ✅ Database indexing
- ✅ Caching strategies implemented

Your WoW Auction House Dashboard is now ready for production! 🚀