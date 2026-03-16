import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { CheckCircle, Calendar, Users, Home, ArrowRight, Download } from 'lucide-react';

const BookingConfirmation = () => {
  const confirmationNumber = `#STAY${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Success animation */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="font-display font-700 text-3xl text-brand-charcoal mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your reservation has been successfully completed. Get ready for an amazing stay!
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="border border-brand-border rounded-3xl overflow-hidden shadow-card mb-6">
          {/* Property image banner */}
          <div className="h-40 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-700 text-lg text-brand-charcoal">Luxury Beach Villa</p>
                <p className="text-sm text-muted-foreground">Miami Beach, FL</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-600 mb-1">Confirmation</p>
                <p className="font-display font-700 text-primary">{confirmationNumber}</p>
              </div>
            </div>

            <div className="section-divider" />

            {/* Booking details grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Check-in', value: 'March 15, 2025', sub: 'After 3:00 PM' },
                { icon: Calendar, label: 'Check-out', value: 'March 18, 2025', sub: 'Before 11:00 AM' },
                { icon: Users, label: 'Guests', value: '2 guests', sub: '' },
                { icon: Home, label: 'Property', value: '3 nights', sub: 'Entire villa' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                    <p className="text-sm font-display font-600 text-brand-charcoal">{item.value}</p>
                    {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="section-divider" />

            {/* Price breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">$350 × 3 nights</span>
                <span className="text-brand-charcoal">$1,050</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cleaning fee</span>
                <span className="text-brand-charcoal">$53</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-brand-charcoal">$126</span>
              </div>
              <div className="flex justify-between font-display font-700 text-brand-charcoal pt-2 border-t border-brand-border">
                <span>Total Paid</span>
                <span className="text-primary">$1,229</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 mb-8">
          <h3 className="font-display font-600 text-sm text-brand-charcoal mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'A confirmation email has been sent to your registered email address',
              'Check-in time is 3:00 PM, check-out time is 11:00 AM',
              'Free cancellation up to 24 hours before check-in',
              'For any questions, contact our support team',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/explore" className="btn-primary flex-1 py-3.5 text-center rounded-xl font-display font-600 flex items-center justify-center gap-2">
            Explore More Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/host" className="flex-1 py-3.5 text-center border border-brand-charcoal rounded-xl font-display font-600 text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all duration-150 flex items-center justify-center gap-2">
            List Your Property
          </Link>
        </div>

        {/* Download button */}
        <button className="w-full mt-3 py-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-brand-charcoal transition-colors">
          <Download className="w-4 h-4" />
          Download receipt
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
