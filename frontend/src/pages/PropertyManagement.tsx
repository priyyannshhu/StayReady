import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';
import Footer from '../components/Footer';
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
  BarChart3,
  Users,
  DollarSign,
  Building,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';

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
    country: 'United States',
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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setShowAnalytics(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-brand-surface py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-display font-600 mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Property Management
            </div>
            <h1 className="font-display font-700 text-4xl sm:text-5xl lg:text-6xl text-brand-charcoal mb-6">
              Stay<span className="text-primary">Ready</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform your property management with intelligent price predictions, 
              comprehensive analytics, and data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/prediction"
                className="btn-primary px-8 py-4 text-lg rounded-xl font-display font-600 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Try AI Price Prediction
              </Link>
              <Link
                to="/host"
                className="px-8 py-4 text-lg rounded-xl font-display font-600 border-2 border-brand-border text-brand-charcoal hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Building className="w-5 h-5" />
                Property Dashboard
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-brand-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-600 text-lg text-brand-charcoal mb-2">Smart Pricing</h3>
              <p className="text-muted-foreground">AI-powered price predictions based on real market data and trends</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-brand-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-600 text-lg text-brand-charcoal mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">Comprehensive insights into property performance and market trends</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-brand-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-600 text-lg text-brand-charcoal mb-2">Data-Driven</h3>
              <p className="text-muted-foreground">Make informed decisions with confidence scores and market analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Prediction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-700 text-3xl text-brand-charcoal mb-4">
              Quick Price Prediction
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant AI-powered price predictions for any property. Just enter the basic details below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <div className="border border-brand-border rounded-3xl p-6 sm:p-8 bg-white shadow-card">
              <h2 className="font-display font-700 text-lg text-brand-charcoal mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Property Details
              </h2>
              <form onSubmit={handleManualSubmit} className="space-y-5">
                {/* Location row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={manualForm.country}
                      onChange={(e) => setManualForm({ ...manualForm, country: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1.5">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={manualForm.city}
                        onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                        placeholder="e.g. New York"
                        className="w-full pl-10 pr-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-brand-charcoal"
                      />
                    </div>
                  </div>
                </div>

                {/* Property type */}
                <div>
                  <label className="block text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={manualForm.propertyType}
                    onChange={(e) => setManualForm({ ...manualForm, propertyType: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-brand-charcoal bg-white"
                  >
                    {PROPERTY_TYPES.map(t => (
                      <option key={t} value={t.toLowerCase()}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms / Bathrooms */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Bed className="w-3 h-3" /> Beds
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={manualForm.bedrooms}
                      onChange={(e) => setManualForm({ ...manualForm, bedrooms: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Bath className="w-3 h-3" /> Baths
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={manualForm.bathrooms}
                      onChange={(e) => setManualForm({ ...manualForm, bathrooms: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-brand-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-600 text-brand-charcoal uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Maximize className="w-3 h-3" /> Area (sqft)
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={manualForm.area}
                      onChange={(e) => setManualForm({ ...manualForm, area: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-brand-charcoal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-4 text-base rounded-xl font-display font-600 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Predicting Price...</>
                  ) : (
                    <><TrendingUp className="w-5 h-5" /> Predict Price <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="space-y-5">
              {!prediction && !isLoading ? (
                <div className="border border-dashed border-brand-border rounded-3xl flex flex-col items-center justify-center py-24 text-center">
                  <Sparkles className="w-14 h-14 text-muted-foreground/30 mb-4" />
                  <p className="font-display font-600 text-brand-charcoal mb-1">Ready to predict</p>
                  <p className="text-sm text-muted-foreground">Fill in property details and click "Predict Price"</p>
                </div>
              ) : isLoading ? (
                <div className="border border-brand-border rounded-3xl flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="font-display font-600 text-brand-charcoal mb-1">Analyzing market data...</p>
                  <p className="text-sm text-muted-foreground">Our ML model is processing your property</p>
                </div>
              ) : prediction ? (
                <div className="animate-fade-in space-y-4">
                  {/* Main price result */}
                  <div className="border border-brand-border rounded-3xl p-6 bg-white shadow-card text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-display font-600 mb-2">AI Predicted Price</p>
                    <p className="font-display font-700 text-5xl text-primary mb-1">${prediction.predictedPrice}</p>
                    <p className="text-muted-foreground text-sm">per night</p>
                    {prediction.fallback && (
                      <div className="mt-3 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
                        ⚡ Estimated based on market data
                      </div>
                    )}
                  </div>

                  {/* Confidence bar */}
                  <div className="border border-brand-border rounded-2xl p-5 bg-white shadow-card">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-display font-600 text-brand-charcoal">Confidence</p>
                      <span className={`font-display font-700 text-lg ${
                        prediction.confidence > 0.8 ? 'text-green-600' :
                        prediction.confidence > 0.6 ? 'text-yellow-600' : 'text-red-500'
                      }`}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-brand-surface rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          prediction.confidence > 0.8 ? 'bg-green-500' :
                          prediction.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Charts */}
                  {showAnalytics && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-brand-border rounded-2xl p-4 bg-white shadow-card">
                          <PriceChart prediction={prediction} />
                        </div>
                        <div className="border border-brand-border rounded-2xl p-4 bg-white shadow-card">
                          <ConfidenceChart prediction={prediction} />
                        </div>
                      </div>
                      <div className="border border-brand-border rounded-2xl p-4 bg-white shadow-card">
                        <PricePerSqFtChart prediction={prediction} area={manualForm.area} />
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-brand-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-700 text-3xl text-brand-charcoal mb-4">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of property managers using AI to optimize their pricing and maximize revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/host"
              className="btn-primary px-8 py-4 text-lg rounded-xl font-display font-600 flex items-center justify-center gap-2"
            >
              <Building className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 text-lg rounded-xl font-display font-600 border-2 border-brand-border text-brand-charcoal hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertyManagement;
