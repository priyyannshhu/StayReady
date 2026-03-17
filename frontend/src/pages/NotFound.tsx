import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  useEffect(() => { console.error('404:', location.pathname); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-[#fff0f3] border border-[#fcc] flex items-center justify-center mx-auto mb-6">
          <Home className="w-9 h-9 text-primary" />
        </div>
        <h1 className="font-display font-800 text-6xl text-[#1a1a1a] mb-4">404</h1>
        <p className="text-[#717171] text-lg mb-8">This page seems to have checked out early.</p>
        <Link to="/" className="btn-primary px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 font-display font-600">
          <Home className="w-4 h-4" />Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
