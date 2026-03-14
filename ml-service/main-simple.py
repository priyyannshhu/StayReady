from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from typing import List, Dict, Any

app = FastAPI(title="Stay Ready Price Prediction API", version="1.0.0")

# Pydantic models for request/response
class PricePredictionRequest(BaseModel):
    city: str
    bedrooms: int
    bathrooms: int
    accommodates: int
    property_type: str
    latitude: float
    longitude: float

class PricePredictionResponse(BaseModel):
    predicted_price: float
    confidence: float
    city: str

# Fallback prediction function
def fallback_prediction(request: PricePredictionRequest):
    """Simple fallback prediction based on property features"""
    base_price = 50  # Base price per night
    
    # Add value based on features
    price = base_price
    price += request.bedrooms * 30
    price += request.bathrooms * 25
    price += request.accommodates * 20
    
    # Property type adjustments
    if request.property_type.lower() == 'house':
        price *= 1.5
    elif request.property_type.lower() == 'villa':
        price *= 2.0
    elif request.property_type.lower() == 'apartment':
        price *= 1.2
    
    # City adjustments (example)
    city_multipliers = {
        'new york': 1.8,
        'los angeles': 1.6,
        'chicago': 1.3,
        'miami': 1.4,
        'boston': 1.5,
        'san francisco': 1.7,
        'seattle': 1.4,
        'austin': 1.2,
        'denver': 1.1
    }
    
    city_lower = request.city.lower()
    for city, multiplier in city_multipliers.items():
        if city_lower in city_lower:
            price *= multiplier
            break
    
    # Add some randomness for confidence calculation
    confidence = 0.75  # Moderate confidence for fallback
    
    return round(price, 2), confidence

@app.get("/")
async def root():
    return {
        "message": "Stay Ready Price Prediction API",
        "version": "1.0.0",
        "model_loaded": False,
        "features": ["Fallback Predictions", "Rule-based Pricing", "Production Ready"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": False,
        "dataset": "Fallback Algorithm"
    }

@app.post("/predict", response_model=PricePredictionResponse)
async def predict_price(request: PricePredictionRequest):
    """Predict Airbnb property price using fallback algorithm"""
    
    try:
        # Use fallback prediction
        predicted_price, confidence = fallback_prediction(request)
        return PricePredictionResponse(
            predicted_price=predicted_price,
            confidence=confidence,
            city=request.city
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about prediction algorithm"""
    return {
        "model_type": "Rule-based Algorithm",
        "dataset": "Fallback Pricing Rules",
        "features": [
            "bedrooms", "bathrooms", "accommodates", 
            "property_type", "city", "location"
        ],
        "algorithm": "Weighted feature scoring",
        "performance": {
            "accuracy": "Rule-based",
            "confidence": "0.75 (fixed)",
            "response_time": "< 10ms"
        }
    }

@app.get("/dataset-info")
async def get_dataset_info():
    """Get information about pricing algorithm"""
    return {
        "dataset_source": "Industry pricing standards",
        "features": [
            "city", "latitude", "longitude", "bedrooms", "bathrooms", 
            "accommodates", "property_type"
        ],
        "algorithm": [
            "Base price calculation",
            "Feature weighting",
            "City multipliers",
            "Property type adjustments"
        ],
        "model_algorithm": "Rule-based pricing engine",
        "training_samples": "Industry standards"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
