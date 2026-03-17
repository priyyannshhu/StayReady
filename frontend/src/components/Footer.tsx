import { Home, Twitter, Instagram, Facebook, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer-stayready">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-white/10">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-700 text-xl text-white">
              Stay<span className="text-primary">Ready</span>
            </span>
          </Link>
          <p className="text-sm text-white/55 leading-relaxed max-w-xs">
            Find your perfect place to stay. From cozy apartments to luxury villas worldwide.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
              <button key={i} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-150">
                <Icon className="w-4 h-4 text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-display font-600 text-white text-xs uppercase tracking-widest mb-5">Explore</h4>
          <ul className="space-y-3">
            <li><Link to="/explore" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Browse Properties</Link></li>
            <li><Link to="/explore" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Popular Destinations</Link></li>
            <li><Link to="/explore" className="text-sm text-white/55 hover:text-white transition-colors duration-150">New Listings</Link></li>
            <li><Link to="/explore" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Trending Stays</Link></li>
            <li><Link to="/prediction" className="text-sm text-white/55 hover:text-white transition-colors duration-150">AI Price Tool</Link></li>
          </ul>
        </div>

        {/* Hosting */}
        <div>
          <h4 className="font-display font-600 text-white text-xs uppercase tracking-widest mb-5">Hosting</h4>
          <ul className="space-y-3">
            <li><Link to="/host" className="text-sm text-white/55 hover:text-white transition-colors duration-150">List Your Property</Link></li>
            <li><Link to="/host" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Host Dashboard</Link></li>
            <li><Link to="/prediction" className="text-sm text-white/55 hover:text-white transition-colors duration-150">AI Pricing</Link></li>
            <li><Link to="/host" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Host Resources</Link></li>
            <li><Link to="/host" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Community</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-display font-600 text-white text-xs uppercase tracking-widest mb-5">Support</h4>
          <ul className="space-y-3">
            <li><Link to="/support" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Help Center</Link></li>
            <li><Link to="/support" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Safety Info</Link></li>
            <li><Link to="/support" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Cancellation</Link></li>
            <li><Link to="/support" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Report a Concern</Link></li>
            <li><Link to="/support" className="text-sm text-white/55 hover:text-white transition-colors duration-150">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/55">
          © 2024 StayReady. All rights reserved.
        </p>
        <div className="flex items-center gap-1 text-sm text-white/55">
          Made with <Heart className="w-4 h-4 text-primary fill-current" /> by the StayReady Team
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
