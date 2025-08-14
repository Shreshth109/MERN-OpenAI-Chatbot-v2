# MERN OpenAI Chatbot Deployment Guide

## Fixing the 404 Error

### Problem Description
The 404 error you're experiencing is caused by a mismatch between your frontend API calls and backend route configuration.

**Root Cause:**
- Backend routes are configured at `/api/v1/user` and `/api/v1/chat`
- Frontend was making API calls to relative URLs like `/user/login` instead of `/api/v1/user/login`
- This caused the frontend to try to call these endpoints on the frontend domain instead of the backend domain

### What I Fixed

1. **Updated API Communicators** (`frontend/src/helpers/api-communicators.ts`):
   - Changed all API endpoints to include `/api/v1` prefix
   - Example: `/user/login` → `/api/v1/user/login`

2. **Updated Main Configuration** (`frontend/src/main.tsx`):
   - Fixed axios baseURL configuration
   - Removed `/api/v1` from the base URL since it's now in each API call

3. **Updated Environment Configuration** (`frontend/env.example`):
   - Corrected the backend URL format
   - Added clear instructions about the `/api/v1` prefix

### Deployment Steps

#### 1. Backend Deployment (Render)
- Your backend is already correctly configured
- Routes are properly set up at `/api/v1/user` and `/api/v1/chat`
- CORS is configured to allow your frontend domain

#### 2. Frontend Deployment (Render)

**Step 1: Set Environment Variables**
In your Render frontend service, add this environment variable:
```
VITE_API_BASE_URL=https://mern-openai-chatbot-3-backend.onrender.com
```

**Important Notes:**
- Do NOT include `/api/v1` at the end of the URL
- The `/api/v1` prefix is now automatically added to all API calls
- Your backend URL should end with `.onrender.com` (not `.onrender.com/api/v1`)

**Step 2: Rebuild and Deploy**
- Commit and push your changes to GitHub
- Render will automatically rebuild and deploy your frontend
- The 404 errors should be resolved

### Verification

After deployment, check your browser console:
1. **No more 404 errors** for API calls
2. **API calls should go to**: `https://mern-openai-chatbot-3-backend.onrender.com/api/v1/user/login`
3. **Not to**: `https://mern-openai-chatbot-3-frontend.onrender.com/user/login`

### Current API Endpoints

Your frontend now correctly calls these backend endpoints:
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/signup` - User signup
- `GET /api/v1/user/auth-status` - Check authentication
- `POST /api/v1/chat/new` - Send chat message
- `DELETE /api/v1/chat/delete-all-chats` - Delete all chats
- `GET /api/v1/user/logout` - User logout

### Troubleshooting

If you still see 404 errors:

1. **Check Environment Variables**: Ensure `VITE_API_BASE_URL` is set correctly in Render
2. **Verify Backend URL**: Make sure your backend is accessible at the specified URL
3. **Check CORS**: Ensure your backend CORS configuration includes your frontend domain
4. **Network Tab**: Use browser DevTools to see exactly which URLs are being called

### Development vs Production

- **Development**: `http://localhost:5000` (no environment variable needed)
- **Production**: `https://mern-openai-chatbot-3-backend.onrender.com` (set via `VITE_API_BASE_URL`)

The code automatically handles both environments based on the environment variable. 