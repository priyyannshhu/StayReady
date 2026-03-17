import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  TrendingUp, MapPin, Home, Bed, Bath, Maximize, Loader2, Sparkles,
  Star, ArrowRight, ArrowUpRight, Building, DollarSign, Users, Zap, BarChart3, Shield
} from 'lucide-react';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';

interface ManualPredictionForm {
  country: string; city: string; propertyType: string;
  bedrooms: number; bathrooms: number; area: number;
  furnishing: string; parking: boolean; propertyAge: number;
}
interface PredictionResult {
  predictedPrice: number; confidence: number;
  features?: Record<string, unknown>; fallback?: boolean; city?: string;
}

const PROPERTY_TYPES = ['Apartment','Villa','House','Condo','Studio','Cabin','Townhouse'];
const FURNISHING_OPTIONS = ['furnished','semi-furnished','unfurnished'];

const inputCls = "w-full px-4 py-3 border border-[#dddddd] rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all duration-150 bg-white placeholder-[#aaaaaa]";

const PropertyManagement = () => {
  const [manualForm, setManualForm] = useState<ManualPredictionForm>({
    country: 'India', city: '', propertyType: 'apartment',
    bedrooms: 1, bathrooms: 1, area: 500,
    furnishing: 'furnished', parking: false, propertyAge: 5,
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    gsap.fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.hero-subtitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.fromTo('.hero-buttons', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, delay: 0.35, ease: 'power3.out' });
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.fromTo(card as Element,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.6 + i * 0.1, ease: 'power2.out' }
      );
    });
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setPrediction(null); setShowAnalytics(false);
    gsap.to('#predict-button', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    try {
      const res = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: manualForm.country, city: manualForm.city,
          property_type: manualForm.propertyType,
          bedrooms: manualForm.bedrooms, bathrooms: manualForm.bathrooms,
          area: manualForm.area, furnishing: manualForm.furnishing,
          parking: manualForm.parking, property_age: manualForm.propertyAge,
          accommodates: manualForm.bedrooms + 1,
        }),
      });
      const data = await res.json();
      setPrediction({ predictedPrice: data.predicted_price, confidence: data.confidence, ...data });
      setShowAnalytics(true);
    } catch (e) { console.error('Prediction error:', e); }
    finally { setIsLoading(false); }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const confColor = (c: number) => c > 0.8 ? 'text-emerald-600' : c > 0.6 ? 'text-amber-600' : 'text-red-500';
  const confBar   = (c: number) => c > 0.8 ? 'bg-emerald-500' : c > 0.6 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-white">

        {/* Subtle background circles — light only */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,56,92,0.04) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff0f3] border border-[#fcc] rounded-full text-primary text-sm font-display font-600 mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Property Intelligence
          </div>

          {/* Headline */}
          <h1 className="hero-title font-display font-800 text-5xl sm:text-6xl lg:text-7xl text-[#1a1a1a] mb-6 leading-[1.05]">
            Transform your<br />
            <span className="text-primary">property management</span><br />
            with smart AI
          </h1>

          <p className="hero-subtitle text-xl text-[#717171] mb-10 max-w-2xl mx-auto leading-relaxed">
            Intelligent price predictions, comprehensive analytics, and data-driven insights
            that maximise your property's potential.
          </p>

          {/* CTAs */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link to="/prediction"
              className="group btn-primary px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Try AI Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/host"
              className="btn-outline px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
              <Building className="w-5 h-5" />
              Property Dashboard
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: DollarSign, value: '95%',  label: 'Accuracy Rate',         bg: 'bg-[#fff0f3]', border: 'border-[#fcc]',     iconBg: 'bg-primary' },
              { icon: Users,      value: '10K+', label: 'Properties Analysed',   bg: 'bg-[#f0faf4]', border: 'border-[#c6e9d2]', iconBg: 'bg-emerald-500' },
              { icon: Zap,        value: '2.5M', label: 'Data Points Processed', bg: 'bg-[#fff8f0]', border: 'border-[#fde8c8]', iconBg: 'bg-amber-500' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-6 text-center`}
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-display font-800 text-3xl text-[#1a1a1a] mb-1">{s.value}</p>
                <p className="text-sm text-[#717171] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-[#f7f7f7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-700 text-4xl text-[#1a1a1a] mb-4">
              Powerful features for<br />
              <span className="text-primary">modern real estate</span>
            </h2>
            <p className="text-lg text-[#717171] max-w-2xl mx-auto">
              Everything you need to manage properties efficiently and make data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp, iconBg: 'bg-[#fff0f3]', iconColor: 'text-primary',
                title: 'Smart Pricing',
                desc: 'Advanced AI algorithms analyse market trends, property features, and location data to provide accurate price predictions that maximise your rental income.',
              },
              {
                icon: BarChart3, iconBg: 'bg-[#f0f7ff]', iconColor: 'text-blue-600',
                title: 'Advanced Analytics',
                desc: 'Comprehensive dashboards with real-time insights, market comparisons, and performance metrics to optimise your property portfolio strategy.',
              },
              {
                icon: Shield, iconBg: 'bg-[#f0faf4]', iconColor: 'text-emerald-600',
                title: 'Data Security',
                desc: 'Enterprise-grade security with encrypted data storage, secure authentication, and regular backups to protect your property information.',
              },
            ].map(f => (
              <div key={f.title}
                className="feature-card bg-white rounded-2xl border border-[#e0e0e0] p-8 hover:shadow-card transition-all duration-200"
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-display font-700 text-lg text-[#1a1a1a] mb-3">{f.title}</h3>
                <p className="text-sm text-[#717171] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Prediction Demo ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-700 text-4xl text-[#1a1a1a] mb-4">
              Try AI price prediction <span className="text-primary">instantly</span>
            </h2>
            <p className="text-lg text-[#717171] max-w-xl mx-auto">
              Experience the power of AI. Just enter your property details and see the result.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Form */}
            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-8"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)' }}>

              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 bg-[#fff0f3] border border-[#fcc] rounded-xl flex items-center justify-center">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-700 text-lg text-[#1a1a1a]">Property Details</h3>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Country</label>
                    <input type="text" value={manualForm.country}
                      onChange={e => setManualForm({ ...manualForm, country: e.target.value })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="form-label">City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa]" />
                      <input type="text" required value={manualForm.city}
                        onChange={e => setManualForm({ ...manualForm, city: e.target.value })}
                        placeholder="Mumbai, Delhi…"
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Property Type</label>
                  <select value={manualForm.propertyType}
                    onChange={e => setManualForm({ ...manualForm, propertyType: e.target.value })}
                    className={inputCls}>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="form-label flex items-center gap-1"><Bed className="w-3 h-3" />Beds</label>
                    <input type="number" min={1} max={20} value={manualForm.bedrooms}
                      onChange={e => setManualForm({ ...manualForm, bedrooms: parseInt(e.target.value) })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="form-label flex items-center gap-1"><Bath className="w-3 h-3" />Baths</label>
                    <input type="number" min={1} max={20} value={manualForm.bathrooms}
                      onChange={e => setManualForm({ ...manualForm, bathrooms: parseInt(e.target.value) })}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="form-label flex items-center gap-1"><Maximize className="w-3 h-3" />Sqft</label>
                    <input type="number" min={100} value={manualForm.area}
                      onChange={e => setManualForm({ ...manualForm, area: parseInt(e.target.value) })}
                      className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Furnishing</label>
                  <div className="flex gap-2">
                    {FURNISHING_OPTIONS.map(opt => (
                      <button key={opt} type="button"
                        onClick={() => setManualForm({ ...manualForm, furnishing: opt })}
                        className={`flex-1 py-2.5 text-xs rounded-xl border font-medium capitalize transition-all duration-150 ${
                          manualForm.furnishing === opt
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                            : 'border-[#dddddd] text-[#717171] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                        }`}>
                        {opt.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button id="predict-button" type="submit" disabled={isLoading}
                  className="btn-primary w-full py-4 rounded-xl text-sm flex items-center justify-center gap-2 font-display font-600">
                  {isLoading
                    ? <><Loader2 className="w-5 h-5 animate-spin" />Predicting price…</>
                    : <><TrendingUp className="w-5 h-5" />Predict price<ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="space-y-5">
              {!prediction && !isLoading && (
                <div className="bg-[#f7f7f7] border border-[#e0e0e0] rounded-2xl p-12 text-center">
                  <div className="w-14 h-14 bg-[#fff0f3] border border-[#fcc] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-display font-600 text-[#1a1a1a] mb-1">Ready to predict</p>
                  <p className="text-sm text-[#717171]">Fill in your property details and click "Predict price"</p>
                </div>
              )}

              {prediction && (
                <div className="animate-fade-in space-y-5">
                  {/* Main result */}
                  <div className="bg-white border border-[#e0e0e0] rounded-2xl p-8 text-center"
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fff0f3] border border-[#fcc] rounded-full text-primary text-xs font-600 mb-5">
                      <Star className="w-3.5 h-3.5" />AI Predicted Price
                    </div>
                    <div>
                      <span className="font-display font-800 text-5xl text-[#1a1a1a]">{formatPrice(prediction.predictedPrice)}</span>
                      <span className="text-[#717171] text-base ml-2">per night</span>
                    </div>
                    {prediction.fallback && (
                      <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                        ⚡ Estimated based on market data analysis
                      </div>
                    )}
                  </div>

                  {/* Confidence */}
                  <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6"
                    style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-display font-600 text-sm text-[#1a1a1a]">Confidence Score</p>
                      <span className={`font-display font-700 text-2xl ${confColor(prediction.confidence)}`}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f0f0f0] rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all duration-1000 ${confBar(prediction.confidence)}`}
                        style={{ width: `${prediction.confidence * 100}%` }} />
                    </div>
                  </div>

                  {showAnalytics && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <PriceChart prediction={prediction} />
                        </div>
                        <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <ConfidenceChart prediction={prediction} />
                        </div>
                      </div>
                      <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-700 text-4xl text-white mb-4">
            Ready to transform your<br />
            <span className="text-primary">property business?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of property managers using AI to optimise pricing and maximise revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/host"
              className="group px-8 py-4 rounded-xl text-base font-display font-600 bg-primary text-white hover:bg-[hsl(349,100%,54%)] transition-colors flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 14px rgba(255,56,92,0.45)' }}>
              <Building className="w-5 h-5" />
              Go to Dashboard
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link to="/explore"
              className="px-8 py-4 rounded-xl text-base font-display font-600 text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all duration-150 flex items-center justify-center">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PropertyManagement;