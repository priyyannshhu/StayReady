import { useState } from 'react';

interface PropertyForm {
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
}

interface PricePrediction {
  predictedPrice: number;
  confidence: number;
}

const HostDashboard = () => {
  const [propertyForm, setPropertyForm] = useState<PropertyForm>({
    title: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    amenities: []
  });

  const [pricePrediction, setPricePrediction] = useState<PricePrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPropertyForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !propertyForm.amenities.includes(amenityInput.trim())) {
      setPropertyForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setPropertyForm(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handlePredictPrice = async () => {
    setIsLoading(true);
    try {
      // Mock ML prediction - in real app, call ML service
      setTimeout(() => {
        const mockPrediction: PricePrediction = {
          predictedPrice: Math.floor(Math.random() * 300) + 100,
          confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
        };
        setPricePrediction(mockPrediction);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error predicting price:', error);
      setIsLoading(false);
    }
  };

  const handleSubmitProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock API call - in real app, call backend
      console.log('Submitting property:', propertyForm);
      alert('Property listed successfully!');
      setPropertyForm({
        title: '',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        amenities: []
      });
      setPricePrediction(null);
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Error listing property');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Host Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Add New Property</h2>
        
        <form onSubmit={handleSubmitProperty} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <input
                type="text"
                name="title"
                value={propertyForm.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={propertyForm.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                min="1"
                value={propertyForm.bedrooms}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                min="1"
                value={propertyForm.bathrooms}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (sqft)
              </label>
              <input
                type="number"
                name="area"
                min="100"
                value={propertyForm.area}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                placeholder="Add amenity (e.g., WiFi, Pool, Kitchen)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {propertyForm.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              type="button"
              onClick={handlePredictPrice}
              disabled={isLoading || !propertyForm.title || !propertyForm.location}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Predicting...' : 'Get AI Price Prediction'}
            </button>

            {pricePrediction && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🤖 AI Price Prediction
                </h3>
                <div className="space-y-1">
                  <p className="text-green-700">
                    <strong>Recommended Price:</strong> ${pricePrediction.predictedPrice} per night
                  </p>
                  <p className="text-green-600 text-sm">
                    <strong>Confidence:</strong> {(pricePrediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            List Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostDashboard;
