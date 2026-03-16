import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, User, Globe, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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

          {/* Center Navigation — desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-brand-charcoal hover:text-primary transition-colors font-display"
            >
              Dashboard
            </Link>
            <Link
              to="/prediction"
              className="text-sm font-medium text-brand-charcoal hover:text-primary transition-colors font-display"
            >
              AI Price Prediction
            </Link>
            <Link
              to="/host"
              className="text-sm font-medium text-brand-charcoal hover:text-primary transition-colors font-display"
            >
              Property Management
            </Link>
            <Link
              to="/explore"
              className="text-sm font-medium text-brand-charcoal hover:text-primary transition-colors font-display"
            >
              Browse Properties
            </Link>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2">
            {/* Host link */}
            <Link
              to="/prediction"
              className="hidden lg:flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors duration-150 font-display"
            >
              Try AI Prediction
            </Link>

            {/* Globe */}
            <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-brand-surface transition-colors duration-150">
              <Globe className="w-4 h-4 text-brand-charcoal" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

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

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex items-center gap-2 px-4">
            <Link
              to="/"
              className="flex-1 py-2 text-center text-sm font-medium text-primary bg-primary/10 rounded-xl font-display"
            >
              Dashboard
            </Link>
            <Link
              to="/prediction"
              className="flex-1 py-2 text-center text-sm font-medium text-brand-charcoal bg-brand-surface rounded-xl font-display"
            >
              AI Prediction
            </Link>
            <Link
              to="/host"
              className="flex-1 py-2 text-center text-sm font-medium text-brand-charcoal bg-brand-surface rounded-xl font-display"
            >
              Management
            </Link>
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
