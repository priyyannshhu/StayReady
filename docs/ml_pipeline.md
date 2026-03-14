# Stay Ready - Machine Learning Pipeline

## Overview

The Stay Ready ML pipeline is designed to provide accurate Airbnb property price predictions using real-world data and advanced machine learning techniques. The pipeline processes property features, trains a RandomForest model, and serves predictions through a FastAPI service.

## Data Pipeline

### 1. Data Sources

#### Primary Dataset
- **Source**: Real Airbnb dataset (CSV format)
- **Location**: `ml-service/dataset/airbnb_sample.csv`
- **Format**: Comma-separated values with headers
- **Size**: Variable (sample dataset with 18 properties)

#### Dataset Features
```csv
city,latitude,longitude,bedrooms,bathrooms,accommodates,property_type,room_type,minimum_nights,number_of_reviews,availability_365,price
```

#### Feature Descriptions
- **city**: Geographic location (categorical)
- **latitude**: GPS coordinates (numerical)
- **longitude**: GPS coordinates (numerical)
- **bedrooms**: Number of bedrooms (numerical)
- **bathrooms**: Number of bathrooms (numerical)
- **accommodates**: Maximum guests (numerical)
- **property_type**: Property category (categorical)
- **room_type**: Room arrangement (categorical)
- **minimum_nights**: Minimum booking duration (numerical)
- **number_of_reviews**: Total reviews count (numerical)
- **availability_365**: Days available per year (numerical)
- **price**: Target variable (numerical)

### 2. Data Preprocessing

#### Missing Value Handling
```python
# Numeric columns
numeric_columns = ['bedrooms', 'bathrooms', 'accommodates', 'minimum_nights', 
                  'number_of_reviews', 'availability_365', 'price']
imputer_numeric = SimpleImputer(strategy='median')

# Categorical columns
categorical_columns = ['city', 'property_type', 'room_type']
imputer_categorical = SimpleImputer(strategy='most_frequent')
```

#### Feature Engineering
```python
# Derived features
df['price_per_accommodate'] = df['price'] / df['accommodates']
df['bed_bath_ratio'] = df['bedrooms'] / df['bathrooms']
df['availability_ratio'] = df['availability_365'] / 365
```

#### Outlier Removal
```python
# Remove extreme price outliers (99th percentile)
price_threshold = df['price'].quantile(0.99)
df = df[df['price'] <= price_threshold]
```

### 3. Feature Encoding

#### Categorical Variables
```python
# Label encoding for categorical features
encoders = {}
categorical_columns = ['city', 'property_type', 'room_type']

for col in categorical_columns:
    le = LabelEncoder()
    X[col + '_encoded'] = le.fit_transform(X[col].astype(str))
    encoders[col] = le
    X = X.drop(col, axis=1)
```

#### Feature Scaling
```python
# Standardization for numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

## Model Training

### 1. Algorithm Selection
- **Primary**: RandomForestRegressor
- **Reasoning**: 
  - Handles non-linear relationships
  - Robust to outliers
  - Provides feature importance
  - Good performance with tabular data

### 2. Hyperparameters
```python
model = RandomForestRegressor(
    n_estimators=200,          # Number of trees
    max_depth=15,              # Maximum tree depth
    min_samples_split=5,        # Minimum samples to split
    min_samples_leaf=2,         # Minimum samples per leaf
    random_state=42,            # Reproducibility
    n_jobs=-1                  # Use all CPU cores
)
```

### 3. Training Process
```python
# Data splitting
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model training
model.fit(X_train_scaled, y_train)

# Prediction
y_pred = model.predict(X_test_scaled)
```

### 4. Model Evaluation

#### Metrics
```python
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
```

#### Performance Benchmarks
- **MAE**: Mean Absolute Error (lower is better)
- **R²**: Coefficient of determination (higher is better)
- **Target**: MAE < $50, R² > 0.85

#### Feature Importance Analysis
```python
feature_names = X.columns.tolist()
importances = model.feature_importances_

for name, importance in sorted(zip(feature_names, importances), 
                            key=lambda x: x[1], reverse=True):
    print(f"{name}: {importance:.4f}")
```

## Model Persistence

### 1. Saved Components
- **Model**: `models/price_model.pkl`
- **Encoders**: `models/encoders.pkl`
- **Scaler**: `models/scaler.pkl`

### 2. Loading Process
```python
model = joblib.load('models/price_model.pkl')
encoders = joblib.load('models/encoders.pkl')
scaler = joblib.load('models/scaler.pkl')
```

## Prediction Pipeline

### 1. Input Processing
```python
# Request format
{
    "city": "New York",
    "bedrooms": 2,
    "bathrooms": 1,
    "accommodates": 4,
    "property_type": "Apartment",
    "latitude": 40.7128,
    "longitude": -74.0060
}
```

### 2. Feature Transformation
```python
# Encode categorical variables
for key, value in features.items():
    if key in encoders:
        if value not in encoders[key].classes_:
            encoded_value = 0  # Handle unseen categories
        else:
            encoded_value = encoders[key].transform([str(value)])[0]
        encoded_features.append(encoded_value)
```

### 3. Prediction Generation
```python
# Scale features
features_scaled = scaler.transform(features_array)

# Make prediction
prediction = model.predict(features_scaled)[0]

# Calculate confidence
tree_predictions = [estimator.predict(features_scaled)[0] 
                   for estimator in model.estimators_]
prediction_std = np.std(tree_predictions)
confidence = max(0.7, min(0.95, 1.0 - (prediction_std / max(prediction, 1))))
```

### 4. Response Format
```python
{
    "predicted_price": 250.00,
    "confidence": 0.87,
    "city": "New York"
}
```

## Model Monitoring

### 1. Performance Tracking
- **Prediction Accuracy**: Compare predicted vs actual prices
- **Confidence Calibration**: Ensure confidence scores reflect actual accuracy
- **Feature Drift**: Monitor input feature distributions
- **Model Degradation**: Track performance over time

### 2. Retraining Strategy
- **Frequency**: Monthly or when performance drops
- **Data Freshness**: Use latest Airbnb data
- **Version Control**: Maintain model version history
- **A/B Testing**: Compare new vs existing models

### 3. Quality Assurance
```python
# Input validation
required_fields = ['city', 'bedrooms', 'bathrooms', 'accommodates', 
                  'property_type', 'latitude', 'longitude']

# Value ranges
if bedrooms < 0 or bedrooms > 10:
    raise ValueError("Invalid bedroom count")

# Geographic validation
if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
    raise ValueError("Invalid coordinates")
```

## Advanced Features

### 1. Ensemble Methods
- **Bootstrap Aggregating**: Multiple trees with random sampling
- **Feature Randomness**: Random feature subsets per tree
- **Variance Reduction**: Average predictions across trees

### 2. Feature Engineering Pipeline
```python
# Location-based features
df['distance_from_city_center'] = calculate_distance(lat, lng, city_center)
df['neighborhood_score'] = get_neighborhood_score(city, lat, lng)

# Seasonal features
df['summer_availability'] = df['availability_365'] * 0.3
df['winter_availability'] = df['availability_365'] * 0.3

# Market dynamics
df['price_per_review'] = df['price'] / (df['number_of_reviews'] + 1)
df['booking_probability'] = df['availability_365'] / 365
```

### 3. Hyperparameter Optimization
```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 15, 20],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(RandomForestRegressor(random_state=42), 
                         param_grid, cv=5, scoring='neg_mean_absolute_error')
grid_search.fit(X_train, y_train)
```

## Deployment Considerations

### 1. Model Serving
- **FastAPI**: High-performance async framework
- **Docker**: Containerized deployment
- **Load Balancing**: Multiple instances for scalability
- **Health Checks**: Service monitoring endpoints

### 2. Performance Optimization
- **Model Caching**: Keep model in memory
- **Batch Processing**: Handle multiple predictions
- **Feature Preprocessing**: Optimize transformation pipeline
- **Response Compression**: Reduce network overhead

### 3. Scalability
```python
# Async prediction handling
@app.post("/predict")
async def predict_price(request: PricePredictionRequest):
    # Process prediction asynchronously
    result = await process_prediction(request)
    return result

# Batch prediction endpoint
@app.post("/predict-batch")
async def predict_batch(requests: List[PricePredictionRequest]):
    results = []
    for request in requests:
        result = await process_prediction(request)
        results.append(result)
    return results
```

## Error Handling

### 1. Input Validation
```python
try:
    # Prediction logic
    prediction = model.predict(features_scaled)
except ValueError as e:
    raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
```

### 2. Fallback Mechanisms
```python
# Rule-based fallback if ML service fails
base_price = 50
location_multiplier = get_location_multiplier(city)
bedroom_price = bedrooms * 30
bathroom_price = bathrooms * 25
accommodate_price = accommodates * 20

fallback_price = (base_price + bedroom_price + bathroom_price + accommodate_price) * location_multiplier
```

## Future Enhancements

### 1. Advanced Models
- **Gradient Boosting**: XGBoost, LightGBM
- **Neural Networks**: Deep learning for complex patterns
- **Ensemble Methods**: Stacking multiple models

### 2. Real-time Features
- **Demand Forecasting**: Time-based price adjustments
- **Event Pricing**: Local events impact
- **Weather Integration**: Seasonal pricing

### 3. Personalization
- **User Preferences**: Customized recommendations
- **Booking History**: Learning from user behavior
- **Market Segmentation**: Targeted pricing strategies

This ML pipeline provides a robust foundation for accurate Airbnb property price prediction with continuous improvement capabilities.
