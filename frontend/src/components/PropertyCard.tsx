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
  const rating = property.rating ?? (4.2 + Math.random() * 0.7).toFixed(2);
  const reviews = property.reviewCount ?? Math.floor(20 + Math.random() * 80);

  return (
    <div className="property-card group bg-white rounded-2xl shadow-luxury overflow-hidden hover:shadow-xl transition-all duration-300 border border-brand-border/50 hover:border-primary/30">
      {/* Image Container — enhanced responsive */}
      <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ aspectRatio: '4/3' }}>
        <img
          src={property.image}
          alt={property.title}
          className="card-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Enhanced status badge */}
        {property.status === 'Sold Out' && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Sold Out
          </div>
        )}

        {/* Enhanced wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-white/20"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${wishlisted ? 'fill-brand-saffron text-brand-saffron' : 'text-brand-charcoal'}`}
            strokeWidth={wishlisted ? 0 : 1.5}
          />
        </button>

        {/* Book now hover CTA */}
        {property.status === 'Available' && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={onBook}
              className="btn-primary w-full py-2 text-sm rounded-lg"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="pt-3 pb-1">
        {/* Title row with rating */}
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/property/${property.id}`}
            className="font-display font-600 text-sm text-brand-charcoal leading-snug hover:underline line-clamp-1 flex-1"
          >
            {property.title}
          </Link>
          {/* Rating — top right of text area */}
          <div className="star-rating shrink-0">
            <Star className="w-3.5 h-3.5 fill-brand-charcoal text-brand-charcoal" />
            <span>{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{property.location}</p>

        {/* Details row */}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3 h-3" />
            {property.area} sqft
          </span>
        </div>

        {/* Price — bottom left */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="price-tag text-sm font-semibold">{formatCurrency(property.price)}</span>
            <span className="text-muted-foreground text-xs"> / night</span>
          </div>
          <span className="text-xs text-muted-foreground">{reviews} reviews</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
