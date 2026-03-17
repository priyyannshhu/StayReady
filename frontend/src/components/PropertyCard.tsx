import { Link } from 'react-router-dom';
import { Star, Heart, Bed, Bath, Maximize } from 'lucide-react';
import { useState } from 'react';
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
  rating?: number;
  reviewCount?: number;
}

interface PropertyCardProps {
  property: Property;
  onBook: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const rating = property.rating ?? Number((4.2 + Math.random() * 0.7).toFixed(2));
  const reviews = property.reviewCount ?? Math.floor(20 + Math.random() * 80);

  return (
    <div className="property-card group">
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
        <img
          src={property.image}
          alt={property.title}
          className="card-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-xl" />

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${wishlisted ? 'fill-primary text-primary' : 'text-[#1a1a1a]'}`}
            strokeWidth={wishlisted ? 0 : 1.8}
          />
        </button>

        {/* Sold Out badge */}
        {property.status === 'Sold Out' && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-[#1a1a1a] text-xs font-semibold rounded-full shadow-sm">
            Sold out
          </div>
        )}

        {/* Book Now — hover CTA */}
        {property.status === 'Available' && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={(e) => { e.stopPropagation(); onBook(); }}
              className="btn-primary w-full py-2.5 text-sm rounded-lg"
            >
              Book now
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-3 pb-1">
        {/* Title + Rating */}
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/property/${property.id}`}
            className="font-display font-600 text-sm text-[#1a1a1a] leading-snug hover:underline line-clamp-1 flex-1"
          >
            {property.title}
          </Link>
          <div className="star-rating shrink-0 text-xs">
            <Star className="w-3 h-3 fill-[#1a1a1a] text-[#1a1a1a]" />
            <span>{Number(rating).toFixed(2)}</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-[#717171] text-xs mt-0.5 line-clamp-1">{property.location}</p>

        {/* Details */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#717171]">
          <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area} sqft</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="price-tag text-sm">{formatCurrency(property.price)}</span>
            <span className="text-[#717171] text-xs"> / night</span>
          </div>
          <span className="text-xs text-[#717171]">{reviews} reviews</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
