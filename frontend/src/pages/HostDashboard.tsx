import { useState, useEffect } from 'react';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';
import { API_BASE_URL } from '../config/api';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface PredictionData {
  predictedPrice: number;
  confidence: number;
  averageMarketPrice: number;
  pricePerSqFt: number;
}

const HostDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch demo properties
    fetch(`${API_BASE_URL}/properties/demo`)
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(error => console.error('Error fetching properties:', error));
  }, []);

  const handlePredictPrice = async (property: Property) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: property.location.split(',')[0], // Extract city from location
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          accommodates: property.bedrooms + 1, // Estimate
          property_type: 'Apartment'
        })
      });
      
      const data = await response.json();
      const averageMarketPrice = property.price * 1.1; // Simulated market average
      
      setPredictionData({
        predictedPrice: data.predicted_price,
        confidence: data.confidence,
        averageMarketPrice,
        pricePerSqFt: data.predicted_price / property.area
      });
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Host Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Your Properties</h2>
          
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    property.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : property.status === 'Sold Out' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{property.location}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-indigo-600">${property.price}</span>
                  <span className="text-gray-500">per night</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
                
                <button
                  onClick={() => handlePredictPrice(property)}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Predicting...' : 'Get AI Price Prediction'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        {predictionData && (
          <div className="space-y-6">
            {/* Price Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Price Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">
                    ${predictionData.predictedPrice}
                  </div>
                  <div className="text-sm text-gray-600">AI Predicted</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">
                    ${predictionData.averageMarketPrice}
                  </div>
                  <div className="text-sm text-gray-600">Market Average</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${Math.round(predictionData.predictedPrice - predictionData.averageMarketPrice)}
                  </div>
                  <div className="text-sm text-gray-600">Difference</div>
                </div>
              </div>
              
              <PriceChart 
                prediction={{
                  predictedPrice: predictionData.predictedPrice,
                  confidence: predictionData.confidence
                }} 
              />
            </div>

            {/* Confidence Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Confidence Analysis</h3>
              
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${
                    predictionData.confidence > 0.8 ? 'text-green-600' : 
                    predictionData.confidence > 0.6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {(predictionData.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Prediction Confidence</div>
                </div>
              </div>
              
              <ConfidenceChart 
                prediction={{
                  predictedPrice: predictionData.predictedPrice,
                  confidence: predictionData.confidence
                }} 
              />
            </div>

            {/* Price per Square Foot */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Efficiency Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    ${predictionData.pricePerSqFt.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Price per SqFt</div>
                </div>
                
                <div>
                  <div className="text-lg font-semibold text-gray-700 mb-2">
                    Market Comparison
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget Properties:</span>
                      <span className="font-medium">$0.80/sqft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Properties:</span>
                      <span className="font-medium">$1.20/sqft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium Properties:</span>
                      <span className="font-medium">$2.50/sqft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Property:</span>
                      <span className="font-bold text-indigo-600">${predictionData.pricePerSqFt.toFixed(2)}/sqft</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <PricePerSqFtChart 
                prediction={{
                  predictedPrice: predictionData.predictedPrice,
                  confidence: predictionData.confidence
                }} 
                area={properties.find(p => p.status === 'Available')?.area || 1000}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
