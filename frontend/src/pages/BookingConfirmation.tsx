import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, Home, ArrowRight, Download } from 'lucide-react';

const BookingConfirmation = () => {
  const confirmationNumber = `#STAY${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-24">

        {/* Success */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[#f0faf4] border border-[#c6e9d2] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h1 className="font-display font-700 text-3xl text-[#1a1a1a] mb-2">Booking confirmed!</h1>
          <p className="text-[#717171]">Your reservation is complete. Get ready for an amazing stay!</p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white border border-[#e0e0e0] rounded-2xl overflow-hidden mb-5"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)' }}>

          <div className="h-40 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              alt="Property" className="w-full h-full object-cover" />
          </div>

          <div className="p-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-700 text-lg text-[#1a1a1a]">Luxury Beach Villa</p>
                <p className="text-sm text-[#717171]">Miami Beach, FL</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#717171] uppercase tracking-widest font-700 mb-1">Confirmation</p>
                <p className="font-display font-700 text-primary">{confirmationNumber}</p>
              </div>
            </div>

            <div className="h-px bg-[#e0e0e0]" />

            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Calendar, label: 'Check-in', value: 'March 15, 2025', sub: 'After 3:00 PM' },
                { icon: Calendar, label: 'Check-out', value: 'March 18, 2025', sub: 'Before 11:00 AM' },
                { icon: Users, label: 'Guests', value: '2 guests', sub: '' },
                { icon: Home, label: 'Duration', value: '3 nights', sub: 'Entire villa' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fff0f3] border border-[#fcc] flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-[#717171] font-medium">{item.label}</p>
                    <p className="text-sm font-display font-600 text-[#1a1a1a]">{item.value}</p>
                    {item.sub && <p className="text-xs text-[#717171]">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#e0e0e0]" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-[#717171]">$350 × 3 nights</span><span className="text-[#1a1a1a]">$1,050</span></div>
              <div className="flex justify-between"><span className="text-[#717171]">Cleaning fee</span><span className="text-[#1a1a1a]">$53</span></div>
              <div className="flex justify-between"><span className="text-[#717171]">Service fee</span><span className="text-[#1a1a1a]">$126</span></div>
              <div className="flex justify-between font-display font-700 text-[#1a1a1a] pt-2.5 border-t border-[#e0e0e0]">
                <span>Total paid</span><span className="text-primary">$1,229</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 mb-7"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h3 className="font-display font-600 text-sm text-[#1a1a1a] mb-4">Important information</h3>
          <ul className="space-y-2.5">
            {[
              'A confirmation email has been sent to your registered email address',
              'Check-in is at 3:00 PM, check-out is at 11:00 AM',
              'Free cancellation up to 24 hours before check-in',
              'Contact our support team for any questions',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#717171]">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/explore"
            className="btn-primary flex-1 py-3.5 text-center rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2">
            Explore more <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/host"
            className="btn-outline flex-1 py-3.5 text-center rounded-xl text-sm flex items-center justify-center">
            List your property
          </Link>
        </div>

        <button className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm text-[#717171] hover:text-[#1a1a1a] transition-colors">
          <Download className="w-4 h-4" />Download receipt
        </button>
      </main>
    </div>
  );
};

export default BookingConfirmation;
