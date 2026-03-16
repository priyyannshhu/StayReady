import { Link } from 'react-router-dom';
import { Star, Heart, Bed, Bath, Maximize } from 'lucide-react';
import { useState } from 'react';

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
    <div className="property-card group">
      {/* Image Container — 4:3 ratio */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
        <img
          src={property.image}
          alt={property.title}
          className="card-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-150 shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-150 ${wishlisted ? 'fill-primary text-primary' : 'text-brand-charcoal'}`}
            strokeWidth={wishlisted ? 0 : 2}
          />
        </button>

        {/* Status badge */}
        {property.status === 'Sold Out' && (
          <div className="absolute top-3 left-3">
            <span className="badge-soldout">Sold Out</span>
          </div>
        )}

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
            <span className="price-tag text-sm">${property.price}</span>
            <span className="text-muted-foreground text-xs"> / night</span>
          </div>
          <span className="text-xs text-muted-foreground">{reviews} reviews</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
