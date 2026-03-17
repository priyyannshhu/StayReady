# Stay Ready - Fresh Deployment Guide

## Prerequisites
- GitHub repository with all code pushed
- Render.com account (for backend & ML service)
- Vercel/Netlify account (for frontend)
- MongoDB Atlas account (for database)

## Step 1: ML Service Deployment

### Render.com Setup
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `priyyannshhu/StayReady`
4. Configure:
   - **Name**: stayready-ml
   - **Root Directory**: `ml-service`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
   - **Instance Type**: Free

### Environment Variables for ML Service
```
PYTHON_VERSION=3.11.0
PORT=8000
```

## Step 2: Backend Deployment

### Render.com Setup
1. Create another "Web Service"
2. Configure:
   - **Name**: stayready-api
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`

### Environment Variables for Backend
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ML_SERVICE_URL=https://your-ml-service-url.onrender.com
```

## Step 3: Frontend Deployment

### Vercel Setup
1. Connect GitHub repository to Vercel
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_ML_SERVICE_URL=https://your-ml-service-url.onrender.com
VITE_ENVIRONMENT=production
```

## Step 4: Database Setup

### MongoDB Atlas
1. Create free cluster at https://www.mongodb.com/atlas
2. Create database user with password
3. Whitelist IP addresses (0.0.0.0/0 for cloud access)
4. Get connection string: `mongodb+srv://...`
5. Add to backend environment variables

## Step 5: Testing

### Health Checks
```bash
# ML Service
curl https://your-ml-service-url.onrender.com/health

# Backend
curl https://your-backend-url.onrender.com/api/health

# Full Prediction Test
curl -X POST https://your-backend-url.onrender.com/api/predict-price \
  -H "Content-Type: application/json" \
  -d '{"city":"Mumbai","property_type":"apartment","bedrooms":2,"bathrooms":2,"area":1000,"furnishing":"furnished","parking":true,"property_age":5,"accommodates":4}'
```

## Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ML service uses port 8000, backend uses 5000
2. **CORS Issues**: Check that backend allows frontend origin
3. **Database Connection**: Verify MongoDB connection string format
4. **Environment Variables**: Double-check spelling and values

### Logs
- Render Dashboard: View logs for each service
- Check build logs for dependency installation issues
- Monitor runtime logs for API errors

## Production URLs (After Deployment)
- ML Service: https://your-ml-service-url.onrender.com
- Backend API: https://your-backend-url.onrender.com/api
- Frontend: https://your-frontend-url.vercel.app
