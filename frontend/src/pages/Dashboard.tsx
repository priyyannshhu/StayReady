import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building, TrendingUp, Users, DollarSign, Home,
  Bed, Bath, Plus, LogOut, BarChart3, Eye, Edit, Trash2, MapPin, Loader2
} from 'lucide-react';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';

interface Property {
  _id: string; title: string; location: string;
  price: number; status: string; bedrooms: number;
  bathrooms: number; area: number; image: string;
}
interface User { _id: string; name: string; email: string; }

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Available:   { bg: 'bg-emerald-50',   text: 'text-emerald-700',  dot: 'bg-emerald-500' },
  Occupied:    { bg: 'bg-red-50',        text: 'text-red-700',      dot: 'bg-red-500' },
  Maintenance: { bg: 'bg-amber-50',      text: 'text-amber-700',    dot: 'bg-amber-500' },
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { navigate('/auth'); return; }
    setUser(JSON.parse(userData));
    fetchUserProperties();
  }, [navigate]);

  const fetchUserProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/properties/user', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) { const data = await res.json(); setProperties(data.properties || []); }
    } catch (error) { console.error('Error fetching properties:', error); }
    finally { setIsLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/auth');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

  const stats = [
    { icon: Building, label: 'Total Properties', value: properties.length, color: 'text-primary', bg: 'bg-[#fff0f3]' },
    { icon: TrendingUp, label: 'Monthly Revenue', value: formatPrice(properties.reduce((s, p) => s + p.price, 0)), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Users, label: 'Available Now', value: properties.filter(p => p.status === 'Available').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: DollarSign, label: 'Avg Price/Night', value: formatPrice(properties.length > 0 ? properties.reduce((s, p) => s + p.price, 0) / properties.length : 0), color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (isLoading) return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Nav */}
      <nav className="bg-white border-b border-[#e0e0e0]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-700 text-lg text-[#1a1a1a]">
                Stay<span className="text-primary">Ready</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-[#717171]">Welcome back</p>
                <p className="font-display font-600 text-sm text-[#1a1a1a]">{user?.name}</p>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-[#717171] hover:text-primary hover:bg-[#f7f7f7] transition-all duration-150 font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#e0e0e0]">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display font-700 text-xl text-[#1a1a1a] leading-none">{stat.value}</p>
              <p className="text-xs text-[#717171] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Properties header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-700 text-xl text-[#1a1a1a]">Your Properties</h2>
          <button
            onClick={() => setShowAddProperty(!showAddProperty)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        {/* Empty state */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e0e0e0] text-center py-20 px-6">
            <div className="w-16 h-16 bg-[#f7f7f7] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-[#717171]" />
            </div>
            <h3 className="font-display font-600 text-lg text-[#1a1a1a] mb-2">No properties yet</h3>
            <p className="text-[#717171] text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Add your first property to start managing your portfolio with AI-powered pricing insights.
            </p>
            <button onClick={() => setShowAddProperty(true)}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm rounded-xl font-display font-600">
              <Plus className="w-4 h-4" /> Add Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property) => {
              const sc = statusConfig[property.status] ?? { bg: 'bg-[#f7f7f7]', text: 'text-[#717171]', dot: 'bg-[#717171]' };
              return (
                <div key={property._id} className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden hover:border-[#1a1a1a]/20 transition-all duration-200">
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={property.image || 'https://images.unsplash.com/photo-1560444815-e8407358525?w=400&h=300&fit=crop'}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`text-xs font-600 font-display ${sc.text}`}>{property.status}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-600 text-[#1a1a1a] leading-snug flex-1 pr-2">{property.title}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="p-1.5 rounded-lg hover:bg-[#f7f7f7] transition-colors"><Eye className="w-3.5 h-3.5 text-[#717171]" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-[#f7f7f7] transition-colors"><Edit className="w-3.5 h-3.5 text-[#717171]" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#717171] mb-3">
                      <MapPin className="w-3 h-3" />{property.location}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#717171] mb-4">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms} beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} baths</span>
                      <span className="flex items-center gap-1"><Home className="w-3 h-3" />{property.area} sqft</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#e0e0e0]">
                      <div>
                        <p className="font-display font-700 text-base text-primary">{formatPrice(property.price)}</p>
                        <p className="text-xs text-[#717171]">per night</p>
                      </div>
                      <Link to={`/property/${property._id}`}
                        className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg">
                        Details <BarChart3 className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics */}
        {properties.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display font-700 text-xl text-[#1a1a1a] mb-6">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
                <PriceChart prediction={{ predictedPrice: properties[0]?.price ?? 0, confidence: 0.85 }} />
              </div>
              <div className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
                <ConfidenceChart prediction={{ predictedPrice: properties[0]?.price ?? 0, confidence: 0.85 }} />
              </div>
              <div className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
                <PricePerSqFtChart prediction={{ predictedPrice: properties[0]?.price ?? 0, confidence: 0.85 }} area={properties[0]?.area ?? 500} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Link to="/prediction"
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-btn hover:shadow-btn-hover transition-all duration-150"
          title="AI Pricing">
          <TrendingUp className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
