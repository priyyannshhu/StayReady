# 🚀 StayReady Deployment Guide

This guide will help you deploy the complete Property Management Platform with AI Price Prediction.

## 📋 Prerequisites
- GitHub repository: https://github.com/priyyannshhu/StayReady
- Netlify account (for frontend)
- Render account (for backend & ML service)
- All code pushed to GitHub main branch ✅

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Connect Netlify to GitHub
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub account
4. Select the `StayReady` repository
5. Choose the `main` branch

### Step 2: Configure Build Settings
```
Build command: npm run build
Publish directory: frontend/dist
```

### Step 3: Environment Variables
Add these environment variables in Netlify dashboard:
```
VITE_API_URL=http://your-backend-url.onrender.com
VITE_ML_SERVICE_URL=http://your-ml-service-url.onrender.com
```

### Step 4: Deploy
- Click "Deploy site"
- Netlify will automatically build and deploy your frontend
- Your site will be available at: `https://your-site-name.netlify.app`

---

## 🔧 Backend Deployment (Render)

### Step 1: Create Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select `StayReady` repository
5. Configure service settings:

**Service Configuration:**
```
Name: stayready-backend
Environment: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
Instance Type: Free (or paid for production)
```

### Step 2: Environment Variables
Add these environment variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-connection-string
PORT=5000
RAZORPAY_KEY_ID=your-key-id (optional)
RAZORPAY_KEY_SECRET=your-key-secret (optional)
```

### Step 3: Deploy
- Click "Create Web Service"
- Render will build and deploy your backend
- Your API will be available at: `https://stayready-backend.onrender.com`

---

## 🤖 ML Service Deployment (Render)

### Step 1: Create ML Service
1. In Render Dashboard, click "New +" → "Web Service"
2. Select `StayReady` repository
3. Configure ML service settings:

**ML Service Configuration:**
```
Name: stayready-ml-service
Environment: Python
Root Directory: ml-service
Build Command: pip install -r requirements.txt
Start Command: python main.py
Instance Type: Free (or paid for production)
```

### Step 2: Environment Variables
```
PYTHON_VERSION=3.9
```

### Step 3: Deploy
- Click "Create Web Service"
- Your ML service will be available at: `https://stayready-ml-service.onrender.com`

---

## 🔗 Post-Deployment Configuration

### Update Frontend Environment Variables
After deploying backend and ML services, update your Netlify environment variables:
```
VITE_API_URL=https://stayready-backend.onrender.com
VITE_ML_SERVICE_URL=https://stayready-ml-service.onrender.com
```

### Update Backend ML Service URL
In your backend code, update the ML service URL:
```javascript
// In backend/server.js, line 488
const response = await axios.post('https://stayready-ml-service.onrender.com/predict', {
```

### Redeploy Services
1. Push the URL updates to GitHub
2. Netlify and Render will automatically redeploy

---

## ✅ Verification Steps

### Test Frontend
1. Visit your Netlify URL
2. Check if the property management homepage loads
3. Navigate to AI Price Prediction page
4. Test the prediction form

### Test Backend
1. Visit `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"OK","services":{"mongodb":"Connected"}}`

### Test ML Service
1. Visit `https://your-ml-service-url.onrender.com/health`
2. Should return: `{"status":"healthy","model_loaded":false}`

### Test Integration
1. Submit a price prediction from frontend
2. Check if prediction returns successfully
3. Verify confidence scores and analytics display

---

## 🛠️ Troubleshooting

### Common Issues

**Frontend Build Fails:**
```bash
# Check if dependencies are installed
cd frontend
npm install
npm run build
```

**Backend Connection Issues:**
- Check MongoDB connection string
- Verify environment variables
- Check Render service logs

**ML Service Issues:**
- Verify Python requirements installation
- Check model files in `ml-service/models/`
- Review Render service logs

**CORS Issues:**
Add this to your backend:
```javascript
app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

## 📊 Monitoring

### Render Dashboard
- Monitor service logs
- Check resource usage
- Set up alert notifications

### Netlify Dashboard
- Monitor build logs
- Check deployment status
- Set up form submissions (if needed)

---

## 🎉 Success!

Once deployed, you'll have:
- **Frontend**: Property Management Platform on Netlify
- **Backend**: REST API with MongoDB on Render  
- **ML Service**: AI Price Prediction on Render
- **Integration**: Full end-to-end functionality

Your Property Management Platform will be live and accessible to users worldwide! 🏠✨
