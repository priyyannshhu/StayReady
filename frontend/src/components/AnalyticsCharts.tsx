import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionResult {
  predictedPrice: number;
  confidence: number;
  features?: Record<string, unknown>;
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
    <div>
      <h3 className="font-display font-600 text-sm text-brand-charcoal mb-3">Price Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#717171' }} />
          <YAxis tick={{ fontSize: 10, fill: '#717171' }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, '']}
            contentStyle={{ border: '1px solid #DDDDDD', borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="value" fill="#FF385C" radius={[4, 4, 0, 0]} />
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
  const COLORS = ['#FF385C', '#DDDDDD'];

  return (
    <div>
      <h3 className="font-display font-600 text-sm text-brand-charcoal mb-3">Confidence Analysis</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label={(props: any) => {
              const { name, value } = props;
              return `${name}: ${value.toFixed(1)}%`;
            }}
            labelLine={false}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`]}
            contentStyle={{ border: '1px solid #DDDDDD', borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
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
    { metric: 'This Property', value: pricePerSqFt },
    { metric: 'Market Avg', value: 1.2 },
    { metric: 'Premium', value: 2.5 },
    { metric: 'Budget', value: 0.8 },
  ];

  return (
    <div>
      <h3 className="font-display font-600 text-sm text-brand-charcoal mb-3">Price per Square Foot Comparison</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
          <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#717171' }} />
          <YAxis tick={{ fontSize: 10, fill: '#717171' }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'per sqft']}
            contentStyle={{ border: '1px solid #DDDDDD', borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#FF385C' : '#DDDDDD'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
