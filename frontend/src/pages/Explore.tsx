import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import BookingModal from '../components/BookingModal';
import { PropertySkeleton, EmptyState } from '../components/LoadingStates';
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
  { label: 'All', icon: '🌍' },
  { label: 'Beach', icon: '🏖️' },
  { label: 'Mountain', icon: '🏔️' },
  { label: 'City', icon: '🏙️' },
  { label: 'Luxury', icon: '✨' },
  { label: 'Cabin', icon: '🏕️' },
  { label: 'Pool', icon: '🏊' },
  { label: 'Farm', icon: '🌾' },
];

const Explore = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
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

  const availableCount = filtered.filter(p => p.status === 'Available').length;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative h-[82vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Vacation rental" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.54) 100%)' }} />

        <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto animate-fade-in">
          <p className="text-white/80 text-xs font-display font-600 uppercase tracking-[0.2em] mb-5">
            Welcome to StayReady
          </p>
          <h1 className="font-display font-800 text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] mb-5">
            Find your perfect<br />
            <span className="text-primary">place to stay</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Discover thousands of unique homes, villas, and apartments around the world.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl mx-auto" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.24)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e0e0e0]">
              <div className="flex items-center gap-3 px-5 py-4">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a]">Where</div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full text-sm text-[#1a1a1a] placeholder-[#717171] focus:outline-none mt-0.5 bg-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a]">Check in</div>
                  <div className="text-sm text-[#717171] mt-0.5">Add dates</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <div className="text-left flex-1">
                  <div className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a]">Guests</div>
                  <div className="text-sm text-[#717171] mt-0.5">Add guests</div>
                </div>
                <button className="btn-primary px-5 py-2.5 text-sm rounded-xl shrink-0 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-display font-600">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-white/50" />
        </div>
      </section>

      {/* ── Listing ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Category filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-5 scrollbar-hide border-b border-[#e0e0e0] mb-8">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveFilter(cat.label)}
              className={`filter-chip shrink-0 flex items-center gap-1.5 text-sm ${activeFilter === cat.label ? 'active' : ''}`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          <div className="w-px h-6 bg-[#e0e0e0] mx-1 shrink-0" />

          <button
            onClick={() => setSortBy(sortBy === 'recommended' ? 'price-asc' : 'recommended')}
            className="filter-chip shrink-0 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        {/* Result count + Sort */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {!isLoading && (
              <p className="text-sm text-[#717171]">
                <span className="font-display font-600 text-[#1a1a1a]">{availableCount} available</span>
                {' '}of {sorted.length} stays
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#717171] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-medium text-[#1a1a1a] border border-[#dddddd] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <PropertySkeleton count={8} />
        ) : sorted.length === 0 ? (
          <EmptyState
            message="No properties match your search"
            onClear={() => { setSearchQuery(''); setActiveFilter('All'); }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 animate-fade-in">
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

      {selectedProperty && (
        <BookingModal property={selectedProperty} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedProperty(null); }} />
      )}
    </div>
  );
};

export default Explore;
