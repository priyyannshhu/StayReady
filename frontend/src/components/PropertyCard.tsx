import { Link } from 'react-router-dom';

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
}

interface PropertyCardProps {
  property: Property;
  onBook: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
          property.status === 'Available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {property.status}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-indigo-600">${property.price}</span>
          <span className="text-gray-500 text-sm">per night</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.area} sqft</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onBook}
            disabled={property.status === 'Sold Out'}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              property.status === 'Available'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {property.status === 'Available' ? 'Book Now' : 'Sold Out'}
          </button>
          <Link
            to={`/property/${property.id}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
