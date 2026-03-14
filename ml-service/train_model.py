import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def generate_synthetic_data():
    """Generate synthetic Airbnb-like data for training"""
    np.random.seed(42)
    n_samples = 1000
    
    # Locations with different price multipliers
    locations = ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Boston', 'San Francisco', 'Seattle', 'Austin']
    location_multipliers = {
        'New York': 1.8, 'Los Angeles': 1.5, 'Miami': 1.4, 'Chicago': 1.2,
        'Boston': 1.6, 'San Francisco': 2.0, 'Seattle': 1.3, 'Austin': 1.1
    }
    
    data = []
    for i in range(n_samples):
        location = np.random.choice(locations)
        base_price = 50 + np.random.normal(0, 20)
        location_mult = location_multipliers[location]
        
        bedrooms = np.random.randint(1, 6)
        bathrooms = np.random.randint(1, 4)
        area = bedrooms * 200 + np.random.randint(100, 500)
        
        # Calculate price based on features
        bedroom_price = bedrooms * 30
        bathroom_price = bathrooms * 25
        area_price = area * 0.08
        
        # Add amenities impact
        all_amenities = ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Gym', 'Air Conditioning', 'Beach Access', 'Pet Friendly']
        num_amenities = np.random.randint(2, 8)
        amenities = np.random.choice(all_amenities, num_amenities, replace=False).tolist()
        amenity_price = len(amenities) * 8
        
        # Final price with some randomness
        price = (base_price + bedroom_price + bathroom_price + area_price + amenity_price) * location_mult
        price = max(30, price + np.random.normal(0, price * 0.1))  # Add noise and minimum price
        
        data.append({
            'location': location,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'area': area,
            'amenities': len(amenities),
            'price': round(price, 2)
        })
    
    return pd.DataFrame(data)

def train_model():
    """Train the RandomForest model"""
    print("Generating synthetic training data...")
    df = generate_synthetic_data()
    
    # Prepare features
    X = df[['location', 'bedrooms', 'bathrooms', 'area', 'amenities']]
    y = df['price']
    
    # Encode categorical variables
    le = LabelEncoder()
    X['location_encoded'] = le.fit_transform(X['location'])
    X = X.drop('location', axis=1)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    print("Training RandomForest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance:")
    print(f"Mean Absolute Error: ${mae:.2f}")
    print(f"R² Score: {r2:.4f}")
    
    # Save model and encoder
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/price_model.pkl')
    joblib.dump(le, 'models/location_encoder.pkl')
    
    print("Model saved to models/ directory")
    
    # Feature importance
    feature_names = X.columns.tolist()
    importances = model.feature_importances_
    print("\nFeature Importances:")
    for name, importance in zip(feature_names, importances):
        print(f"{name}: {importance:.4f}")
    
    return model, le

if __name__ == "__main__":
    train_model()
