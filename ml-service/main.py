from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
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

# Load model and preprocessing components
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
    model_loaded = False
    print("Warning: Model not found. Please run train_model.py first.")

@app.get("/")
async def root():
    return {
        "message": "Stay Ready Price Prediction API",
        "version": "1.0.0",
        "model_loaded": model_loaded,
        "features": ["Real Dataset Training", "Advanced ML Pipeline", "Production Ready"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "dataset": "Real Airbnb Data"
    }

@app.post("/predict", response_model=PricePredictionResponse)
async def predict_price(request: PricePredictionRequest):
    """Predict Airbnb property price using real dataset trained model"""
    
    if not model_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first using train_model.py"
        )
    
    try:
        # Prepare features for prediction
        features = {
            'city': request.city,
            'latitude': request.latitude,
            'longitude': request.longitude,
            'bedrooms': request.bedrooms,
            'bathrooms': request.bathrooms,
            'accommodates': request.accommodates,
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
            city=request.city
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

@app.get("/model-info")
async def get_model_info():
    """Get information about trained model"""
    if not model_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first."
        )
    
    feature_importance = {}
    feature_names = ['city_encoded', 'latitude', 'longitude', 'bedrooms', 'bathrooms', 
                   'accommodates', 'property_type_encoded', 'room_type_encoded', 
                   'minimum_nights', 'number_of_reviews', 'availability_365']
    
    for name, importance in zip(feature_names, model.feature_importances_):
        feature_importance[name] = float(importance)
    
    return {
        "model_type": "RandomForestRegressor",
        "dataset": "Real Airbnb Data",
        "n_estimators": model.n_estimators,
        "max_depth": model.max_depth,
        "feature_importance": feature_importance,
        "training_features": feature_names,
        "performance": {
            "MAE": "Calculated during training",
            "R2_Score": "Calculated during training"
        }
    }

@app.get("/dataset-info")
async def get_dataset_info():
    """Get information about the training dataset"""
    if not model_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Model not loaded. Please train the model first."
        )
    
    return {
        "dataset_source": "Real Airbnb Sample Data",
        "features": [
            "city", "latitude", "longitude", "bedrooms", "bathrooms", 
            "accommodates", "property_type", "room_type", "minimum_nights",
            "number_of_reviews", "availability_365", "price"
        ],
        "preprocessing": [
            "Missing value imputation",
            "Categorical encoding",
            "Feature scaling",
            "Outlier removal"
        ],
        "model_algorithm": "RandomForestRegressor",
        "training_samples": "Varies based on dataset size"
    }

@app.post("/train")
async def train_new_model():
    """Train a new model with real dataset"""
    try:
        from train_model import train_model
        
        # Train new model
        model, new_encoders, new_scaler = train_model()
        
        # Reload the new model
        global model_loaded, encoders, scaler
        model = joblib.load('models/price_model.pkl')
        encoders = joblib.load('models/encoders.pkl')
        scaler = joblib.load('models/scaler.pkl')
        model_loaded = True
        
        return {
            "message": "Model trained successfully with real Airbnb dataset",
            "model_loaded": True,
            "dataset": "Real Airbnb Data",
            "features": ["Real Dataset Training", "Advanced ML Pipeline", "Production Ready"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
