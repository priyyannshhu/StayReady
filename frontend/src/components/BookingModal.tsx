import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Bed, Bath, Maximize, Users, Minus, Plus, Shield, ChevronRight } from 'lucide-react';

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

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ property, isOpen, onClose }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();
  const backdropRef = useRef<HTMLDivElement>(null);

  // Trap scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const subtotal = nights * property.price;
  const cleaningFee = nights > 0 ? Math.round(property.price * 0.15) : 0;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal + cleaningFee + serviceFee;

  const handleBooking = async () => {
    try {
      const bookingData = {
        propertyId: property.id,
        checkIn,
        checkOut,
        guests,
        paymentMethod: 'demo' // Using demo payment method
      };
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      console.log('Booking created:', result);
      navigate('/booking-confirmed');
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
      // Handle error (show message to user)
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-lg max-h-[92vh] overflow-y-auto animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border sticky top-0 bg-white rounded-t-3xl">
          <h2 className="font-display font-700 text-lg text-brand-charcoal">Reserve your stay</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-surface transition-colors duration-150"
          >
            <X className="w-5 h-5 text-brand-charcoal" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Property preview */}
          <div className="flex items-center gap-4 p-4 bg-brand-surface rounded-2xl">
            <img
              src={property.image}
              alt={property.title}
              className="w-20 h-16 object-cover rounded-xl shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display font-600 text-sm text-brand-charcoal line-clamp-1">{property.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{property.location}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-brand-charcoal text-brand-charcoal" />
                <span className="text-xs font-semibold text-brand-charcoal">4.87</span>
                <span className="text-xs text-muted-foreground">· 42 reviews</span>
              </div>
            </div>
          </div>

          {/* Date picker */}
          <div>
            <p className="font-display font-600 text-sm text-brand-charcoal mb-3">Dates</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 text-brand-charcoal font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 text-brand-charcoal font-medium"
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <p className="font-display font-600 text-sm text-brand-charcoal mb-3">Guests</p>
            <div className="flex items-center justify-between px-4 py-3 border border-brand-border rounded-xl">
              <div className="flex items-center gap-2 text-sm text-brand-charcoal font-medium">
                <Users className="w-4 h-4 text-muted-foreground" />
                {guests} guest{guests !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-border hover:border-brand-charcoal transition-colors duration-150 disabled:opacity-40"
                  disabled={guests <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center font-semibold text-brand-charcoal text-sm">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(property.bedrooms * 2, guests + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-border hover:border-brand-charcoal transition-colors duration-150"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          {nights > 0 && (
            <div className="border border-brand-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 bg-brand-surface border-b border-brand-border">
                <p className="font-display font-600 text-sm text-brand-charcoal">Price Breakdown</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-charcoal">
                    ${property.price} × {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                  <span className="font-medium text-brand-charcoal">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cleaning fee</span>
                  <span className="text-brand-charcoal">${cleaningFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">StayReady service fee</span>
                  <span className="text-brand-charcoal">${serviceFee}</span>
                </div>
                <div className="h-px bg-brand-border" />
                <div className="flex items-center justify-between">
                  <span className="font-display font-700 text-base text-brand-charcoal">Total</span>
                  <span className="font-display font-700 text-base text-brand-charcoal">${total}</span>
                </div>
              </div>
            </div>
          )}

          {nights === 0 && checkIn && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Select check-out date to see pricing
            </p>
          )}

          {/* Reserve button */}
          <button
            onClick={handleBooking}
            disabled={!checkIn || !checkOut || nights <= 0}
            className="btn-primary w-full py-4 text-base rounded-xl font-display font-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {nights > 0 ? `Reserve · $${total}` : 'Reserve'}
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Trust signal */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>You won't be charged yet · Free cancellation 24h before check-in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
