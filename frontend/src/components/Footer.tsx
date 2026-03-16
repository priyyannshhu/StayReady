import { Home, Twitter, Instagram, Facebook, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-stayready">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-rose flex items-center justify-center">
                <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-700 text-xl text-white">
                Stay<span className="text-primary">Ready</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Find your perfect place to stay. From cozy apartments to luxury villas, we have it all.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-150"
                >
                  <Icon className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-600 text-white text-sm uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-3">
              {['Browse Properties', 'Popular Destinations', 'Trending Stays', 'New Listings', 'Price Predictions'].map((item) => (
                <li key={item}>
                  <Link to="/explore" className="text-sm text-white/60 hover:text-white transition-colors duration-150">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="font-display font-600 text-white text-sm uppercase tracking-wider mb-4">Hosting</h4>
            <ul className="space-y-3">
              {['List Your Property', 'Host Dashboard', 'AI Price Tool', 'Host Resources', 'Community Forum'].map((item) => (
                <li key={item}>
                  <Link to="/host" className="text-sm text-white/60 hover:text-white transition-colors duration-150">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-600 text-white text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Safety Information', 'Cancellation Options', 'Report a Concern', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-150">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} StayReady, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Terms</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Sitemap</a>
          </div>
          <p className="text-xs text-white/30 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-primary text-primary" /> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
