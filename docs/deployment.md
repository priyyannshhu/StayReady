# Stay Ready - Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Stay Ready Airbnb-style booking platform with ML price prediction capabilities to production environments.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Backend API   │    │   ML Service    │
│   (Vercel)     │    │  (Serverless)   │    │   (Render)     │
│   React + TS    │    │   Node.js API   │    │   FastAPI       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                         ┌─────────────────┐
                         │   Database      │
                         │ MongoDB Atlas   │
                         └─────────────────┘
```

## 1. Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Step-by-Step Deployment

#### 1. Environment Configuration
Create environment variables in Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_ML_SERVICE_URL=https://your-ml-service.onrender.com
VITE_ENVIRONMENT=production
```

#### 2. Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod
```

#### 3. Deploy via Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Import the `frontend` directory
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 4. Vercel Configuration
The `vercel.json` file handles:
- Static build optimization
- Route configuration for SPA
- Environment variable mapping

### Build Optimization
- **Code Splitting**: Manual chunks for vendor, router, charts, maps
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Source Maps**: Disabled for production

## 2. Backend Deployment (Vercel Serverless)

### Serverless Functions Structure
```
api/
├── properties/
│   ├── index.ts
│   └── [id].ts
├── bookings/
│   ├── index.ts
│   └── [bookingId].ts
├── users/
│   └── index.ts
├── predict-price/
│   └── index.ts
└── health/
    └── index.ts
```

### Serverless Function Example
```typescript
// api/properties/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Handle GET request
      const properties = await getProperties();
      res.status(200).json(properties);
    } else if (req.method === 'POST') {
      // Handle POST request
      const property = await createProperty(req.body);
      res.status(201).json(property);
    } else {
      res.setHeader('Allow', 'GET, POST');
      res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Database Connection
```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  cachedClient = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = cachedClient.db('stay-ready');
  
  return { client: cachedClient, db: cachedDb };
}
```

## 3. ML Service Deployment (Render)

### Option A: Render Deployment

#### 1. Prepare ML Service
```bash
# Update requirements.txt for production
pip freeze > requirements.vercel.txt
```

#### 2. Deploy to Render
1. Create Render account
2. Connect GitHub repository
3. Create new Web Service
4. Configure deployment settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     ```
     PYTHON_VERSION=3.10
     PORT=8000
     ```

#### 3. Environment Variables
Set in Render dashboard:
```
MODEL_PATH=/app/models
DATASET_PATH=/app/dataset
```

### Option B: Serverless Python (Vercel)

#### 1. Vercel Python Configuration
```python
# api/predict/index.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json

app = FastAPI()

@app.post("/predict")
async def predict_handler(request: dict):
    try:
        # Load model (cached in global scope)
        if not hasattr(app, 'model'):
            app.model = joblib.load('models/price_model.pkl')
        
        # Process prediction
        result = predict_price_sync(request, app.model)
        return JSONResponse(result)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
```

#### 2. Model Optimization for Serverless
```python
# Lightweight prediction function
def predict_price_sync(features, model):
    # Minimal preprocessing for speed
    processed_features = preprocess_features(features)
    prediction = model.predict([processed_features])[0]
    
    return {
        "predicted_price": float(prediction),
        "confidence": calculate_confidence(model, processed_features),
        "city": features.get("city", "Unknown")
    }
```

## 4. Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Sign up for MongoDB Atlas
2. Create new cluster (M0 sandbox is free)
3. Configure network access (0.0.0.0/0 for all IPs)
4. Create database user

### 2. Environment Variables
Set in all services:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stay-ready?retryWrites=true&w=majority
```

### 3. Database Initialization
```javascript
// Initialize collections with indexes
db.properties.createIndex({ "location": 1, "price": 1 });
db.bookings.createIndex({ "bookingId": 1 }, { unique: true });
db.bookings.createIndex({ "propertyId": 1 });
db.users.createIndex({ "email": 1 }, { unique: true });
```

## 5. Payment Integration (Razorpay)

### 1. Production Setup
```javascript
// frontend/src/config/payment.ts
export const RAZORPAY_CONFIG = {
  KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
  CURRENCY: 'INR',
  NAME: 'Stay Ready',
  DESCRIPTION: 'Property Booking',
  THEME: {
    color: '#3399cc'
  }
};
```

### 2. Payment Verification
```javascript
// backend/api/verify-payment.js
const crypto = require('crypto');

export async function verifyPayment(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  
  if (generated_signature === razorpay_signature) {
    // Payment is valid
    await updateBookingStatus(razorpay_order_id, 'Confirmed');
    res.status(200).json({ status: 'success' });
  } else {
    // Payment is invalid
    res.status(400).json({ status: 'failed', error: 'Invalid signature' });
  }
}
```

## 6. Environment Variables Configuration

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend.vercel.app/api
VITE_ML_SERVICE_URL=https://your-ml-service.onrender.com
VITE_ENVIRONMENT=production
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXXXXXXXXX
```

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stay-ready
JWT_SECRET=your-super-secure-jwt-secret
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```

### ML Service (.env)
```bash
PYTHON_VERSION=3.10
MODEL_PATH=/app/models
DATASET_PATH=/app/dataset
LOG_LEVEL=INFO
```

## 7. Local Development Setup

### 1. Clone and Setup
```bash
git clone https://github.com/ashutoshyadav024/airbnb-price-prediction.git
cd airbnb-price-prediction
```

### 2. Start All Services
```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm run dev

# Terminal 2 - Backend
cd backend
npm install
npm start

# Terminal 3 - ML Service
cd ml-service
pip install -r requirements.txt
python train_model.py  # Train model first
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Local Environment Variables
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:8000
VITE_ENVIRONMENT=development

# backend/.env
MONGODB_URI=mongodb://localhost:27017/stay-ready
PORT=5000
JWT_SECRET=local-jwt-secret

# ml-service/.env (optional)
MODEL_PATH=./models
DATASET_PATH=./dataset
```

## 8. Production Checklist

### Security
- [ ] HTTPS enforcement on all endpoints
- [ ] Input validation and sanitization
- [ ] Rate limiting implementation
- [ ] CORS configuration for production domains
- [ ] Environment variables for all secrets
- [ ] JWT token expiration and refresh
- [ ] SQL injection prevention
- [ ] XSS protection

### Performance
- [ ] Database indexing optimization
- [ ] API response caching
- [ ] Image CDN integration
- [ ] Code splitting and lazy loading
- [ ] Service worker for caching
- [ ] Compression enabled
- [ ] Bundle size optimization

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database query monitoring
- [ ] API response time tracking
- [ ] User analytics integration

### Backup & Recovery
- [ ] Automated database backups
- [ ] Model versioning and rollback
- [ ] Disaster recovery plan
- [ ] Data retention policies
- [ ] Redundancy setup

### Testing
- [ ] Unit tests for all components
- [ ] Integration tests for APIs
- [ ] End-to-end testing
- [ ] Load testing
- [ ] Security testing
- [ ] Cross-browser testing

## 9. Deployment Commands

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Vercel Serverless)
```bash
# Deploy entire project
vercel --prod
```

### ML Service (Render)
```bash
# Via Render dashboard or CLI
render deploy
```

### Database (MongoDB Atlas)
```bash
# Via MongoDB Atlas dashboard
# Configure cluster and network access
```

## 10. Troubleshooting

### Common Issues

#### Frontend Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

#### Backend Connection Issues
```bash
# Check MongoDB connection
mongosh "mongodb://localhost:27017/stay-ready"

# Check environment variables
printenv | grep MONGODB
```

#### ML Service Issues
```bash
# Check model files
ls -la models/

# Test prediction endpoint
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"city": "New York", "bedrooms": 2}'
```

### Performance Optimization

#### Database Queries
```javascript
// Use aggregation for complex queries
db.properties.aggregate([
  { $match: { location: city } },
  { $group: { _id: "$propertyType", avgPrice: { $avg: "$price" } }
]);
```

#### API Caching
```javascript
// Implement Redis caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/properties', async (req, res) => {
  const cacheKey = 'properties:list';
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const properties = await getProperties();
  await client.setex(cacheKey, 300, JSON.stringify(properties));
  res.json(properties);
});
```

This deployment guide provides comprehensive instructions for deploying Stay Ready to production environments with proper security, performance, and monitoring considerations.
