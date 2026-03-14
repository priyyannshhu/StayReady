# Stay Ready - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Stay Ready Airbnb-style booking platform with ML price prediction capabilities. The system consists of three main components that need to be deployed and configured.

## System Requirements

### Minimum Requirements
- **Node.js**: 16.x or higher
- **Python**: 3.8 or higher
- **MongoDB**: 4.4 or higher
- **RAM**: 4GB minimum
- **Storage**: 10GB free space

### Recommended Requirements
- **Node.js**: 18.x LTS
- **Python**: 3.10 or higher
- **MongoDB**: 5.0 or higher
- **RAM**: 8GB or higher
- **Storage**: 20GB free space

## Local Development Setup

### 1. Prerequisites Installation

#### Node.js and npm
```bash
# Install Node.js (includes npm)
# Download from https://nodejs.org or use version manager
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### Python and pip
```bash
# Install Python (Windows)
# Download from https://python.org

# Install Python (macOS)
brew install python3

# Install Python (Ubuntu/Debian)
sudo apt update
sudo apt install python3 python3-pip

# Verify installation
python --version
pip --version
```

#### MongoDB
```bash
# Install MongoDB (Windows)
# Download from https://mongodb.com

# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Install MongoDB (Ubuntu/Debian)
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Project Setup

#### Clone Repository
```bash
git clone https://github.com/sabhisheksingh/airbnb-price-prediction.git
cd airbnb-price-prediction
```

#### Frontend Setup (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Environment variables (create .env file)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Access at http://localhost:5173
```

#### Backend Setup (Node.js + Express)
```bash
cd backend

# Install dependencies
npm install

# Environment variables (create .env file)
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start

# Access at http://localhost:5000
```

#### ML Service Setup (Python + FastAPI)
```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py

# Start ML service
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Access at http://localhost:8000
```

### 3. Database Initialization

#### MongoDB Setup
```bash
# Start MongoDB service
sudo systemctl start mongod

# Connect to MongoDB
mongo

# Create database and collections (handled automatically by backend)
# The backend will initialize demo data on first run
```

#### Verify Database Connection
```bash
# Check backend logs for MongoDB connection
# Should see "Connected to MongoDB" message
```

## Production Deployment

### 1. Environment Configuration

#### Frontend Environment (.env)
```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_ML_SERVICE_URL=https://your-ml-domain.com
```

#### Backend Environment (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 2. Frontend Deployment (Vercel/Netlify)

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### Netlify Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy dist folder to Netlify
# Or use Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Manual Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy dist folder to web server
rsync -av dist/ user@server:/var/www/stay-ready/
```

### 3. Backend Deployment (Heroku/DigitalOcean)

#### Heroku Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create stay-ready-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git subtree push --prefix backend heroku main
```

#### DigitalOcean App Platform
```bash
# Create appspec.yml
# Configure through DigitalOcean dashboard
# Deploy using GitHub integration
```

#### Docker Deployment
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t stay-ready-backend ./backend
docker run -p 5000:5000 stay-ready-backend
```

### 4. ML Service Deployment (AWS/GCP)

#### AWS Lambda Deployment
```python
# ml-service/lambda_handler.py
import json
import joblib
from main import predict_price

model = joblib.load('models/price_model.pkl')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        result = predict_price(body)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

#### Google Cloud Run Deployment
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/project-id/stay-ready-ml

# Deploy to Cloud Run
gcloud run deploy stay-ready-ml \
  --image gcr.io/project-id/stay-ready-ml \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Docker Deployment
```dockerfile
# ml-service/Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python train_model.py

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t stay-ready-ml ./ml-service
docker run -p 8000:8000 stay-ready-ml
```

## Database Deployment

### MongoDB Atlas (Cloud)
```bash
# Create MongoDB Atlas cluster
# Get connection string
# Update backend .env with MONGODB_URI

# Example connection string
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/stay-ready?retryWrites=true&w=majority"
```

### Self-hosted MongoDB
```bash
# Install MongoDB on server
sudo apt install -y mongodb

# Configure security
# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})

# Enable authentication
# Edit /etc/mongod.conf
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

## SSL/HTTPS Configuration

### Frontend (Vercel/Netlify)
- Automatic SSL certificate provided
- No additional configuration needed

### Backend (Nginx + Let's Encrypt)
```nginx
# /etc/nginx/sites-available/stay-ready-api
server {
    listen 80;
    server_name your-api-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-api-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-api-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-api-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Logging

### Application Monitoring
```bash
# PM2 for Node.js process management
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name stay-ready-api

# Monitor
pm2 monit

# Logs
pm2 logs stay-ready-api
```

### Health Checks
```bash
# Backend health
curl https://your-api-domain.com/api/health

# ML service health
curl https://your-ml-domain.com/health

# Frontend availability
curl -I https://your-frontend-domain.com
```

## Performance Optimization

### Frontend Optimization
```bash
# Build with optimization
cd frontend
npm run build

# Analyze bundle size
npm run build -- --analyze

# Enable compression (nginx)
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### Backend Optimization
```bash
# Enable compression (Express)
const compression = require('compression');
app.use(compression());

# Database indexing
db.properties.createIndex({ "location": 1, "price": 1 });
db.bookings.createIndex({ "bookingId": 1 });
```

## Security Configuration

### Environment Variables
```bash
# Use strong, unique secrets
JWT_SECRET=$(openssl rand -base64 32)
RAZORPAY_KEY_SECRET=your-actual-secret-key

# Never commit secrets to version control
# Add .env to .gitignore
```

### CORS Configuration
```javascript
// Production CORS setup
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :5000
netstat -tulpn | grep :8000

# Kill processes
sudo kill -9 <PID>
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

#### ML Service Issues
```bash
# Check Python dependencies
pip freeze

# Reinstall requirements
pip install -r requirements.txt --force-reinstall

# Verify model files
ls -la models/
```

### Debug Mode
```bash
# Frontend debug
cd frontend
npm run dev

# Backend debug
cd backend
DEBUG=* npm start

# ML service debug
cd ml-service
uvicorn main:app --reload --log-level debug
```

## Backup and Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/database" --out=/backup/path

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"
```

### Application Backup
```bash
# Backup code and configuration
tar -czf stay-ready-backup-$(date +%Y%m%d).tar.gz \
  frontend/ backend/ ml-service/ .env*

# Backup to cloud storage
aws s3 cp stay-ready-backup-$(date +%Y%m%d).tar.gz s3://backup-bucket/
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Multiple backend instances
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategies
- Monitor resource usage

This deployment guide provides comprehensive instructions for deploying Stay Ready in both development and production environments with proper security, monitoring, and scaling considerations.
