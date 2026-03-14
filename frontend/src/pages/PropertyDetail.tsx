import { useParams, Link } from 'react-router-dom';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  status: 'Available' | 'Sold Out';
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  description: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - in real app, fetch from backend
  const mockProperty: Property = {
    id: id || '1',
    title: 'Luxury Beach Villa',
    location: 'Miami Beach, FL',
    price: 350,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning', 'Beach Access'],
    description: 'Experience luxury living in this stunning beachfront villa. With breathtaking ocean views, modern amenities, and direct beach access, this property offers the perfect getaway for families and couples alike.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        ← Back to Explore
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div>
            <img
              src={mockProperty.image}
              alt={mockProperty.title}
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{mockProperty.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                mockProperty.status === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {mockProperty.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{mockProperty.location}</p>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-indigo-600">${mockProperty.price}</span>
                <span className="text-gray-500 ml-2">per night</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-semibold text-gray-900">{mockProperty.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-semibold text-gray-900">{mockProperty.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-semibold text-gray-900">{mockProperty.area}</div>
                <div className="text-sm text-gray-600">sqft</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">About this property</h3>
              <p className="text-gray-700 leading-relaxed">{mockProperty.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {mockProperty.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={mockProperty.status === 'Sold Out'}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                mockProperty.status === 'Available'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {mockProperty.status === 'Available' ? 'Book Now' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
