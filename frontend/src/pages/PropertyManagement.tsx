import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  TrendingUp, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Maximize, 
  Loader2, 
  Sparkles, 
  ChevronRight,
  Star,
  CheckCircle,
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Building,
  DollarSign,
  Users,
  Zap,
  BarChart3,
  Shield
} from 'lucide-react';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';

interface ManualPredictionForm {
  country: string;
  city: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnishing: string;
  parking: boolean;
  propertyAge: number;
}

interface PredictionResult {
  predictedPrice: number;
  confidence: number;
  features?: Record<string, unknown>;
  fallback?: boolean;
  city?: string;
}

const PROPERTY_TYPES = ['Apartment', 'Villa', 'House', 'Condo', 'Studio', 'Cabin', 'Townhouse'];
const FURNISHING_OPTIONS = ['furnished', 'semi-furnished', 'unfurnished'];

const PropertyManagement = () => {
  const [manualForm, setManualForm] = useState<ManualPredictionForm>({
    country: 'India',
    city: '',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    furnishing: 'furnished',
    parking: false,
    propertyAge: 5,
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Hero animations
    gsap.fromTo('.hero-title', {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.fromTo('.hero-subtitle', {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.fromTo('.hero-buttons', {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.4,
      ease: 'power3.out'
    });

    // Feature cards animation
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
      gsap.fromTo(card as Element, {
        opacity: 0,
        y: 60,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.8 + (index * 0.1),
        ease: 'power2.out'
      });
    });

    // Floating animation for hero elements
    gsap.to('.floating-element', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setShowAnalytics(false);
    
    // Button animation
    gsap.to('#predict-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    try {
      const response = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: manualForm.country,
          city: manualForm.city,
          property_type: manualForm.propertyType,
          bedrooms: manualForm.bedrooms,
          bathrooms: manualForm.bathrooms,
          area: manualForm.area,
          furnishing: manualForm.furnishing,
          parking: manualForm.parking,
          property_age: manualForm.propertyAge,
          accommodates: manualForm.bedrooms + 1,
        }),
      });
      const data = await response.json();
      setPrediction({ predictedPrice: data.predicted_price, confidence: data.confidence, ...data });
      setShowAnalytics(true);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-coral/5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-brand-fuchsia/5 rounded-full blur-3xl floating-element" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-coral/5 via-brand-pink/3 to-brand-fuchsia/5"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-coral/10 rounded-full text-brand-coral text-sm font-display font-600 mb-8 backdrop-blur-sm border border-brand-coral/20">
            <Sparkles className="w-4 h-4" />
            AI-Powered Property Intelligence
          </div>

          {/* Main Title */}
          <h1 className="hero-title font-display font-800 text-5xl sm:text-6xl lg:text-7xl text-brand-slate mb-6 leading-tight">
            Transform Your
            <span className="text-brand-coral"> Property Management</span>
            <br />
            with Smart AI
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-xl sm:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the future of real estate with intelligent price predictions, 
            comprehensive analytics, and data-driven insights that maximize your property's potential.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/prediction"
              className="group px-8 py-4 rounded-2xl text-lg font-display font-600 text-white bg-gradient-to-r from-brand-coral to-brand-pink hover:from-brand-pink hover:to-brand-fuchsia transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Try AI Prediction
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/host"
              className="px-8 py-4 rounded-2xl text-lg font-display font-600 text-brand-slate bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 border-2 border-brand-pink/30 hover:border-brand-coral hover:text-brand-coral transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center"
            >
              <Building className="w-5 h-5 mr-2" />
              Property Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 rounded-2xl border border-brand-pink/20 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-coral to-brand-pink rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-700 text-3xl text-brand-slate dark:text-white mb-2">95%</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Accuracy Rate</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900 dark:to-orange-900 rounded-2xl border border-brand-fuchsia/20 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-pink to-brand-fuchsia rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-700 text-3xl text-brand-slate dark:text-white mb-2">10K+</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Properties Analyzed</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900 dark:to-amber-900 rounded-2xl border border-brand-rose/20 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-fuchsia to-brand-rose rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-700 text-3xl text-brand-slate dark:text-white mb-2">2.5M</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Data Points Processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-700 text-4xl text-slate-900 mb-4">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#e6002e] bg-gradient-to-r"> Modern Real Estate</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to manage properties efficiently and make data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card group p-8 bg-white rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#e6002e] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-600 text-xl text-slate-900 mb-3">Smart Pricing</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced AI algorithms analyze market trends, property features, and location data to provide accurate price predictions that maximize your rental income.
              </p>
            </div>

            <div className="feature-card group p-8 bg-white rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-300" style={{animationDelay: '0.1s'}}>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-600 text-xl text-slate-900 mb-3">Advanced Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive dashboards with real-time insights, market comparisons, and performance metrics to optimize your property portfolio strategy.
              </p>
            </div>

            <div className="feature-card group p-8 bg-white rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-300" style={{animationDelay: '0.2s'}}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-600 text-xl text-slate-900 mb-3">Data Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Enterprise-grade security with encrypted data storage, secure authentication, and regular backups to protect your property information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Prediction Demo */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-700 text-4xl text-slate-900 mb-4">
              Try AI Price Prediction
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#e6002e] bg-gradient-to-r"> Instantly</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
              Experience the power of AI with our quick prediction tool. Just enter your property details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
              <h2 className="font-display font-700 text-2xl text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-[#e6002e] rounded-xl flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                Property Details
              </h2>
              <form onSubmit={handleManualSubmit} className="space-y-6">
                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={manualForm.country}
                      onChange={(e) => setManualForm({ ...manualForm, country: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={manualForm.city}
                        onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                        placeholder="e.g. Mumbai, Delhi, Bangalore"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2">
                    Property Type
                  </label>
                  <select
                    value={manualForm.propertyType}
                    onChange={(e) => setManualForm({ ...manualForm, propertyType: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 bg-white transition-all duration-200"
                  >
                    {PROPERTY_TYPES.map(t => (
                      <option key={t} value={t.toLowerCase()}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Room Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Bed className="w-3 h-3" /> Beds
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={manualForm.bedrooms}
                      onChange={(e) => setManualForm({ ...manualForm, bedrooms: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Bath className="w-3 h-3" /> Baths
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={manualForm.bathrooms}
                      onChange={(e) => setManualForm({ ...manualForm, bathrooms: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Maximize className="w-3 h-3" /> Area (sqft)
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={manualForm.area}
                      onChange={(e) => setManualForm({ ...manualForm, area: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Furnishing */}
                <div>
                  <label className="block text-sm font-display font-600 text-slate-700 uppercase tracking-wide mb-2">
                    Furnishing
                  </label>
                  <div className="flex gap-3">
                    {FURNISHING_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setManualForm({ ...manualForm, furnishing: opt })}
                        className={`flex-1 py-3 text-sm rounded-xl border transition-all duration-200 font-medium capitalize ${
                          manualForm.furnishing === opt
                            ? 'bg-primary text-white border-primary shadow-lg'
                            : 'border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {opt.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="predict-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl text-base font-display font-600 text-white bg-gradient-to-r from-primary to-[#e6002e] hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Predicting Price...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Predict Price
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {prediction && (
                <div className="animate-fade-in">
                  {/* Main Result */}
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full text-primary text-sm font-display font-600 mb-4">
                      <Star className="w-4 h-4 mr-1" />
                      AI Predicted Price
                    </div>
                    <div className="mb-2">
                      <span className="font-display font-800 text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#e6002e] bg-gradient-to-r">
                        {formatPrice(prediction.predictedPrice)}
                      </span>
                      <span className="text-slate-600 text-lg ml-2">per night</span>
                    </div>
                    {prediction.fallback && (
                      <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                        ⚡ Estimated based on market data analysis
                      </div>
                    )}
                  </div>

                  {/* Confidence */}
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-display font-600 text-slate-900">Confidence Score</h4>
                      <span className={`font-display font-700 text-2xl ${
                        prediction.confidence > 0.8 ? 'text-emerald-600' :
                        prediction.confidence > 0.6 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          prediction.confidence > 0.8 ? 'bg-emerald-500 w-full' :
                          prediction.confidence > 0.6 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Analytics */}
                  {showAnalytics && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
                          <PriceChart prediction={prediction} />
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
                          <ConfidenceChart prediction={prediction} />
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
                        <PricePerSqFtChart prediction={prediction} area={manualForm.area} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-[#e6002e] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-700 text-4xl text-white mb-6">
            Ready to Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 bg-gradient-to-r"> Property Business?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of property managers using AI to optimize pricing and maximize revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/host"
              className="group px-8 py-4 rounded-2xl text-lg font-display font-600 text-primary bg-white hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center"
            >
              <Building className="w-5 h-5 mr-2" />
              Go to Dashboard
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 rounded-2xl text-lg font-display font-600 text-white border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      </div>
  );
};

export default PropertyManagement;
