import { useState, useEffect } from 'react';
import { PriceChart, ConfidenceChart, PricePerSqFtChart } from '../components/AnalyticsCharts';
import { TrendingUp, Home, MapPin, Bed, Bath, Maximize, ChevronRight, Loader2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

interface PredictionData {
  predictedPrice: number;
  confidence: number;
  averageMarketPrice: number;
  pricePerSqFt: number;
}

const HostDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch demo properties using backend API
    const loadProperties = async () => {
      try {
        const response = await fetch('/api/properties/demo');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    loadProperties();
  }, []);

  const handlePredictPrice = async (property: Property) => {
    setIsLoading(true);
    setSelectedPropertyId(property.id);
    try {
      const response = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: property.location.split(',')[0],
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          accommodates: property.bedrooms + 1,
          property_type: 'Apartment',
        }),
      });
      const data = await response.json();
      const averageMarketPrice = property.price * 1.1;
      setPredictionData({
        predictedPrice: data.predicted_price,
        confidence: data.confidence,
        averageMarketPrice,
        pricePerSqFt: data.predicted_price / property.area,
      });
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display font-700 text-2xl sm:text-3xl text-[#1a1a1a]">Host Dashboard</h1>
          </div>
          <p className="text-[#717171] text-sm ml-[52px]">
            Manage your listings and get AI-powered price predictions.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Listings', value: properties.length || 3, icon: Home, color: 'text-primary bg-primary/10' },
            { label: 'Available', value: properties.filter(p => p.status === 'Available').length || 2, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
            { label: 'Avg. Price / Night', value: `$${properties.length ? Math.round(properties.reduce((a, b) => a + b.price, 0) / properties.length) : 320}`, icon: ChevronRight, color: 'text-blue-600 bg-blue-50' },
          ].map((stat) => (
            <div key={stat.label} className="border border-[#e0e0e0] rounded-2xl p-5 bg-white shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-[#717171] font-medium uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="font-display font-700 text-2xl text-[#1a1a1a]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Properties List */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-700 text-lg text-[#1a1a1a] mb-5">Your Properties</h2>
            <div className="space-y-4">
              {properties.length === 0 ? (
                // Skeleton loading
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-[#e0e0e0] rounded-2xl p-4 space-y-3">
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-9 w-full rounded-xl" />
                  </div>
                ))
              ) : (
                properties.map((property) => (
                  <div
                    key={property.id}
                    className={`border rounded-2xl p-4 transition-all duration-150 ${
                      selectedPropertyId === property.id
                        ? 'border-primary bg-primary/5 shadow-btn/20'
                        : 'border-[#e0e0e0] bg-white hover:border-[#1a1a1a] shadow-card'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-600 text-sm text-[#1a1a1a]">{property.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-[#717171] mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {property.location}
                        </div>
                      </div>
                      <span className={property.status === 'Available' ? 'badge-available' : 'badge-soldout'}>
                        {property.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#717171] mb-3">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms} beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.bathrooms} baths</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area} sqft</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display font-700 text-base text-[#1a1a1a]">${property.price}<span className="text-xs font-body font-400 text-[#717171]">/night</span></span>
                    </div>
                    <button
                      onClick={() => handlePredictPrice(property)}
                      disabled={isLoading && selectedPropertyId === property.id}
                      className="btn-primary w-full py-2.5 text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading && selectedPropertyId === property.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</>
                      ) : (
                        <><TrendingUp className="w-4 h-4" /> Get AI Price Prediction</>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="lg:col-span-3">
            <h2 className="font-display font-700 text-lg text-[#1a1a1a] mb-5">Price Analytics</h2>

            {!predictionData ? (
              <div className="border border-dashed border-[#e0e0e0] rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                <TrendingUp className="w-12 h-12 text-[#717171]/40 mb-4" />
                <p className="font-display font-600 text-[#1a1a1a] mb-1">No prediction yet</p>
                <p className="text-sm text-[#717171]">Select a property and click "Get AI Price Prediction"</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'AI Predicted', value: `$${predictionData.predictedPrice}`, sub: 'per night', positive: true },
                    { label: 'Market Average', value: `$${predictionData.averageMarketPrice}`, sub: 'per night', positive: false },
                    {
                      label: 'Difference',
                      value: `${predictionData.predictedPrice > predictionData.averageMarketPrice ? '+' : ''}$${Math.round(predictionData.predictedPrice - predictionData.averageMarketPrice)}`,
                      sub: 'vs market',
                      positive: predictionData.predictedPrice > predictionData.averageMarketPrice,
                    },
                  ].map((kpi) => (
                    <div key={kpi.label} className="border border-[#e0e0e0] rounded-2xl p-4 text-center bg-white shadow-card">
                      <p className="text-xs text-[#717171] uppercase tracking-wide mb-2 font-medium">{kpi.label}</p>
                      <p className={`font-display font-700 text-xl ${kpi.positive ? 'text-green-600' : 'text-[#1a1a1a]'}`}>{kpi.value}</p>
                      <p className="text-xs text-[#717171] mt-0.5">{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Confidence */}
                <div className="border border-[#e0e0e0] rounded-2xl p-5 bg-white shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-600 text-sm text-[#1a1a1a]">Prediction Confidence</h3>
                    <span className={`font-display font-700 text-lg ${
                      predictionData.confidence > 0.8 ? 'text-green-600' :
                      predictionData.confidence > 0.6 ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                      {(predictionData.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#f7f7f7] rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        predictionData.confidence > 0.8 ? 'bg-green-500' :
                        predictionData.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${predictionData.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-[#e0e0e0] rounded-2xl p-4 bg-white shadow-card">
                    <PriceChart prediction={predictionData} />
                  </div>
                  <div className="border border-[#e0e0e0] rounded-2xl p-4 bg-white shadow-card">
                    <ConfidenceChart prediction={predictionData} />
                  </div>
                </div>
                <div className="border border-[#e0e0e0] rounded-2xl p-4 bg-white shadow-card">
                  <PricePerSqFtChart
                    prediction={predictionData}
                    area={properties.find(p => p.id === selectedPropertyId)?.area ?? 1000}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HostDashboard;
