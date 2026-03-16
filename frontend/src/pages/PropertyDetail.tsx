import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';
import {
  ArrowLeft, Star, Bed, Bath, Maximize, Wifi, Utensils, Car, Waves,
  Flame, Thermometer, Dumbbell, ChevronRight, Heart, Share2, Shield, MapPin
} from 'lucide-react';
import { formatCurrency } from '../lib/currency';

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

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  Kitchen: <Utensils className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  Fireplace: <Flame className="w-4 h-4" />,
  'Hot Tub': <Thermometer className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Failed to load property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Property not found</h2>
          <Link to="/explore" className="btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <div className="flex items-center justify-between">
          <Link
            to="/explore"
            className="flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:text-primary transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:bg-brand-surface px-3 py-2 rounded-xl transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:bg-brand-surface px-3 py-2 rounded-xl transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-primary text-primary' : ''}`} />
              <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="font-display font-700 text-2xl sm:text-3xl text-brand-charcoal mb-1">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-brand-charcoal text-brand-charcoal" />
            <span className="font-semibold text-brand-charcoal">4.87</span>
            <span className="text-muted-foreground">(42 reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-brand-charcoal">
            <MapPin className="w-4 h-4 text-primary" />
            {property.location}
          </div>
          {property.status === 'Available' ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-soldout">Sold Out</span>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-96 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover hover:brightness-95 transition-all duration-150 cursor-pointer"
            />
          </div>
          {[
            'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=80',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
          ].map((img, i) => (
            <div key={i} className="col-span-1 row-span-1">
              <img
                src={img}
                alt={`Property view ${i + 1}`}
                className="w-full h-full object-cover hover:brightness-95 transition-all duration-150 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-6 border-b border-brand-border">
              <div>
                <h2 className="font-display font-700 text-xl text-brand-charcoal">
                  Entire villa hosted by Alex
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} bedrooms</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} baths</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.area} sqft</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-rose flex items-center justify-center text-white font-display font-700 text-lg shrink-0">
                A
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              {[
                { icon: '🏅', title: 'Alex is a Superhost', desc: 'Superhosts are experienced, highly rated hosts.' },
                { icon: '🚪', title: 'Self check-in', desc: 'Check yourself in with the keypad.' },
                { icon: '📍', title: 'Prime location', desc: '95% of recent guests gave the location 5 stars.' },
              ].map((h) => (
                <div key={h.title} className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">{h.icon}</span>
                  <div>
                    <p className="font-display font-600 text-sm text-brand-charcoal">{h.title}</p>
                    <p className="text-sm text-muted-foreground">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-divider" />

            {/* Description */}
            <div>
              <h3 className="font-display font-700 text-lg text-brand-charcoal mb-3">About this place</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            <div className="section-divider" />

            {/* Amenities */}
            <div>
              <h3 className="font-display font-700 text-lg text-brand-charcoal mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-sm text-brand-charcoal">
                    <span className="w-6 h-6 flex items-center justify-center text-muted-foreground">
                      {AMENITY_ICONS[amenity] ?? <span className="w-4 h-4 rounded-full bg-brand-surface border border-brand-border" />}
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
              <button className="mt-4 px-5 py-2.5 border border-brand-charcoal rounded-xl text-sm font-display font-600 text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all duration-150 flex items-center gap-2">
                Show all amenities <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column — Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-brand-border rounded-3xl p-6 shadow-card">
              <div className="flex items-end gap-1 mb-1">
                <span className="font-display font-700 text-2xl text-brand-charcoal">{formatCurrency(property.price)}</span>
                <span className="text-muted-foreground text-sm mb-1">/ night</span>
              </div>
              <div className="flex items-center gap-1 mb-5">
                <Star className="w-3.5 h-3.5 fill-brand-charcoal text-brand-charcoal" />
                <span className="text-sm font-semibold text-brand-charcoal">4.87</span>
                <span className="text-sm text-muted-foreground">· 42 reviews</span>
              </div>

              {/* Date inputs */}
              <div className="border border-brand-border rounded-xl overflow-hidden mb-3">
                <div className="grid grid-cols-2 divide-x divide-brand-border">
                  <div className="px-3 py-3">
                    <p className="text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1">Check-in</p>
                    <input type="date" className="w-full text-sm text-brand-charcoal focus:outline-none bg-transparent" />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1">Check-out</p>
                    <input type="date" className="w-full text-sm text-brand-charcoal focus:outline-none bg-transparent" />
                  </div>
                </div>
              </div>

              {property.status === 'Available' ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary w-full py-4 rounded-xl text-base font-display font-600"
                >
                  Reserve
                </button>
              ) : (
                <button disabled className="w-full py-4 rounded-xl text-base font-display font-600 bg-muted text-muted-foreground cursor-not-allowed">
                  Currently Unavailable
                </button>
              )}

              <p className="text-xs text-center text-muted-foreground mt-3">You won't be charged yet</p>

              {/* Fee breakdown */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline cursor-pointer">{formatCurrency(property.price)} × 3 nights</span>
                  <span className="text-brand-charcoal">{formatCurrency(property.price * 3)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline cursor-pointer">Cleaning fee</span>
                  <span className="text-brand-charcoal">${Math.round(property.price * 0.15)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline cursor-pointer">StayReady service fee</span>
                  <span className="text-brand-charcoal">${Math.round(property.price * 3 * 0.12)}</span>
                </div>
                <div className="h-px bg-brand-border" />
                <div className="flex justify-between font-display font-700 text-brand-charcoal">
                  <span>Total</span>
                  <span>{formatCurrency(property.price * 3 + Math.round(property.price * 0.15) + Math.round(property.price * 3 * 0.12))}</span>
                </div>
              </div>
            </div>

            {/* Trust signal */}
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground px-2">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              Report this listing
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default PropertyDetail;
