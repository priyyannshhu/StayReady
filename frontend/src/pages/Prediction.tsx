import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';
import { gsap } from 'gsap';
import {
  TrendingUp, MapPin, Home, Bed, Bath, Maximize,
  Loader2, Sparkles, ChevronRight, Star, ArrowRight, Car, AlertCircle
} from 'lucide-react';

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

const Prediction = () => {
  const [form, setForm] = useState<ManualPredictionForm>({
    country: 'India', city: '', propertyType: 'apartment',
    bedrooms: 1, bathrooms: 1, area: 500,
    furnishing: 'furnished', parking: false, propertyAge: 5,
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    gsap.fromTo('.prediction-header', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo('.prediction-form', { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.15, ease: 'power2.out' });
    gsap.fromTo('.prediction-results', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setPrediction(null); setShowAnalytics(false); setError(null);
    gsap.to('#predict-button', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    try {
      const res = await fetch(`${API_BASE_URL}/predict-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: form.country, city: form.city,
          property_type: form.propertyType,
          bedrooms: form.bedrooms, bathrooms: form.bathrooms,
          area: form.area, furnishing: form.furnishing,
          parking: form.parking, property_age: form.propertyAge,
          accommodates: form.bedrooms + 1,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || 'Prediction failed');
      }
      
      const data = await res.json();
      setPrediction({ predictedPrice: data.predicted_price, confidence: data.confidence, ...data });
      setShowAnalytics(true);
    } catch (e: any) { 
      console.error('Prediction error:', e); 
      setError(e.message || 'Failed to get prediction');
    }
    finally { setIsLoading(false); }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const confidenceColor = (c: number) =>
    c > 0.8 ? 'text-emerald-600' : c > 0.6 ? 'text-amber-600' : 'text-red-500';
  const confidenceBar = (c: number) =>
    c > 0.8 ? 'bg-emerald-500' : c > 0.6 ? 'bg-amber-500' : 'bg-red-500';
  const confidenceLabel = (c: number) =>
    c > 0.8 ? 'High confidence' : c > 0.6 ? 'Moderate confidence' : 'Low confidence';

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Header */}
        <div className="prediction-header text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0e0e0] rounded-full text-sm font-display font-600 text-[#1a1a1a] mb-6"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Sparkles className="w-4 h-4 text-primary" />
            AI-Powered Price Intelligence
          </div>
          <h1 className="font-display font-800 text-4xl sm:text-5xl text-[#1a1a1a] mb-4 leading-tight">
            Smart Price<br />
            <span className="text-primary">Prediction</span>
          </h1>
          <p className="text-[#717171] text-lg max-w-xl mx-auto leading-relaxed">
            Enter your property details and our ML model will instantly predict the optimal nightly rate based on real market data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Form */}
          <div className="prediction-form bg-white rounded-2xl border border-[#e0e0e0] p-7"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)' }}>

            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 bg-[#fff0f3] border border-[#fcc] rounded-xl flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-700 text-lg text-[#1a1a1a]">Property Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Country</label>
                  <input type="text" value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    className={inputCls} />
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaaaaa]" />
                    <input type="text" required value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="Mumbai, Delhi…"
                      className={`${inputCls} pl-10`} />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="form-label">Property Type</label>
                <select value={form.propertyType}
                  onChange={e => setForm({ ...form, propertyType: e.target.value })}
                  className={inputCls}>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                </select>
              </div>

              {/* Room Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label flex items-center gap-1"><Bed className="w-3 h-3" />Beds</label>
                  <input type="number" min={1} max={20} value={form.bedrooms}
                    onChange={e => setForm({ ...form, bedrooms: parseInt(e.target.value) || 1 })}
                    className={inputCls} />
                </div>
                <div>
                  <label className="form-label flex items-center gap-1"><Bath className="w-3 h-3" />Baths</label>
                  <input type="number" min={1} max={20} value={form.bathrooms}
                    onChange={e => setForm({ ...form, bathrooms: parseInt(e.target.value) || 1 })}
                    className={inputCls} />
                </div>
                <div>
                  <label className="form-label flex items-center gap-1"><Maximize className="w-3 h-3" />Sqft</label>
                  <input type="number" min={100} value={form.area}
                    onChange={e => setForm({ ...form, area: parseInt(e.target.value) || 100 })}
                    className={inputCls} />
                </div>
              </div>

              {/* Furnishing */}
              <div>
                <label className="form-label">Furnishing</label>
                <div className="flex gap-2">
                  {FURNISHING_OPTIONS.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setForm({ ...form, furnishing: opt })}
                      className={`flex-1 py-2.5 text-xs rounded-xl border font-medium capitalize transition-all duration-150 ${
                        form.furnishing === opt
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                          : 'border-[#dddddd] text-[#717171] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                      }`}>
                      {opt.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parking + Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Parking</label>
                  <button type="button"
                    onClick={() => setForm({ ...form, parking: !form.parking })}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-150 ${
                      form.parking
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : 'border-[#dddddd] text-[#717171] hover:border-[#1a1a1a]'
                    }`}>
                    <span className="flex items-center gap-2"><Car className="w-4 h-4" />Parking</span>
                    <span className="text-xs">{form.parking ? 'Yes' : 'No'}</span>
                  </button>
                </div>
                <div>
                  <label className="form-label">Property Age (yrs)</label>
                  <input type="number" min={0} max={100} value={form.propertyAge}
                    onChange={e => setForm({ ...form, propertyAge: parseInt(e.target.value) || 0 })}
                    className={inputCls} />
                </div>
              </div>

              <button id="predict-button" type="submit" disabled={isLoading}
                className="btn-primary w-full py-4 rounded-xl text-base flex items-center justify-center gap-2">
                {isLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" />Predicting price…</>
                  : <><TrendingUp className="w-5 h-5" />Predict price<ArrowRight className="w-4 h-4" /></>}
              </button>
              
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="prediction-results space-y-5">
            {!prediction && !isLoading && (
              <div className="bg-white rounded-2xl border border-[#e0e0e0] p-10 text-center"
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div className="w-16 h-16 bg-[#fff0f3] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#fcc]">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-700 text-lg text-[#1a1a1a] mb-2">Ready to predict</h3>
                <p className="text-[#717171] text-sm max-w-xs mx-auto leading-relaxed">
                  Fill in your property details on the left and hit "Predict price" to get your AI-powered recommendation.
                </p>
              </div>
            )}

            {prediction && (
              <div className="animate-fade-in space-y-5">
                {/* Main result */}
                <div className="bg-white rounded-2xl border border-[#e0e0e0] p-8 text-center"
                  style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)' }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fff0f3] border border-[#fcc] rounded-full text-primary text-xs font-display font-600 mb-5">
                    <Star className="w-3.5 h-3.5" />
                    AI Predicted Price
                  </div>
                  <div className="mb-2">
                    <span className="font-display font-800 text-5xl text-[#1a1a1a]">
                      {formatPrice(prediction.predictedPrice)}
                    </span>
                    <span className="text-[#717171] text-base ml-2">per night</span>
                  </div>
                  {prediction.fallback && (
                    <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                      ⚡ Estimated based on market data analysis
                    </div>
                  )}
                </div>

                {/* Confidence */}
                <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6"
                  style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-display font-600 text-sm text-[#1a1a1a]">Confidence Score</p>
                      <p className="text-xs text-[#717171] mt-0.5">{confidenceLabel(prediction.confidence)}</p>
                    </div>
                    <span className={`font-display font-700 text-2xl ${confidenceColor(prediction.confidence)}`}>
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#f0f0f0] rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-1000 ${confidenceBar(prediction.confidence)}`}
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Analytics charts */}
                {showAnalytics && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl border border-[#e0e0e0] p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <PriceChart prediction={prediction} />
                      </div>
                      <div className="bg-white rounded-2xl border border-[#e0e0e0] p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ConfidenceChart prediction={prediction} />
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#e0e0e0] p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      <PricePerSqFtChart prediction={prediction} area={form.area} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
