# HemoLink Deployment Guide

This guide covers deploying HemoLink to production using Render (backend) and Vercel (frontend).

## Prerequisites

- MongoDB Atlas account (free tier works)
- Render account (free tier available)
- Vercel account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Overview

1. **Backend**: Deployed on Render (Node.js)
2. **Frontend**: Deployed on Vercel (React)
3. **Database**: MongoDB Atlas (cloud database)

---

## Step 1: Deploy Backend on Render

### 1.1 Prepare Your Code

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Ensure `backend/render.yaml` exists in your repository

### 1.2 Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with username and password
4. Add your IP to Network Access whitelist (or allow all: 0.0.0.0/0)
5. Get your connection string from "Connect" → "Drivers" → "Node.js"

### 1.3 Deploy on Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select the `backend` folder as root directory
5. Configure:
   - **Name**: hemolink-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong secret (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `FRONTEND_URL`: Will be set after frontend deployment (e.g., `https://hemolink-frontend.vercel.app`)
   - `PORT`: 10000 (Render's default)
7. Click "Deploy Web Service"

### 1.4 Note the Backend URL

After deployment, Render will provide a URL like:
```
https://hemolink-backend.onrender.com
```
Save this URL for the frontend deployment.

---

## Step 2: Deploy Frontend on Vercel

### 2.1 Prepare Your Code

1. Ensure `frontend/vercel.json` exists in your repository
2. Push your code to Git if not already done

### 2.2 Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://hemolink-backend.onrender.com`)
   - `REACT_APP_SOCKET_URL`: Your Render backend URL (e.g., `https://hemolink-backend.onrender.com`)
6. Click "Deploy"

### 2.3 Note the Frontend URL

After deployment, Vercel will provide a URL like:
```
https://hemolink-frontend.vercel.app
```

---

## Step 3: Update Backend CORS Configuration

1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to "Environment" section
4. Update `FRONTEND_URL` to your Vercel frontend URL:
   ```
   FRONTEND_URL=https://hemolink-frontend.vercel.app
   ```
5. Save changes (Render will automatically redeploy)

---

## Step 4: Verify Deployment

### 4.1 Test Backend

1. Visit your backend URL: `https://hemolink-backend.onrender.com/api/health`
2. Should return: `{"success":true,"message":"HemoLink API is running"}`

### 4.2 Test Frontend

1. Visit your frontend URL: `https://hemolink-frontend.vercel.app`
2. Should see the HemoLink landing page
3. Test registration and login
4. Test creating a blood request
5. Test chat functionality

---

## Security Best Practices

### Backend Security

✅ **Implemented:**
- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Password hashing with bcrypt
- Input validation with express-validator

### Additional Recommendations:

1. **Rate Limiting**: Add `express-rate-limit` to prevent API abuse
2. **HTTPS**: Render provides HTTPS by default
3. **Environment Variables**: Never commit `.env` files
4. **MongoDB Security**: Use IP whitelisting in MongoDB Atlas
5. **JWT Secret**: Use a strong, randomly generated secret

### Frontend Security

✅ **Implemented:**
- Protected routes
- Token storage in localStorage
- Axios interceptors for authentication

### Additional Recommendations:

1. **Content Security Policy**: Already configured via Helmet
2. **XSS Protection**: React escapes JSX by default
3. **HTTPS**: Vercel provides HTTPS by default

---

## Mobile Responsiveness

The application is fully mobile-responsive with:

- Mobile-first design approach
- Tailwind CSS responsive utilities
- Touch-friendly interface
- Responsive navigation
- WhatsApp-style chat interface

Test on various devices:
- Mobile phones (iOS/Android)
- Tablets
- Desktop browsers

---

## Troubleshooting

### Backend Issues

**Problem**: Server crashes on startup
- **Solution**: Check Render logs for MongoDB connection errors
- **Solution**: Verify `MONGODB_URI` is correct

**Problem**: CORS errors
- **Solution**: Ensure `FRONTEND_URL` matches your Vercel domain exactly
- **Solution**: Check no trailing slashes in URLs

**Problem**: Socket.IO connection fails
- **Solution**: Ensure both `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` are set correctly
- **Solution**: Check Render allows WebSocket connections

### Frontend Issues

**Problem**: Build fails
- **Solution**: Check Vercel build logs
- **Solution**: Ensure all dependencies are in `package.json`

**Problem**: API calls fail
- **Solution**: Verify `REACT_APP_API_URL` is correct
- **Solution**: Check backend is running and accessible

**Problem**: Real-time chat not working
- **Solution**: Verify `REACT_APP_SOCKET_URL` matches backend URL
- **Solution**: Check browser console for Socket.IO errors

---

## Monitoring and Logs

### Render (Backend)

- View logs in Render dashboard
- Monitor metrics (CPU, memory, response time)
- Set up alerts for errors

### Vercel (Frontend)

- View logs in Vercel dashboard
- Monitor build status
- Check analytics for performance

---

## Scaling

### Backend Scaling

- Render automatically scales based on traffic
- Upgrade to paid plans for better performance
- Consider adding Redis for session management

### Frontend Scaling

- Vercel automatically scales globally
- Edge caching for static assets
- CDN included by default

---

## Cost Estimate

### Free Tier (Current)

- **Render**: Free tier (750 hours/month)
- **Vercel**: Free tier (unlimited bandwidth)
- **MongoDB Atlas**: Free tier (512 MB storage)

### Paid Tier (if needed)

- **Render**: Starting at $7/month
- **Vercel**: Starting at $20/month
- **MongoDB Atlas**: Starting at $9/month

---

## Backup and Recovery

### MongoDB Atlas

- Automatic backups included
- Point-in-time recovery available
- Export data regularly

### Code Backup

- Git repository serves as backup
- Regular commits recommended
- Tag releases for easy rollback

---

## Support

For issues:
- Check Render and Vercel documentation
- Review MongoDB Atlas docs
- Check application logs
- Open GitHub issues for bugs

---

## Summary

After completing these steps, your HemoLink application will be:
- ✅ Deployed to production
- ✅ Accessible via HTTPS
- ✅ Mobile-responsive
- ✅ Secure with best practices
- ✅ Scalable for growth
- ✅ Monitored with logs

Your live application URLs:
- Frontend: `https://hemolink-frontend.vercel.app`
- Backend: `https://hemolink-backend.onrender.com`
