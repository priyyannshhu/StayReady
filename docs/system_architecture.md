# Stay Ready - System Architecture

## Overview

Stay Ready is a full-stack Airbnb-style booking platform with ML-powered price prediction capabilities. The system consists of three main components working together to provide a seamless property booking experience with intelligent pricing recommendations.

## Architecture Components

### 1. Frontend (React + TypeScript)
- **Technology**: React 18, TypeScript, Vite, TailwindCSS
- **Purpose**: User interface for property browsing, booking, and host management
- **Key Features**:
  - Property listing and search
  - Interactive booking flow
  - Host dashboard with analytics
  - ML prediction interface
  - Responsive design

### 2. Backend API (Node.js + Express)
- **Technology**: Node.js, Express.js, MongoDB, Mongoose
- **Purpose**: RESTful API server handling business logic
- **Key Features**:
  - Property management
  - Booking processing
  - User management
  - Payment simulation
  - ML service integration

### 3. ML Service (Python + FastAPI)
- **Technology**: Python, FastAPI, Scikit-learn, Pandas
- **Purpose**: Machine learning service for price prediction
- **Key Features**:
  - Real Airbnb dataset training
  - Price prediction API
  - Model performance metrics
  - Feature importance analysis

## Data Flow

```
User Interface (React)
        ↓
    HTTP Requests
        ↓
Backend API (Express)
        ↓
    Database Operations
        ↓
MongoDB Database
        ↓
ML Service (FastAPI)
        ↓
Model Predictions
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  createdAt: Date
}
```

### Properties Collection
```javascript
{
  _id: ObjectId,
  title: String,
  location: String,
  price: Number,
  image: String,
  status: String (Available/Sold Out/Unavailable),
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  amenities: [String],
  description: String,
  hostId: ObjectId (ref: User),
  latitude: Number,
  longitude: Number,
  accommodates: Number,
  propertyType: String,
  roomType: String,
  minimumNights: Number,
  numberOfReviews: Number,
  availability365: Number,
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  bookingId: String (unique),
  propertyId: ObjectId (ref: Property),
  userId: ObjectId (ref: User),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalAmount: Number,
  status: String (Confirmed/Pending/Cancelled),
  paymentStatus: String (Pending/Completed/Failed),
  paymentId: String,
  createdAt: Date
}
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/demo` - Get demo properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:bookingId` - Get booking by ID

### Users
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users

### ML Integration
- `POST /api/predict-price` - Get price prediction
- `GET /api/health` - Health check

### ML Service
- `POST /predict` - Predict property price
- `GET /health` - Service health check
- `GET /model-info` - Model information
- `GET /dataset-info` - Dataset information
- `POST /train` - Train new model

## Machine Learning Pipeline

### Data Sources
- Primary: Real Airbnb dataset (CSV format)
- Fallback: Synthetic data generation
- Features: 11 key property attributes

### Model Training
1. **Data Loading**: Load CSV dataset with property features
2. **Preprocessing**: Handle missing values, encode categoricals
3. **Feature Engineering**: Create derived features
4. **Training**: RandomForestRegressor with 200 estimators
5. **Evaluation**: MAE and R² score metrics
6. **Persistence**: Save model, encoders, and scaler

### Prediction Features
- **Location-based**: City, latitude, longitude
- **Property Details**: Bedrooms, bathrooms, area, accommodates
- **Property Type**: Apartment, House, Condo, Villa
- **Market Data**: Reviews, availability, minimum nights

## Security Considerations

### Current Implementation
- Input validation on all API endpoints
- CORS configuration for frontend access
- Environment variable usage for sensitive data
- Payment simulation (no real payment processing)

### Production Recommendations
- JWT authentication for user sessions
- Rate limiting on API endpoints
- Input sanitization and validation
- HTTPS encryption
- Database connection encryption
- API key management for ML service

## Performance Optimization

### Frontend
- Component lazy loading
- Image optimization and CDN
- State management optimization
- Bundle size reduction

### Backend
- Database indexing on frequently queried fields
- API response caching
- Connection pooling
- Load balancing for high traffic

### ML Service
- Model caching in memory
- Batch prediction capabilities
- Feature preprocessing optimization
- Model versioning

## Deployment Architecture

### Development Environment
```
Frontend (localhost:5173)
    ↓
Backend (localhost:5000)
    ↓
ML Service (localhost:8000)
    ↓
MongoDB (localhost:27017)
```

### Production Recommendations
```
Load Balancer
    ↓
Static CDN (Frontend)
    ↓
API Gateway
    ↓
Microservices (Backend + ML)
    ↓
Managed Database (MongoDB Atlas)
```

## Monitoring and Logging

### Application Monitoring
- API response times
- Error tracking and reporting
- User behavior analytics
- System health checks

### ML Model Monitoring
- Prediction accuracy tracking
- Feature distribution monitoring
- Model performance degradation alerts
- Retraining schedule management

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database sharding capabilities
- Microservice architecture
- Container orchestration (Kubernetes)

### Vertical Scaling
- Resource allocation optimization
- Database performance tuning
- ML model optimization
- Caching strategies

## Technology Stack Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React 18 + TypeScript | User Interface |
| Styling | TailwindCSS | CSS Framework |
| Build Tool | Vite | Development Server |
| Backend | Node.js + Express | API Server |
| Database | MongoDB + Mongoose | Data Storage |
| ML Service | Python + FastAPI | Price Prediction |
| ML Library | Scikit-learn | Machine Learning |
| Data Processing | Pandas + NumPy | Data Manipulation |
| Deployment | Docker (Recommended) | Containerization |

This architecture provides a solid foundation for a scalable, maintainable, and feature-rich property booking platform with intelligent pricing capabilities.
