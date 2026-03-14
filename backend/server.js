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

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Property Schema
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Sold Out', 'Unavailable'], default: 'Available' },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  amenities: [{ type: String }],
  description: String,
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  latitude: Number,
  longitude: Number,
  accommodates: Number,
  propertyType: String,
  roomType: String,
  minimumNights: Number,
  numberOfReviews: Number,
  availability365: Number,
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentId: String, // Razorpay payment ID
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Demo Properties Data
const demoProperties = [
  {
    title: 'Luxury Beach Villa',
    location: 'Miami Beach, FL',
    price: 350,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning', 'Beach Access'],
    description: 'Experience luxury living in this stunning beachfront villa with breathtaking ocean views.',
    latitude: 25.7617,
    longitude: -80.1918,
    accommodates: 6,
    propertyType: 'Villa',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 45,
    availability365: 280
  },
  {
    title: 'Cozy Downtown Apartment',
    location: 'New York, NY',
    price: 180,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
    status: 'Available',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    amenities: ['WiFi', 'Kitchen', 'Gym'],
    description: 'Modern apartment in the heart of downtown with easy access to all major attractions.',
    latitude: 40.7128,
    longitude: -74.0060,
    accommodates: 2,
    propertyType: 'Apartment',
    roomType: 'Entire home/apt',
    minimumNights: 2,
    numberOfReviews: 23,
    availability365: 340
  },
  {
    title: 'Mountain Retreat Cabin',
    location: 'Aspen, CO',
    price: 450,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    status: 'Sold Out',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Kitchen', 'Parking', 'Pet Friendly'],
    description: 'Beautiful mountain cabin perfect for skiing enthusiasts and nature lovers.',
    latitude: 39.1942,
    longitude: -106.8170,
    accommodates: 8,
    propertyType: 'House',
    roomType: 'Entire home/apt',
    minimumNights: 5,
    numberOfReviews: 67,
    availability365: 120
  },
  {
    title: 'Modern Loft Downtown',
    location: 'San Francisco, CA',
    price: 280,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Air Conditioning', 'Rooftop Access'],
    description: 'Stylish loft with city views and modern amenities in tech hub.',
    latitude: 37.7749,
    longitude: -122.4194,
    accommodates: 4,
    propertyType: 'Apartment',
    roomType: 'Entire home/apt',
    minimumNights: 2,
    numberOfReviews: 89,
    availability365: 310
  },
  {
    title: 'Beachside Bungalow',
    location: 'Los Angeles, CA',
    price: 220,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    amenities: ['WiFi', 'Kitchen', 'Parking', 'Beach Access', 'Outdoor Shower'],
    description: 'Charming bungalow just steps from the beach with ocean breezes.',
    latitude: 34.0522,
    longitude: -118.2437,
    accommodates: 4,
    propertyType: 'House',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 156,
    availability365: 275
  }
];

// Routes

// GET /api/properties - Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties/demo - Get demo properties
app.get('/api/properties/demo', async (req, res) => {
  try {
    res.json(demoProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties/:id - Get property by ID
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

// POST /api/properties - Create new property
app.post('/api/properties', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/bookings - Create new booking with payment simulation
app.post('/api/bookings', async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, paymentMethod } = req.body;
    
    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    if (property.status !== 'Available') {
      return res.status(400).json({ error: 'Property is not available' });
    }
    
    // Calculate total amount
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * property.price;
    
    // Generate booking ID
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Simulate payment (if Razorpay keys are missing, auto-success)
    let paymentStatus = 'Completed';
    let paymentId = 'SIM_' + Date.now();
    
    if (paymentMethod === 'razorpay') {
      // In real implementation, integrate Razorpay here
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.log('Razorpay keys not found, simulating successful payment');
        paymentStatus = 'Completed';
      } else {
        // Real Razorpay integration would go here
        paymentStatus = 'Pending';
      }
    }
    
    // Create booking
    const booking = new Booking({
      bookingId,
      propertyId,
      userId: 'demo_user', // In real app, get from auth
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalAmount,
      status: paymentStatus === 'Completed' ? 'Confirmed' : 'Pending',
      paymentStatus,
      paymentId
    });
    
    await booking.save();
    
    // Update property status to 'Unavailable'
    await Property.findByIdAndUpdate(propertyId, { status: 'Unavailable' });
    
    res.status(201).json({
      bookingId,
      totalAmount,
      paymentStatus,
      message: paymentStatus === 'Completed' ? 'Booking confirmed successfully' : 'Payment processing'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/bookings - Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('propertyId').populate('userId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/:bookingId - Get booking by ID
app.get('/api/bookings/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId }).populate('propertyId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/predict-price - Get ML price prediction (updated for real dataset)
app.post('/api/predict-price', async (req, res) => {
  try {
    const { city, bedrooms, bathrooms, accommodates, propertyType, latitude, longitude } = req.body;
    
    // Call ML service
    const axios = require('axios');
    const response = await axios.post('http://localhost:8000/predict', {
      city,
      bedrooms,
      bathrooms,
      accommodates,
      property_type: propertyType,
      latitude,
      longitude
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    // Fallback to simple rule-based pricing if ML service is down
    const basePrice = 50;
    const locationMultiplier = {
      'New York': 1.8, 'Los Angeles': 1.5, 'Miami': 1.4, 'Chicago': 1.2,
      'San Francisco': 2.0, 'Seattle': 1.3, 'Austin': 1.1
    }[city] || 1.0;
    
    const bedroomPrice = bedrooms * 30;
    const bathroomPrice = bathrooms * 25;
    const accommodatePrice = accommodates * 20;
    
    const predictedPrice = Math.round(
      (basePrice + bedroomPrice + bathroomPrice + accommodatePrice) * locationMultiplier
    );
    
    res.json({
      predicted_price: predictedPrice,
      confidence: 0.75,
      city,
      fallback: true
    });
  }
});

// POST /api/users - Create new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'StayReady Backend API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      properties: '/api/properties',
      demo_properties: '/api/properties/demo',
      bookings: '/api/bookings',
      users: '/api/users'
    },
    documentation: 'https://github.com/priyyannshhu/StayReady'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'Connected',
      ml_service: 'http://localhost:8000',
      demo_data: 'Loaded'
    }
  });
});

// Initialize demo data
const initializeDemoData = async () => {
  try {
    // Clear existing data
    await Property.deleteMany({});
    await Booking.deleteMany({});
    await User.deleteMany({});
    
    // Insert demo properties
    await Property.insertMany(demoProperties);
    
    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@stayready.com',
      phone: '+1-555-0123'
    });
    await demoUser.save();
    
    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize demo data on startup
  initializeDemoData();
});
