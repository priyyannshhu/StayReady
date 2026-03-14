import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import Papa from 'papaparse';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';
import { API_BASE_URL } from '../config/api';
import 'leaflet/dist/leaflet.css';

interface ManualPredictionForm {
  country: string;
  city: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnishing: string;
  parking: boolean;
  propertyAge: number;
}

interface PredictionResult {
  predictedPrice: number;
  confidence: number;
  features?: any;
  fallback?: boolean;
  city?: string;
  coordinates?: { lat: number; lng: number };
}

interface CSVRow {
  [key: string]: any;
}

const Prediction = () => {
  const [mode, setMode] = useState<'manual' | 'map' | 'csv'>('manual');
  const [manualForm, setManualForm] = useState<ManualPredictionForm>({
    country: 'United States',
    city: '',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    furnishing: 'furnished',
    parking: false,
    propertyAge: 5
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvResults, setCsvResults] = useState<PredictionResult[]>([]);
  const [isProcessingCSV, setIsProcessingCSV] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Map click handler
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        predictFromLocation(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleManualPrediction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualForm,
          amenities: []
        })
      });
      const result = await response.json();
      setPrediction(result);
      setShowAnalytics(true);
    } catch (error) {
      console.error('Prediction error:', error);
      // Fallback prediction
      const fallbackPrice = Math.round(
        (manualForm.area * 0.8) + 
        (manualForm.bedrooms * 50) + 
        (manualForm.bathrooms * 40) + 
        (manualForm.parking ? 30 : 0) +
        (manualForm.furnishing === 'furnished' ? 50 : 0)
      );
      setPrediction({
        predictedPrice: fallbackPrice,
        confidence: 0.75,
        fallback: true
      });
      setShowAnalytics(true);
    }
    setIsLoading(false);
  };

  const predictFromLocation = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      // Reverse geocoding to get city
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const geocodeData = await geocodeResponse.json();
      const city = geocodeData.address?.city || geocodeData.address?.town || 'Unknown';
      
      // Predict using location
      const response = await fetch(`${API_BASE_URL}/predict-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: city,
          bedrooms: 2,
          bathrooms: 1,
          area: 800,
          amenities: ['WiFi', 'Kitchen']
        })
      });
      const result = await response.json();
      setPrediction({ ...result, city, coordinates: { lat, lng } });
      setShowAnalytics(true);
    } catch (error) {
      console.error('Location prediction error:', error);
      setPrediction({
        predictedPrice: 200,
        confidence: 0.6,
        fallback: true
      });
      setShowAnalytics(true);
    }
    setIsLoading(false);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results: any) => {
        setCsvData(results.data as CSVRow[]);
      },
      error: (error: any) => {
        console.error('CSV parsing error:', error);
      }
    });
  };

  const processCSVPredictions = async () => {
    setIsProcessingCSV(true);
    const results: PredictionResult[] = [];

    for (const row of csvData) {
      try {
        const response = await fetch(`${API_BASE_URL}/predict-price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: row.city || 'Unknown',
            bedrooms: parseInt(row.bedrooms) || 1,
            bathrooms: parseInt(row.bathrooms) || 1,
            area: parseInt(row.area) || 500,
            amenities: []
          })
        });
        const result = await response.json();
        results.push(result);
      } catch (error) {
        results.push({
          predictedPrice: 150,
          confidence: 0.5,
          fallback: true
        });
      }
    }

    setCsvResults(results);
    setIsProcessingCSV(false);
  };

  const downloadCSVResults = () => {
    const csvContent = Papa.unparse({
      fields: ['predictedPrice', 'confidence'],
      data: csvResults
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.csv';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Intelligent Price Prediction</h1>
      
      {/* Mode Selector */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setMode('manual')}
          className={`pb-4 px-2 font-medium ${
            mode === 'manual' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Manual Features
        </button>
        <button
          onClick={() => setMode('map')}
          className={`pb-4 px-2 font-medium ${
            mode === 'map' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Map-Based
        </button>
        <button
          onClick={() => setMode('csv')}
          className={`pb-4 px-2 font-medium ${
            mode === 'csv' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          CSV Batch
        </button>
      </div>

      {/* Manual Prediction Mode */}
      {mode === 'manual' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Manual Feature Prediction</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={manualForm.country}
                onChange={(e) => setManualForm({...manualForm, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={manualForm.city}
                onChange={(e) => setManualForm({...manualForm, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter city name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={manualForm.propertyType}
                onChange={(e) => setManualForm({...manualForm, propertyType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={manualForm.bedrooms}
                onChange={(e) => setManualForm({...manualForm, bedrooms: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={manualForm.bathrooms}
                onChange={(e) => setManualForm({...manualForm, bathrooms: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqft)</label>
              <input
                type="number"
                min="0"
                value={manualForm.area}
                onChange={(e) => setManualForm({...manualForm, area: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
              <select
                value={manualForm.furnishing}
                onChange={(e) => setManualForm({...manualForm, furnishing: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={manualForm.parking}
                  onChange={(e) => setManualForm({...manualForm, parking: e.target.checked})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Parking Available</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Age (years)</label>
              <input
                type="number"
                min="0"
                value={manualForm.propertyAge}
                onChange={(e) => setManualForm({...manualForm, propertyAge: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleManualPrediction}
            disabled={isLoading || !manualForm.city}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Predicting...' : 'Get Price Prediction'}
          </button>
        </div>
      )}

      {/* Map-Based Prediction Mode */}
      {mode === 'map' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Map-Based Prediction</h2>
          <p className="text-gray-600 mb-4">Click anywhere on the map to get price prediction for that location</p>
          
          <div className="h-96 rounded-lg overflow-hidden border">
            <MapContainer
              center={[40.7128, -74.0060]} // New York
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng] as LatLngExpression} />
              )}
            </MapContainer>
          </div>

          {selectedLocation && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected Location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* CSV Batch Prediction Mode */}
      {mode === 'csv' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">CSV Batch Prediction</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              CSV should include columns: city, bedrooms, bathrooms, area
            </p>
          </div>

          {csvData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Preview ({csvData.length} rows)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvData.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2">... and {csvData.length - 5} more rows</p>
                )}
              </div>
            </div>
          )}

          {csvData.length > 0 && (
            <div className="flex space-x-4">
              <button
                onClick={processCSVPredictions}
                disabled={isProcessingCSV}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessingCSV ? 'Processing...' : 'Predict All Prices'}
              </button>
              
              {csvResults.length > 0 && (
                <button
                  onClick={downloadCSVResults}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Download Results
                </button>
              )}
            </div>
          )}

          {csvResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Prediction Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Row
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Predicted Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvResults.slice(0, 5).map((result, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${result.predictedPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(result.confidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Prediction Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-600 mb-2">Predicted Price</h3>
              <p className="text-3xl font-bold text-indigo-900">${prediction.predictedPrice}</p>
              <p className="text-sm text-indigo-600">per night</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-600 mb-2">Confidence Score</h3>
              <p className="text-3xl font-bold text-green-900">{(prediction.confidence * 100).toFixed(1)}%</p>
              <p className="text-sm text-green-600">reliability</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-600 mb-2">Price per SqFt</h3>
              <p className="text-3xl font-bold text-yellow-900">
                ${manualForm.area ? (prediction.predictedPrice / manualForm.area).toFixed(2) : 'N/A'}
              </p>
              <p className="text-sm text-yellow-600">efficiency metric</p>
            </div>
          </div>

          {/* Analytics Charts */}
          {showAnalytics && (
            <div className="space-y-6">
              <PriceChart prediction={prediction} />
              <ConfidenceChart prediction={prediction} />
              <PricePerSqFtChart prediction={prediction} area={manualForm.area} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Prediction;
