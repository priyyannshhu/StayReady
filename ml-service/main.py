from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os
from typing import List

app = FastAPI(title="Stay Ready Price Prediction API", version="1.0.0")

# Pydantic models for request/response
class PricePredictionRequest(BaseModel):
    location: str
    bedrooms: int
    bathrooms: int
    area: int
    amenities: List[str]

class PricePredictionResponse(BaseModel):
    predictedPrice: float
    confidence: float
    location: str
    features: dict

# Load model and encoder
try:
    model = joblib.load('models/price_model.pkl')
    location_encoder = joblib.load('models/location_encoder.pkl')
    model_loaded = True
except FileNotFoundError:
    model = None
    location_encoder = None
    model_loaded = False
    print("Warning: Model not found. Please run train_model.py first.")

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
        "model_loaded": model_loaded
    }

@app.post("/predict", response_model=PricePredictionResponse)
async def predict_price(request: PricePredictionRequest):
    """Predict Airbnb property price based on features"""
    
    if not model_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first."
        )
    
    try:
        # Prepare features
        location_encoded = location_encoder.transform([request.location])[0]
        amenities_count = len(request.amenities)
        
        features = np.array([[
            location_encoded,
            request.bedrooms,
            request.bathrooms,
            request.area,
            amenities_count
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Calculate confidence based on prediction variance
        # Using tree variance as a proxy for confidence
        tree_predictions = []
        for estimator in model.estimators_:
            tree_predictions.append(estimator.predict(features)[0])
        
        prediction_std = np.std(tree_predictions)
        confidence = max(0.5, min(0.95, 1.0 - (prediction_std / prediction)))
        
        return PricePredictionResponse(
            predictedPrice=round(float(prediction), 2),
            confidence=round(float(confidence), 3),
            location=request.location,
            features={
                "bedrooms": request.bedrooms,
                "bathrooms": request.bathrooms,
                "area": request.area,
                "amenities_count": amenities_count,
                "location_encoded": int(location_encoded)
            }
        )
        
    except ValueError as e:
        if "unknown" in str(e).lower():
            raise HTTPException(
                status_code=400,
                detail=f"Unknown location '{request.location}'. Available locations: {list(location_encoder.classes_)}"
            )
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/locations")
async def get_available_locations():
    """Get list of available locations for prediction"""
    if not model_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first."
        )
    
    return {
        "locations": list(location_encoder.classes_)
    }

@app.post("/train")
async def train_new_model():
    """Train a new model (for development/testing)"""
    try:
        from train_model import train_model
        
        # Train new model
        model, encoder = train_model()
        
        # Reload the new model
        global model_loaded, location_encoder
        model = joblib.load('models/price_model.pkl')
        location_encoder = joblib.load('models/location_encoder.pkl')
        model_loaded = True
        
        return {
            "message": "Model trained successfully",
            "model_loaded": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
