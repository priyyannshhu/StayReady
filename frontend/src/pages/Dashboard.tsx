import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Home, 
  Bed, 
  Bath, 
  Plus,
  LogOut,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin
} from 'lucide-react';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/auth');
      return;
    }

    setUser(JSON.parse(userData));
    
    // Fetch user properties
    fetchUserProperties();
  }, [navigate]);

  const fetchUserProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-emerald-600 bg-emerald-50';
      case 'Occupied': return 'text-red-600 bg-red-50';
      case 'Maintenance': return 'text-amber-600 bg-amber-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary/30 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Building className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-700 text-lg text-slate-800">
                Stay<span className="text-primary">Ready</span>
              </span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-display font-600 text-slate-900">{user?.name}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-700 text-slate-900">{properties.length}</p>
                <p className="text-sm text-slate-600">Total Properties</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-700 text-slate-900">
                  {formatPrice(properties.reduce((sum, p) => sum + p.price, 0))}
                </p>
                <p className="text-sm text-slate-600">Monthly Revenue</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-700 text-slate-900">
                  {properties.filter(p => p.status === 'Available').length}
                </p>
                <p className="text-sm text-slate-600">Available Now</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-700 text-slate-900">
                  {formatPrice(properties.length > 0 ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length : 0)}
                </p>
                <p className="text-sm text-slate-600">Avg. Price/Night</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-700 text-2xl text-slate-900">Your Properties</h2>
            <button
              onClick={() => setShowAddProperty(!showAddProperty)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl text-white font-display font-600"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </button>
          </div>

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="font-display font-600 text-xl text-slate-900 mb-2">No Properties Yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Get started by adding your first property to begin managing your real estate portfolio with AI-powered insights.
              </p>
              <button
                onClick={() => setShowAddProperty(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-xl hover:shadow-2xl text-white font-display font-600"
              >
                <Plus className="w-5 h-5" />
                Add Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property._id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Property Image */}
                  <div className="h-48 bg-slate-100 relative">
                    <img 
                      src={property.image || 'https://images.unsplash.com/photo-1560444815-e8407358525?w=400&h=300&fit=crop'} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-display font-600 ${getStatusColor(property.status)}`}>
                      {property.status}
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-display font-600 text-lg text-slate-900 mb-2">{property.title}</h3>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          <span>{property.area} sqft</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-2xl font-display font-700 text-primary">
                          {formatPrice(property.price)}
                        </p>
                        <p className="text-sm text-slate-600">per night</p>
                      </div>
                      <Link 
                        to={`/property/${property._id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors font-display font-600"
                      >
                        View Details
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3">
          <Link
            to="/prediction"
            className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <TrendingUp className="w-6 h-6" />
          </Link>
          <Link
            to="/settings"
            className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Settings className="w-6 h-6 text-slate-600" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
