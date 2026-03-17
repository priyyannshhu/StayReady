import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';
import {
  ArrowLeft, Star, Bed, Bath, Maximize, Wifi, Utensils, Car, Waves,
  Flame, Thermometer, Dumbbell, ChevronRight, Heart, Share2, Shield, MapPin, Loader2
} from 'lucide-react';
import { formatCurrency } from '../lib/currency';

interface Property {
  id: string; title: string; location: string; price: number;
  image: string; status: 'Available' | 'Sold Out';
  bedrooms: number; bathrooms: number; area: number;
  amenities: string[]; description: string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-5 h-5" />, Kitchen: <Utensils className="w-5 h-5" />,
  Parking: <Car className="w-5 h-5" />, Pool: <Waves className="w-5 h-5" />,
  Fireplace: <Flame className="w-5 h-5" />, 'Hot Tub': <Thermometer className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
};

const GALLERY = [
  'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
];

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        setProperty(data);
      } catch (e) { console.error('Failed to load property:', e); }
      finally { setIsLoading(false); }
    };
    load();
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-display font-700 text-xl text-[#1a1a1a] mb-4">Property not found</h2>
        <Link to="/explore" className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex">Back to Explore</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/explore" className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:underline">
            <ArrowLeft className="w-4 h-4" />Back to Explore
          </Link>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] px-3 py-2 rounded-xl transition-colors">
              <Share2 className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
            </button>
            <button onClick={() => setWishlisted(!wishlisted)}
              className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] px-3 py-2 rounded-xl transition-colors">
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-primary text-primary' : ''}`} />
              <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <h1 className="font-display font-700 text-2xl sm:text-3xl text-[#1a1a1a] mb-2">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#1a1a1a] text-[#1a1a1a]" />
            <span className="font-semibold text-[#1a1a1a]">4.87</span>
            <span className="text-[#717171]">(42 reviews)</span>
          </div>
          <span className="text-[#717171]">·</span>
          <div className="flex items-center gap-1 text-[#1a1a1a]">
            <MapPin className="w-4 h-4 text-primary" />{property.location}
          </div>
          <span className="text-[#717171]">·</span>
          {property.status === 'Available'
            ? <span className="badge-available">Available</span>
            : <span className="badge-soldout">Sold out</span>}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 sm:h-[420px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 overflow-hidden">
            <img src={property.image} alt={property.title}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300 cursor-pointer" />
          </div>
          {GALLERY.map((img, i) => (
            <div key={i} className="overflow-hidden">
              <img src={img} alt={`View ${i + 1}`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300 cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host row */}
            <div className="flex items-center justify-between pb-7 border-b border-[#e0e0e0]">
              <div>
                <h2 className="font-display font-700 text-xl text-[#1a1a1a]">Entire villa hosted by Alex</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-[#717171]">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bedrooms} bedrooms</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms} baths</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.area} sqft</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-display font-700 text-xl shrink-0">
                A
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-5">
              {[
                { icon: '🏅', title: 'Alex is a Superhost', desc: 'Superhosts are experienced, highly rated hosts who are committed to providing great stays.' },
                { icon: '🚪', title: 'Self check-in', desc: 'Check yourself in with the keypad — no waiting around.' },
                { icon: '📍', title: 'Prime location', desc: '95% of recent guests gave the location a 5-star rating.' },
              ].map(h => (
                <div key={h.title} className="flex items-start gap-4">
                  <span className="text-2xl shrink-0 mt-0.5">{h.icon}</span>
                  <div>
                    <p className="font-display font-600 text-sm text-[#1a1a1a]">{h.title}</p>
                    <p className="text-sm text-[#717171] mt-0.5 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-divider" />

            {/* Description */}
            <div>
              <h3 className="font-display font-700 text-lg text-[#1a1a1a] mb-3">About this place</h3>
              <p className="text-sm text-[#717171] leading-relaxed">{property.description}</p>
            </div>

            <div className="section-divider" />

            {/* Amenities */}
            <div>
              <h3 className="font-display font-700 text-lg text-[#1a1a1a] mb-5">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="amenity-tag">
                    <span className="text-[#717171]">
                      {AMENITY_ICONS[amenity] ?? <span className="w-5 h-5 rounded-full bg-[#e0e0e0] block" />}
                    </span>
                    <span className="text-[#1a1a1a]">{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="mt-5 px-5 py-2.5 border border-[#1a1a1a] rounded-xl text-sm font-display font-600 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-150 flex items-center gap-2">
                Show all amenities <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#e0e0e0] rounded-2xl p-6"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12)' }}>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-700 text-2xl text-[#1a1a1a]">{formatCurrency(property.price)}</span>
                <span className="text-[#717171] text-sm">/ night</span>
              </div>
              <div className="flex items-center gap-1.5 mb-5">
                <Star className="w-3.5 h-3.5 fill-[#1a1a1a] text-[#1a1a1a]" />
                <span className="text-sm font-semibold text-[#1a1a1a]">4.87</span>
                <span className="text-sm text-[#717171]">· 42 reviews</span>
              </div>

              {/* Date block */}
              <div className="border border-[#dddddd] rounded-xl overflow-hidden mb-3">
                <div className="grid grid-cols-2 divide-x divide-[#dddddd]">
                  <div className="px-3 py-3">
                    <p className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a] mb-1">Check-in</p>
                    <input type="date" className="w-full text-sm text-[#1a1a1a] focus:outline-none bg-transparent" />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a] mb-1">Check-out</p>
                    <input type="date" className="w-full text-sm text-[#1a1a1a] focus:outline-none bg-transparent" />
                  </div>
                </div>
              </div>

              {property.status === 'Available' ? (
                <button onClick={() => setIsModalOpen(true)}
                  className="btn-primary w-full py-4 rounded-xl text-base font-display font-600">
                  Reserve
                </button>
              ) : (
                <button disabled
                  className="w-full py-4 rounded-xl text-base font-display font-600 bg-[#f0f0f0] text-[#717171] cursor-not-allowed">
                  Currently unavailable
                </button>
              )}

              <p className="text-xs text-center text-[#717171] mt-3">You won't be charged yet</p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#717171] underline cursor-pointer">{formatCurrency(property.price)} × 3 nights</span>
                  <span className="text-[#1a1a1a]">{formatCurrency(property.price * 3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717171] underline cursor-pointer">Cleaning fee</span>
                  <span className="text-[#1a1a1a]">${Math.round(property.price * 0.15)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717171] underline cursor-pointer">StayReady service fee</span>
                  <span className="text-[#1a1a1a]">${Math.round(property.price * 3 * 0.12)}</span>
                </div>
                <div className="h-px bg-[#e0e0e0]" />
                <div className="flex justify-between font-display font-700 text-[#1a1a1a]">
                  <span>Total before taxes</span>
                  <span>{formatCurrency(property.price * 3 + Math.round(property.price * 0.15) + Math.round(property.price * 3 * 0.12))}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#717171] px-2">
              <Shield className="w-4 h-4 text-primary shrink-0" />Report this listing
            </div>
          </div>
        </div>
      </div>

      <BookingModal property={property} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default PropertyDetail;
