from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import joblib
import numpy as np
from typing import Optional

app = FastAPI(title="Stay Ready Price Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class PricePredictionRequest(BaseModel):
    city: str
    property_type: str
    bedrooms: int
    bathrooms: int
    area: float
    accommodates: Optional[int] = None
    furnishing: Optional[str] = "furnished"
    parking: Optional[bool] = False
    property_age: Optional[int] = 5
    country: Optional[str] = "India"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PricePredictionResponse(BaseModel):
    predicted_price: float
    confidence: float
    city: str
    fallback: bool

# Load model and preprocessing components
model_loaded = False
try:
    model = joblib.load('models/price_model.pkl')
    encoders = joblib.load('models/encoders.pkl')
    scaler = joblib.load('models/scaler.pkl')
    model_loaded = True
    print("Model loaded successfully!")
except FileNotFoundError:
    model = None
    encoders = None
    scaler = None
    print("Warning: Model not found. Using fallback predictions.")

# Indian-market rule-based fallback
def fallback_prediction(request: PricePredictionRequest):
    """Indian-market rule-based fallback pricing"""
    
    # City base prices in INR per night
    city_prices = {
        'mumbai': 8000,
        'delhi': 6500,
        'new delhi': 6500,
        'bangalore': 5500,
        'bengaluru': 5500,
        'hyderabad': 4500,
        'chennai': 4000,
        'kolkata': 3500,
        'pune': 4000,
        'goa': 6000,
        'jaipur': 3500,
        'ahmedabad': 3000
    }
    
    # Property type multipliers
    property_multipliers = {
        'apartment': 1.0,
        'studio': 0.75,
        'condo': 0.95,
        'house': 1.5,
        'townhouse': 1.3,
        'villa': 2.0,
        'cabin': 0.85,
        'penthouse': 2.5,
        'bungalow': 1.4
    }
    
    # Furnishing multipliers
    furnishing_multipliers = {
        'furnished': 1.0,
        'semi-furnished': 0.88,
        'unfurnished': 0.75
    }
    
    # Find city base price
    city_key = request.city.lower()
    base_price = 3000  # default
    
    for city, price in city_prices.items():
        if city in city_key or city_key in city:
            base_price = price
            break
    
    # Get multipliers
    prop_mult = property_multipliers.get(request.property_type.lower(), 1.0)
    furn_mult = furnishing_multipliers.get(request.furnishing.lower(), 1.0)
    
    # Calculate price
    price = (base_price + 
             request.bedrooms * 800 + 
             request.bathrooms * 500 + 
             (request.area / 100) * 150 + 
             (300 if request.parking else 0))
    
    # Apply multipliers
    price *= prop_mult * furn_mult * max(0.75, 1.0 - request.property_age * 0.01)
    
    return round(price, 2), 0.72

@app.get("/")
async def root():
    return {
        "message": "Stay Ready Price Prediction API",
        "version": "1.0.0",
        "model_loaded": model_loaded
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "dataset": "Real Airbnb Data"
    }

@app.get("/model-info")
async def get_model_info():
    """Get information about trained model"""
    if not model_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first."
        )
    
    return {
        "model_type": "RandomForestRegressor",
        "dataset": "Real Airbnb Data",
        "status": "loaded"
    }

@app.post("/predict", response_model=PricePredictionResponse)
async def predict_price(request: PricePredictionRequest):
    """Predict Airbnb property price using ML model or fallback"""
    
    if not model_loaded:
        # Use fallback prediction
        predicted_price, confidence = fallback_prediction(request)
        return PricePredictionResponse(
            predicted_price=predicted_price,
            confidence=confidence,
            city=request.city,
            fallback=True
        )
    
    try:
        # Prepare features for prediction
        features = {
            'city': request.city,
            'latitude': request.latitude or 19.0760,  # Default Mumbai
            'longitude': request.longitude or 72.8777,
            'bedrooms': request.bedrooms,
            'bathrooms': request.bathrooms,
            'accommodates': request.accommodates or (request.bedrooms + 1),
            'property_type': request.property_type,
            'room_type': 'Entire home/apt',  # Default for prediction
            'minimum_nights': 3,  # Default
            'number_of_reviews': 50,  # Average
            'availability_365': 200  # Average availability
        }
        
        # Encode categorical variables
        encoded_features = []
        feature_names = []
        
        for key, value in features.items():
            if key in encoders:
                # Handle unseen categories
                if value not in encoders[key].classes_:
                    # Use most common category for unseen values
                    encoded_value = 0
                else:
                    encoded_value = encoders[key].transform([str(value)])[0]
                encoded_features.append(encoded_value)
                feature_names.append(f"{key}_encoded")
            else:
                encoded_features.append(value)
                feature_names.append(key)
        
        # Reshape for prediction
        features_array = np.array(encoded_features).reshape(1, -1)
        
        # Scale features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        
        # Calculate confidence based on prediction variance
        tree_predictions = []
        for estimator in model.estimators_:
            tree_predictions.append(estimator.predict(features_scaled)[0])
        
        prediction_std = np.std(tree_predictions)
        confidence = max(0.7, min(0.95, 1.0 - (prediction_std / max(prediction, 1))))
        
        return PricePredictionResponse(
            predicted_price=round(float(prediction), 2),
            confidence=round(float(confidence), 3),
            city=request.city,
            fallback=False
        )
        
    except ValueError as e:
        if "unknown" in str(e).lower():
            raise HTTPException(
                status_code=400,
                detail=f"Unknown category in input. Available cities: {list(encoders['city'].classes_)}, Property types: {list(encoders['property_type'].classes_)}"
            )
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
