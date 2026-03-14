import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionResult {
  predictedPrice: number;
  confidence: number;
  features?: any;
}

interface PriceChartProps {
  prediction: PredictionResult;
}

export const PriceChart: React.FC<PriceChartProps> = ({ prediction }) => {
  const data = [
    { name: 'Base Price', value: prediction.predictedPrice * 0.6 },
    { name: 'Location Premium', value: prediction.predictedPrice * 0.2 },
    { name: 'Amenity Value', value: prediction.predictedPrice * 0.15 },
    { name: 'Market Adjustment', value: prediction.predictedPrice * 0.05 },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}`, '']} />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ConfidenceChartProps {
  prediction: PredictionResult;
}

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ prediction }) => {
  const data = [
    { name: 'Confidence', value: prediction.confidence * 100 },
    { name: 'Uncertainty', value: (1 - prediction.confidence) * 100 },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Confidence Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PricePerSqFtChartProps {
  prediction: PredictionResult;
  area: number;
}

export const PricePerSqFtChart: React.FC<PricePerSqFtChartProps> = ({ prediction, area }) => {
  const pricePerSqFt = area ? prediction.predictedPrice / area : 0;
  
  const data = [
    { metric: 'Current Property', value: pricePerSqFt },
    { metric: 'Market Average', value: 1.2 },
    { metric: 'Premium Properties', value: 2.5 },
    { metric: 'Budget Properties', value: 0.8 },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Price per Square Foot Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'per sqft']} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={2}
            dot={{ fill: '#6366f1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
