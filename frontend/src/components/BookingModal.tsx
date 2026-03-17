import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Users, Minus, Plus, Shield, ChevronRight, Loader2 } from 'lucide-react';

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
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const subtotal = nights * property.price;
  const cleaningFee = nights > 0 ? Math.round(property.price * 0.15) : 0;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal + cleaningFee + serviceFee;

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id, checkIn, checkOut, guests, paymentMethod: 'demo' }),
      });
      const result = await response.json();
      console.log('Booking created:', result);
      navigate('/booking-confirmed');
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[92vh] overflow-y-auto animate-fade-in-scale"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.24)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0] sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-display font-700 text-base text-[#1a1a1a]">Reserve your stay</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#1a1a1a]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Property preview */}
          <div className="flex items-center gap-4 p-4 bg-[#f7f7f7] rounded-xl">
            <img src={property.image} alt={property.title} className="w-16 h-14 object-cover rounded-xl shrink-0" />
            <div className="min-w-0">
              <p className="font-display font-600 text-sm text-[#1a1a1a] line-clamp-1">{property.title}</p>
              <p className="text-xs text-[#717171] mt-0.5 line-clamp-1">{property.location}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-[#1a1a1a] text-[#1a1a1a]" />
                <span className="text-xs font-semibold text-[#1a1a1a]">4.87</span>
                <span className="text-xs text-[#717171]">· 42 reviews</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <p className="form-label mb-3">Select dates</p>
            <div className="grid grid-cols-2 border border-[#dddddd] rounded-xl overflow-hidden">
              <div className="p-3 border-r border-[#dddddd]">
                <div className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a] mb-1">Check-in</div>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm text-[#1a1a1a] focus:outline-none bg-transparent font-medium"
                />
              </div>
              <div className="p-3">
                <div className="text-[10px] font-700 uppercase tracking-widest text-[#1a1a1a] mb-1">Check-out</div>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm text-[#1a1a1a] focus:outline-none bg-transparent font-medium"
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <p className="form-label mb-3">Guests</p>
            <div className="flex items-center justify-between px-4 py-3 border border-[#dddddd] rounded-xl">
              <div className="flex items-center gap-2 text-sm text-[#1a1a1a] font-medium">
                <Users className="w-4 h-4 text-[#717171]" />
                {guests} guest{guests !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#dddddd] hover:border-[#1a1a1a] transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-4 text-center font-semibold text-sm text-[#1a1a1a]">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(property.bedrooms * 2, guests + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#dddddd] hover:border-[#1a1a1a] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          {nights > 0 && (
            <div className="border border-[#e0e0e0] rounded-xl overflow-hidden">
              <div className="px-5 py-3 bg-[#f7f7f7] border-b border-[#e0e0e0]">
                <p className="font-display font-600 text-sm text-[#1a1a1a]">Price breakdown</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a]">${property.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
                  <span className="font-medium text-[#1a1a1a]">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#717171]">Cleaning fee</span>
                  <span className="text-[#1a1a1a]">${cleaningFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#717171]">StayReady service fee</span>
                  <span className="text-[#1a1a1a]">${serviceFee}</span>
                </div>
                <div className="h-px bg-[#e0e0e0]" />
                <div className="flex justify-between">
                  <span className="font-display font-700 text-sm text-[#1a1a1a]">Total before taxes</span>
                  <span className="font-display font-700 text-sm text-[#1a1a1a]">${total}</span>
                </div>
              </div>
            </div>
          )}

          {nights === 0 && checkIn && (
            <p className="text-sm text-[#717171] text-center py-1">Select a check-out date to see pricing</p>
          )}

          {/* Reserve button */}
          <button
            onClick={handleBooking}
            disabled={!checkIn || !checkOut || nights <= 0 || isBooking}
            className="btn-primary w-full py-4 text-base rounded-xl font-display font-600 flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Reserving...</>
            ) : (
              <>{nights > 0 ? `Reserve · $${total}` : 'Reserve'}<ChevronRight className="w-4 h-4" /></>
            )}
          </button>

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#717171]">
            <Shield className="w-3.5 h-3.5 text-primary" />
            You won't be charged yet · Free cancellation 24h before check-in
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
