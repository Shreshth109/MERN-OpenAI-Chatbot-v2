# MERN OpenAI Chatbot Deployment Guide

## Fixing the 404 and CORS Errors

### Problem Description
You were experiencing two main issues:
1. **404 Error**: Frontend API calls were going to wrong endpoints
2. **CORS Error**: Backend wasn't allowing requests from your new frontend domain

### What I Fixed

#### 1. **404 Error - RESOLVED** ✅
- **Root Cause**: Frontend was calling `/user/login` instead of `/api/v1/user/login`
- **Solution**: Updated all API endpoints in `frontend/src/helpers/api-communicators.ts`
- **Result**: API calls now go to correct backend endpoints

#### 2. **CORS Error - RESOLVED** ✅
- **Root Cause**: Backend CORS didn't include your new frontend domain
- **Solution**: Added `https://mern-openai-chatbot-v2-frontend2.onrender.com` to CORS origins
- **Result**: Backend now accepts requests from your frontend

### Files Modified

#### **Frontend Files** (Push to GitHub)
1. `frontend/src/helpers/api-communicators.ts` - Fixed API endpoints
2. `frontend/src/main.tsx` - Fixed axios configuration
3. `frontend/env.example` - Updated environment setup

#### **Backend Files** (Push to GitHub)
4. `backend/src/app.ts` - Added new frontend domain to CORS
5. `backend/env.example` - Updated environment examples

### Complete Deployment Steps

#### **Step 1: Push Code Changes to GitHub**
```bash
git add .
git commit -m "Fix 404 and CORS errors: Update API endpoints and CORS configuration"
git push origin main
```

#### **Step 2: Backend Deployment (Render)**
1. **Set Environment Variables**:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://mern-openai-chatbot-v2-frontend2.onrender.com
   MONGODB_URL=your_mongodb_atlas_url
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   OPEN_AI_SECRET=your_openai_api_key
   OPENAI_ORGANIZATION_ID=your_organization_id
   ```

2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`

#### **Step 3: Frontend Deployment (Render)**
1. **Set Environment Variable**:
   ```
   VITE_API_BASE_URL=https://mern-openai-chatbot-3-backend.onrender.com
   ```
   **Important**: Do NOT include `/api/v1` at the end!

2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm run preview`

### What This Fixes

- ✅ **404 Errors**: API calls now go to correct backend endpoints
- ✅ **CORS Errors**: Backend accepts requests from your frontend domain
- ✅ **Authentication**: Login/signup should work properly
- ✅ **Chat Functionality**: All API calls should succeed

### Verification

After deployment, check:
1. **No 404 errors** in console
2. **No CORS errors** in console
3. **API calls succeed** in Network tab
4. **Authentication works** (login/signup)
5. **Chat functionality works**

### Current API Endpoints

Your frontend now correctly calls:
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/signup` - User signup
- `GET /api/v1/user/auth-status` - Check authentication
- `POST /api/v1/chat/new` - Send chat message
- `DELETE /api/v1/chat/delete-all-chats` - Delete all chats
- `GET /api/v1/user/logout` - User logout

### Troubleshooting

If you still see errors:

1. **Check Environment Variables**: Ensure all variables are set correctly in both services
2. **Verify URLs**: Make sure frontend and backend URLs match exactly
3. **Check CORS**: Ensure your frontend domain is in the backend CORS origins
4. **Network Tab**: Use browser DevTools to see exactly what's happening

### Your URLs

- **Frontend**: `https://mern-openai-chatbot-v2-frontend2.onrender.com`
- **Backend**: `https://mern-openai-chatbot-3-backend.onrender.com`
- **API Base**: `https://mern-openai-chatbot-3-backend.onrender.com/api/v1`

Both 404 and CORS errors should be completely resolved after deploying these changes! 🎯 