import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Home, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { 
    setMenuOpen(false); 
    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const navLinks = [
    { to: '/explore', label: 'Browse Properties' },
    { to: '/prediction', label: 'AI Pricing' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'navbar-glass' : 'bg-white border-b border-[#e0e0e0]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-rose flex items-center justify-center">
              <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-700 text-xl text-[#1a1a1a] hidden sm:block">
              Stay<span className="text-primary">Ready</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  location.pathname === link.to
                    ? 'text-primary bg-[#fff0f3]'
                    : 'text-[#1a1a1a] hover:bg-[#f7f7f7]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              // Authenticated user buttons
              <>
                <Link
                  to="/dashboard"
                  className="hidden lg:inline-flex items-center gap-1.5 btn-secondary px-4 py-2 text-sm rounded-full"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 border border-[#dddddd] rounded-full px-3 py-2 hover:shadow-sm-soft transition-all duration-150 bg-white"
                  aria-label="Open menu"
                >
                  {menuOpen ? <X className="w-4 h-4 text-[#1a1a1a]" /> : <Menu className="w-4 h-4 text-[#1a1a1a]" />}
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
              </>
            ) : (
              // Unauthenticated user buttons
              <>
                <Link
                  to="/auth"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f7f7] rounded-full transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-full transition-colors duration-150 shadow-btn"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-primary text-white'
                  : 'bg-[#f7f7f7] text-[#1a1a1a]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Dropdown */}
      {menuOpen && isAuthenticated && (
        <div className="absolute top-full right-4 mt-2 w-56 bg-white border border-[#e0e0e0] rounded-2xl shadow-modal animate-fade-in-scale overflow-hidden">
          <nav className="py-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-[#e0e0e0] mx-4 my-1" />
            <Link to="/dashboard" className="flex items-center px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors font-semibold">
              Dashboard
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              className="w-full flex items-center px-4 py-3 text-sm text-[#717171] hover:bg-[#f7f7f7] transition-colors"
            >
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
