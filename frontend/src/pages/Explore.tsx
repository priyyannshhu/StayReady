import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import BookingModal from '../components/BookingModal';
import { PropertySkeleton, EmptyState } from '../components/LoadingStates';
import Footer from '../components/Footer';
import heroImg from '../assets/hero-bg.jpg';
import { Search, MapPin, Calendar, Users, SlidersHorizontal, ChevronDown } from 'lucide-react';

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
  rating?: number;
  reviewCount?: number;
}

const CATEGORY_FILTERS = [
  { label: 'All', emoji: '🌍' },
  { label: 'Beach', emoji: '🏖️' },
  { label: 'Mountain', emoji: '🏔️' },
  { label: 'City', emoji: '🏙️' },
  { label: 'Luxury', emoji: '✨' },
  { label: 'Cabin', emoji: '🏕️' },
  { label: 'Pool', emoji: '🏊' },
  { label: 'Farm', emoji: '🌾' },
];

const Explore = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load properties from backend API
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/properties/demo');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Beach' && (p.title.toLowerCase().includes('beach') || p.location.toLowerCase().includes('miami') || p.location.toLowerCase().includes('malibu'))) ||
      (activeFilter === 'Mountain' && (p.title.toLowerCase().includes('mountain') || p.location.toLowerCase().includes('aspen'))) ||
      (activeFilter === 'Cabin' && p.title.toLowerCase().includes('cabin')) ||
      (activeFilter === 'City' && (p.title.toLowerCase().includes('loft') || p.title.toLowerCase().includes('apartment') || p.title.toLowerCase().includes('downtown'))) ||
      (activeFilter === 'Luxury' && p.price >= 400) ||
      (activeFilter === 'Pool' && p.amenities.map(a => a.toLowerCase()).includes('pool')) ||
      (activeFilter === 'Farm' && p.title.toLowerCase().includes('farm'));
    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  const handleBookProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const availableCount = filtered.filter(p => p.status === 'Available').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src={heroImg}
          alt="Stunning vacation rental"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto animate-fade-in">
          <p className="text-white/80 text-sm font-display font-600 uppercase tracking-widest mb-4">
            Welcome to StayReady
          </p>
          <h1 className="font-display font-700 text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
            Find your perfect<br />
            <span className="text-primary">place to stay</span>
          </h1>
          <p className="text-white/75 text-lg mb-10 max-w-lg mx-auto">
            Discover thousands of unique homes, villas, and apartments around the world.
          </p>

          {/* Hero Search Bar */}
          <div className="bg-white rounded-2xl shadow-modal overflow-hidden max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-brand-border">
              {/* Location */}
              <div className="flex items-center gap-3 px-5 py-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide">Where</div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full text-sm text-brand-charcoal placeholder-muted-foreground focus:outline-none mt-0.5"
                  />
                </div>
              </div>
              {/* Check in */}
              <div className="flex items-center gap-3 px-5 py-4">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide">Check in</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Add dates</div>
                </div>
              </div>
              {/* Guests + Search */}
              <div className="flex items-center gap-3 px-5 py-4">
                <Users className="w-5 h-5 text-primary shrink-0" />
                <div className="text-left flex-1">
                  <div className="text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide">Guests</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Add guests</div>
                </div>
                <button className="btn-primary px-5 py-2.5 text-sm rounded-xl shrink-0 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-white/60" />
        </div>
      </section>

      {/* Listing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveFilter(cat.label)}
              className={`filter-chip shrink-0 flex items-center gap-1.5 ${activeFilter === cat.label ? 'active' : ''}`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          <div className="w-px h-8 bg-brand-border mx-2 shrink-0" />

          {/* Sort / Filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-chip shrink-0 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Sort + result count */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                <span className="font-display font-600 text-brand-charcoal">{availableCount} available</span>
                {' '}of {sorted.length} properties
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-medium text-brand-charcoal border border-brand-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <PropertySkeleton count={8} />
        ) : sorted.length === 0 ? (
          <EmptyState
            message="No properties match your search"
            onClear={() => { setSearchQuery(''); setActiveFilter('All'); }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 animate-fade-in">
            {sorted.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBook={() => handleBookProperty(property)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedProperty && (
        <BookingModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
    </div>
  );
};

export default Explore;
