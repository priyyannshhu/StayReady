import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, User, Globe, Home } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/explore';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled ? 'navbar-glass' : 'bg-white/95 backdrop-blur-md border-b border-brand-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-rose flex items-center justify-center">
              <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-700 text-xl text-brand-charcoal hidden sm:block">
              Stay<span className="text-primary">Ready</span>
            </span>
          </Link>

          {/* Center Search Pill — desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="search-pill flex items-center w-full">
              <button className="flex items-center flex-1 px-4 py-2.5 text-left gap-2 hover:bg-brand-surface transition-colors duration-150 rounded-l-full">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-brand-charcoal font-display leading-none">Where to?</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Search destinations</div>
                </div>
              </button>
              <div className="w-px h-8 bg-brand-border" />
              <button className="px-4 py-2.5 hover:bg-brand-surface transition-colors duration-150 text-xs">
                <div className="font-semibold text-brand-charcoal font-display leading-none">Check in</div>
                <div className="text-muted-foreground mt-0.5">Add dates</div>
              </button>
              <div className="w-px h-8 bg-brand-border" />
              <button className="px-4 py-2.5 hover:bg-brand-surface transition-colors duration-150 text-xs">
                <div className="font-semibold text-brand-charcoal font-display leading-none">Check out</div>
                <div className="text-muted-foreground mt-0.5">Add dates</div>
              </button>
              <div className="w-px h-8 bg-brand-border" />
              <button className="flex items-center gap-2 px-3 py-2 mr-1 my-1 rounded-full bg-primary hover:bg-primary-hover transition-colors duration-150">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2">
            {/* Host link */}
            <Link
              to="/host"
              className="hidden lg:flex items-center px-4 py-2 rounded-full text-sm font-medium text-brand-charcoal hover:bg-brand-surface transition-colors duration-150 font-display"
            >
              List your property
            </Link>

            {/* Globe */}
            <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-brand-surface transition-colors duration-150">
              <Globe className="w-4 h-4 text-brand-charcoal" />
            </button>

            {/* User menu pill */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 border border-brand-border rounded-full px-3 py-2 hover:shadow-sm-soft transition-all duration-150 bg-white"
            >
              <Menu className="w-4 h-4 text-brand-charcoal" />
              <div className="w-8 h-8 rounded-full bg-brand-charcoal flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="md:hidden pb-3">
          <div className="search-pill flex items-center px-4 py-3 gap-3">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-sm font-semibold text-brand-charcoal font-display">Where to?</div>
              <div className="text-xs text-muted-foreground">Anywhere · Any week · Add guests</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full right-4 mt-2 w-56 bg-white border border-brand-border rounded-2xl shadow-modal animate-fade-in-scale overflow-hidden">
          <nav className="py-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-brand-charcoal hover:bg-brand-surface transition-colors font-medium"
            >
              Explore Properties
            </Link>
            <Link
              to="/host"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-brand-charcoal hover:bg-brand-surface transition-colors font-medium"
            >
              Host Dashboard
            </Link>
            <Link
              to="/prediction"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-brand-charcoal hover:bg-brand-surface transition-colors font-medium"
            >
              AI Price Prediction
            </Link>
            <div className="h-px bg-brand-border mx-4 my-1" />
            <button className="flex items-center w-full px-4 py-3 text-sm text-brand-charcoal hover:bg-brand-surface transition-colors font-medium">
              Sign up
            </button>
            <button className="flex items-center w-full px-4 py-3 text-sm text-brand-gray hover:bg-brand-surface transition-colors">
              Log in
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
