import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import BookingModal from '../components/BookingModal';

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

const Explore = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from backend
    const mockProperties: Property[] = [
      {
        id: '1',
        title: 'Luxury Beach Villa',
        location: 'Miami Beach, FL',
        price: 350,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        status: 'Available',
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking']
      },
      {
        id: '2',
        title: 'Cozy Downtown Apartment',
        location: 'New York, NY',
        price: 180,
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
        status: 'Available',
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        amenities: ['WiFi', 'Kitchen', 'Gym']
      },
      {
        id: '3',
        title: 'Mountain Retreat Cabin',
        location: 'Aspen, CO',
        price: 450,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
        status: 'Sold Out',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Kitchen']
      }
    ];
    setProperties(mockProperties);
  }, []);

  const handleBookProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onBook={() => handleBookProperty(property)}
          />
        ))}
      </div>

      {selectedProperty && (
        <BookingModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Explore;
