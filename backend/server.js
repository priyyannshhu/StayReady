const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stay-ready', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Property Schema
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Sold Out'], default: 'Available' },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  amenities: [{ type: String }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes

// GET /properties - Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /properties/:id - Get property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /properties - Create new property
app.post('/api/properties', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /bookings - Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    // Update property status to Sold Out for the booked dates
    // In a real app, you'd implement date-based availability
    await Property.findByIdAndUpdate(req.body.propertyId, { status: 'Sold Out' });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /bookings - Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('propertyId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /predict-price - Get ML price prediction
app.post('/api/predict-price', async (req, res) => {
  try {
    const { location, bedrooms, bathrooms, area, amenities } = req.body;
    
    // Call ML service
    const axios = require('axios');
    const response = await axios.post('http://localhost:8000/predict', {
      location,
      bedrooms,
      bathrooms,
      area,
      amenities
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    // Fallback to simple rule-based pricing if ML service is down
    const basePrice = 50;
    const locationMultiplier = location.includes('Miami') ? 1.5 : location.includes('New York') ? 1.8 : 1.0;
    const bedroomPrice = bedrooms * 30;
    const bathroomPrice = bathrooms * 20;
    const areaPrice = area * 0.05;
    const amenityPrice = amenities.length * 5;
    
    const predictedPrice = Math.round(
      (basePrice + bedroomPrice + bathroomPrice + areaPrice + amenityPrice) * locationMultiplier
    );
    
    res.json({
      predictedPrice,
      confidence: 0.75,
      fallback: true
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
