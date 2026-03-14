import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.impute import SimpleImputer
import joblib
import os

def load_and_preprocess_dataset():
    """Load real Airbnb dataset and perform preprocessing"""
    print("Loading Airbnb dataset...")
    
    # Load dataset
    dataset_path = 'dataset/airbnb_sample.csv'
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Using synthetic data...")
        return generate_synthetic_data()
    
    df = pd.read_csv(dataset_path)
    print(f"Loaded dataset with {len(df)} rows")
    
    # Data preprocessing
    print("Preprocessing data...")
    
    # Handle missing values
    numeric_columns = ['bedrooms', 'bathrooms', 'accommodates', 'minimum_nights', 
                    'number_of_reviews', 'availability_365', 'price']
    categorical_columns = ['city', 'property_type', 'room_type']
    
    # Impute missing values
    imputer_numeric = SimpleImputer(strategy='median')
    imputer_categorical = SimpleImputer(strategy='most_frequent')
    
    df[numeric_columns] = imputer_numeric.fit_transform(df[numeric_columns])
    df[categorical_columns] = imputer_categorical.fit_transform(df[categorical_columns])
    
    # Feature engineering
    df['price_per_accommodate'] = df['price'] / df['accommodates']
    df['bed_bath_ratio'] = df['bedrooms'] / df['bathrooms']
    df['availability_ratio'] = df['availability_365'] / 365
    
    # Remove outliers (prices above 99th percentile)
    price_threshold = df['price'].quantile(0.99)
    df = df[df['price'] <= price_threshold]
    
    print(f"After preprocessing: {len(df)} rows")
    return df

def generate_synthetic_data():
    """Generate synthetic Airbnb-like data as fallback"""
    print("Generating synthetic data...")
    np.random.seed(42)
    n_samples = 2000
    
    cities = ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Boston', 
              'San Francisco', 'Seattle', 'Austin', 'Denver', 'Portland']
    property_types = ['Apartment', 'House', 'Condo', 'Villa']
    room_types = ['Entire home/apt', 'Private room', 'Shared room']
    
    data = []
    for i in range(n_samples):
        city = np.random.choice(cities)
        property_type = np.random.choice(property_types)
        room_type = np.random.choice(room_types)
        
        # Generate coordinates based on city
        city_coords = {
            'New York': (40.7128, -74.0060),
            'Los Angeles': (34.0522, -118.2437),
            'Miami': (25.7617, -80.1918),
            'Chicago': (41.8781, -87.6298),
            'Boston': (42.3601, -71.0589),
            'San Francisco': (37.7749, -122.4194),
            'Seattle': (47.6062, -122.3321),
            'Austin': (30.2672, -97.7431),
            'Denver': (39.7392, -104.9903),
            'Portland': (45.5152, -122.6784)
        }
        
        lat, lng = city_coords[city]
        lat += np.random.normal(0, 0.1)  # Add some variation
        lng += np.random.normal(0, 0.1)
        
        bedrooms = np.random.randint(0, 6)
        bathrooms = np.random.randint(1, 4)
        accommodates = max(1, bedrooms + np.random.randint(-1, 4))
        
        # Generate realistic price based on features
        base_price = 50 + city * 10  # City-based pricing
        bedroom_factor = bedrooms * 30
        bathroom_factor = bathrooms * 25
        accommodate_factor = accommodates * 20
        
        price = base_price + bedroom_factor + bathroom_factor + accommodate_factor
        price = max(30, price + np.random.normal(0, price * 0.2))
        
        data.append({
            'city': city,
            'latitude': lat,
            'longitude': lng,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'accommodates': accommodates,
            'property_type': property_type,
            'room_type': room_type,
            'minimum_nights': np.random.randint(1, 7),
            'number_of_reviews': np.random.randint(0, 500),
            'availability_365': np.random.randint(0, 365),
            'price': round(price, 2)
        })
    
    return pd.DataFrame(data)

def train_model():
    """Train RandomForest model with real dataset"""
    # Load and preprocess data
    df = load_and_preprocess_dataset()
    
    # Select features for training
    feature_columns = ['city', 'latitude', 'longitude', 'bedrooms', 'bathrooms', 
                    'accommodates', 'property_type', 'room_type', 'minimum_nights',
                    'number_of_reviews', 'availability_365']
    
    X = df[feature_columns]
    y = df['price']
    
    # Encode categorical variables
    encoders = {}
    categorical_columns = ['city', 'property_type', 'room_type']
    
    for col in categorical_columns:
        le = LabelEncoder()
        X[col + '_encoded'] = le.fit_transform(X[col].astype(str))
        encoders[col] = le
        X = X.drop(col, axis=1)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training RandomForest model...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\n{'='*50}")
    print(f"MODEL PERFORMANCE METRICS")
    print(f"{'='*50}")
    print(f"Dataset Size: {len(df)} properties")
    print(f"Training Samples: {len(X_train)}")
    print(f"Test Samples: {len(X_test)}")
    print(f"Mean Absolute Error: ${mae:.2f}")
    print(f"R² Score: {r2:.4f}")
    print(f"{'='*50}")
    
    # Feature importance
    feature_names = X.columns.tolist()
    importances = model.feature_importances_
    print(f"\nFEATURE IMPORTANCE:")
    print(f"{'='*50}")
    for name, importance in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
        print(f"{name:25}: {importance:.4f}")
    
    # Save model and preprocessing components
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/price_model.pkl')
    joblib.dump(encoders, 'models/encoders.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    print(f"\nModel and preprocessing components saved to models/ directory")
    
    return model, encoders, scaler

if __name__ == "__main__":
    train_model()
