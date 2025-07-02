# Frigga Knowledge Base - Deployment Guide

This document provides detailed instructions for deploying the Frigga Knowledge Base application to production.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features implemented and tested locally
- [ ] Environment variables configured for production
- [ ] CORS settings updated with production URLs
- [ ] Database migrations tested
- [ ] Security review completed

### Accounts Required
- [ ] GitHub account (for code repository)
- [ ] Supabase account (for PostgreSQL database)
- [ ] Render account (for backend hosting)
- [ ] Vercel account (for frontend hosting)

## Step 1: Database Setup (Supabase)

### Create Supabase Project
1. Visit [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose your organization
4. Set project details:
   - **Name**: `frigga-knowledge-base`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Get Database Connection
1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Copy the **URI** format connection string
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`
5. Save this for later use

### Database Security (Optional)
1. Go to **Authentication** → **Policies**
2. Enable RLS (Row Level Security) if needed
3. Configure database access rules

## Step 2: Backend Deployment (Render)

### Prepare Repository
1. **Fork this repository** to your GitHub account
2. Clone your fork locally
3. Update CORS settings in `backend/main.go`:
   ```go
   allowedOrigins := []string{
       "http://localhost:3000",
       "https://your-app-name.vercel.app", // Update this
   }
   ```
4. Commit and push changes

### Deploy on Render
1. Visit [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment settings:
   - **Name**: `frigga-backend`
   - **Environment**: `Docker`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Build Command**: (leave empty - Docker handles this)
   - **Start Command**: (leave empty - Docker handles this)

### Environment Variables
Add these environment variables in Render:

| Key | Value | Description |
|-----|--------|-------------|
| `DATABASE_URL` | Your Supabase connection string | PostgreSQL connection |
| `JWT_SECRET` | Random 32+ character string | JWT token signing |
| `PORT` | `8080` | Server port (Render default) |

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Test health endpoint: `https://your-service.onrender.com/api/health`

## Step 3: Frontend Deployment (Vercel)

### Deploy on Vercel
1. Visit [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Environment Variables
Add this environment variable in Vercel:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://your-render-service.onrender.com` |

### Deploy
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Test your application at the provided Vercel URL

## Step 4: Post-Deployment Configuration

### Update CORS Settings
1. Update `backend/main.go` with your actual Vercel URL
2. Commit and push changes
3. Render will automatically redeploy

### Test Full Application
1. **Backend Health**: Visit `https://your-backend.onrender.com/api/health`
2. **Frontend**: Visit your Vercel URL
3. **Registration**: Create a new user account
4. **Login**: Test authentication
5. **Documents**: Create, edit, and share documents
6. **Search**: Test document search functionality

## Troubleshooting

### Common Issues

#### Backend Issues

**Database Connection Errors**
```
Error: failed to connect to database
```
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure database password is URL-encoded

**CORS Errors**
```
Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked by CORS policy
```
- Update CORS allowedOrigins in `backend/main.go`
- Redeploy backend service
- Clear browser cache

**JWT Secret Errors**
```
JWT_SECRET environment variable not set
```
- Add `JWT_SECRET` to Render environment variables
- Ensure it's at least 32 characters long
- Redeploy service

#### Frontend Issues

**API Connection Errors**
```
Failed to fetch from API
```
- Verify `NEXT_PUBLIC_API_URL` points to correct backend
- Ensure backend is running and accessible
- Check browser network tab for specific errors

**Build Failures**
```
Build failed
```
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct

### Performance Optimization

#### Backend
- Enable Render's HTTP/2 support
- Configure database connection pooling
- Add request rate limiting

#### Frontend
- Verify Vercel's automatic optimizations are enabled
- Check Core Web Vitals in deployment
- Enable Vercel Analytics (optional)

### Monitoring

#### Backend Monitoring
- Render provides built-in metrics
- Set up error alerting in Render dashboard
- Monitor database performance in Supabase

#### Frontend Monitoring
- Vercel provides performance analytics
- Monitor Core Web Vitals
- Set up custom error tracking (optional)

## Production Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
JWT_SECRET=your-32-character-secret-key
PORT=8080
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Database**: Enable connection SSL in production
4. **CORS**: Only allow necessary origins
5. **HTTPS**: Both platforms enforce HTTPS by default

## Support

For deployment issues:
1. Check this troubleshooting guide
2. Review platform-specific documentation:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
3. Check application logs in respective dashboards 