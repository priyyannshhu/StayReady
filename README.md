# Stay Ready – Smart Airbnb Booking Platform with Machine Learning Price Prediction

A full-stack application that revolutionizes the Airbnb experience with intelligent pricing predictions powered by machine learning.

## 🏠 Project Overview

Stay Ready is a comprehensive vacation rental platform that combines modern web technologies with machine learning to provide:
- **Property Exploration**: Browse and discover amazing properties
- **Smart Booking**: Seamless booking experience with confirmation
- **AI-Powered Pricing**: ML-driven price recommendations for hosts
- **Host Dashboard**: Complete property management interface

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for modern, responsive styling
- **React Router** for navigation

### Backend
- **Node.js** runtime
- **Express.js** framework
- **MongoDB** with Mongoose ODM
- **RESTful APIs** for data management

### Machine Learning Service
- **Python** with FastAPI
- **Scikit-learn** for ML models
- **RandomForestRegressor** for price prediction
- **Pandas** for data manipulation

### Database
- **MongoDB** for flexible data storage
- **Mongoose** for schema management

## 📁 Project Structure

```
stay-ready/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   └── BookingModal.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Explore.tsx
│   │   │   ├── HostDashboard.tsx
│   │   │   ├── PropertyDetail.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js Express API
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env.example
├── ml-service/              # Python ML service
│   ├── main.py              # FastAPI application
│   ├── train_model.py       # Model training script
│   ├── requirements.txt     # Python dependencies
│   └── models/              # Trained model files
├── database/                # Database utilities
│   └── init.js             # Database initialization
├── docs/                   # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd stay-ready
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

#### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```
The backend API will be available at `http://localhost:5000`

#### 4. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt
python train_model.py  # Train the ML model
python main.py         # Start the ML service
```
The ML service will be available at `http://localhost:8000`

#### 5. Database Setup
```bash
# Make sure MongoDB is running
cd database
node init.js  # Initialize with sample data
```

## 🌟 Features

### User Experience
- **Property Discovery**: Browse properties with beautiful cards
- **Advanced Filtering**: Filter by location, price, amenities
- **Detailed Views**: Comprehensive property information
- **Booking Flow**: Seamless booking with date selection
- **Confirmation**: Instant booking confirmation with details

### Host Experience
- **Property Management**: Add and manage listings
- **AI Price Prediction**: Get intelligent pricing recommendations
- **Confidence Scores**: Understand prediction reliability
- **Amenity Management**: Easy amenity selection

### Technical Features
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live price predictions
- **RESTful APIs**: Clean, scalable backend
- **Machine Learning**: Advanced price prediction
- **Modern UI/UX**: Beautiful, intuitive interface

## 🤖 Machine Learning Model

### Price Prediction Features
The ML model predicts Airbnb prices based on:
- **Location**: Geographic price multipliers
- **Bedrooms**: Number of sleeping rooms
- **Bathrooms**: Number of bathrooms
- **Area**: Property size in square feet
- **Amenities**: Available facilities and features

### Model Architecture
- **Algorithm**: RandomForestRegressor
- **Training Data**: Synthetic dataset mimicking real Airbnb data
- **Features**: 5 key property attributes
- **Performance**: ~85% R² score on test data
- **Confidence**: Prediction confidence scores based on tree variance

### Model Training
```bash
cd ml-service
python train_model.py
```
This will:
1. Generate synthetic training data
2. Train the RandomForest model
3. Save the model to `models/price_model.pkl`
4. Display performance metrics

## 📡 API Endpoints

### Backend APIs (Port 5000)
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `POST /api/predict-price` - Get price prediction
- `GET /api/health` - Health check

### ML Service APIs (Port 8000)
- `GET /` - Service information
- `GET /health` - Health check
- `POST /predict` - Predict property price
- `GET /locations` - Get available locations
- `POST /train` - Retrain model

## 🎯 User Flow

### Guest Flow
1. **Explore** → Browse property listings
2. **PropertyCard** → View property details
3. **BookingModal** → Select dates and guests
4. **Payment** → Confirm booking (mock)
5. **BookingConfirmed** → Receive confirmation

### Host Flow
1. **HostDashboard** → Access management panel
2. **Add Property** → Enter property details
3. **AI Prediction** → Get price recommendations
4. **List Property** → Publish listing

## 🔧 Development

### Running in Development Mode

1. **Start all services**:
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - ML Service
cd ml-service && python main.py
```

2. **Initialize database** (one-time):
```bash
cd database && node init.js
```

### Environment Variables

Backend `.env`:
```
MONGODB_URI=mongodb://localhost:27017/stay-ready
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### ML Service Testing
```bash
cd ml-service
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 800,
    "amenities": ["WiFi", "Kitchen", "Parking"]
  }'
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy with `npm start`

### ML Service (Railway/Render)
1. Install requirements
2. Run with `python main.py`

### Database (MongoDB Atlas)
1. Create cluster
2. Update connection string
3. Initialize with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for AI assistance in development
- Unsplash for beautiful property images
- FastAPI team for excellent Python web framework
- React and Vite communities for modern frontend tools

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Email: support@stayready.dev
- Documentation: Check the `/docs` folder

---

**Stay Ready** - Your intelligent vacation rental platform! 🏖️✨
