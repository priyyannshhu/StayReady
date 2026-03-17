const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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
  password: { type: String, required: true },
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
    title: 'Luxury Villa in Bandra',
    location: 'Mumbai, Maharashtra',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 2000,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning', 'Sea View'],
    description: 'Experience luxury living in this stunning Bandra villa with breathtaking Arabian Sea views. Perfect for families and couples looking for a premium Mumbai getaway.',
    latitude: 19.0596,
    longitude: 72.8295,
    accommodates: 6,
    propertyType: 'Villa',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 45,
    availability365: 280,
    rating: 4.94,
    reviewCount: 87
  },
  {
    title: 'Modern Studio in Koramangala',
    location: 'Bengaluru, Karnataka',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
    status: 'Available',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Workspace', 'Smart TV', 'Power Backup'],
    description: 'Modern studio in heart of Bengaluru with easy access to tech parks and cafes. Perfect for IT professionals and city explorers.',
    latitude: 12.9352,
    longitude: 77.6245,
    accommodates: 2,
    propertyType: 'Apartment',
    roomType: 'Entire home/apt',
    minimumNights: 2,
    numberOfReviews: 23,
    availability365: 340,
    rating: 4.87,
    reviewCount: 124
  },
  {
    title: 'Heritage Bungalow near India Gate',
    location: 'New Delhi, NCR',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    status: 'Available',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    amenities: ['WiFi', 'Fireplace', 'Garden', 'Kitchen', 'Parking', 'Pet Friendly', 'Servant Room'],
    description: 'Beautiful heritage bungalow near India Gate with traditional architecture and modern amenities. Perfect for families wanting to experience Delhi culture.',
    latitude: 28.6139,
    longitude: 77.2090,
    accommodates: 8,
    propertyType: 'House',
    roomType: 'Entire home/apt',
    minimumNights: 5,
    numberOfReviews: 67,
    availability365: 120,
    rating: 4.96,
    reviewCount: 89
  },
  {
    title: 'Tech Hub Loft in HSR Layout',
    location: 'Bengaluru, Karnataka',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Air Conditioning', 'Rooftop Access', 'Coworking Space', 'Power Backup'],
    description: 'Stylish loft with city views and modern amenities in Bengaluru tech hub. Ideal for tech professionals and urban explorers.',
    latitude: 12.9081,
    longitude: 77.6476,
    accommodates: 4,
    propertyType: 'Apartment',
    roomType: 'Entire home/apt',
    minimumNights: 2,
    numberOfReviews: 89,
    availability365: 310,
    rating: 4.91,
    reviewCount: 156
  },
  {
    title: 'Beach Villa in Juhu',
    location: 'Mumbai, Maharashtra',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    amenities: ['WiFi', 'Kitchen', 'Parking', 'Beach Access', 'Balcony', 'Gym', 'Power Backup'],
    description: 'Charming Juhu beach villa with direct beach access. Perfect for a relaxing coastal getaway with stunning sunset views.',
    latitude: 19.1076,
    longitude: 72.8265,
    accommodates: 4,
    propertyType: 'House',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 203,
    availability365: 290,
    rating: 4.88,
    reviewCount: 203
  },
  {
    title: 'Colonial Bungalow in Fort Kochi',
    location: 'Kochi, Kerala',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    amenities: ['WiFi', 'Kitchen', 'Garden', 'Traditional Architecture', 'Backwaters View', 'Power Backup'],
    description: 'Beautifully restored colonial bungalow with original architectural details. Experience Kerala charm with modern comforts.',
    latitude: 9.9312,
    longitude: 76.2673,
    accommodates: 6,
    propertyType: 'Bungalow',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 98,
    availability365: 275,
    rating: 4.82,
    reviewCount: 98
  },
  {
    title: 'Luxury Villa in Banjara Hills',
    location: 'Hyderabad, Telangana',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Hot Tub', 'City Views', 'Golf Course Access', 'Power Backup'],
    description: 'Stunning luxury villa with panoramic city views and resort-style amenities. Perfect for premium Hyderabad experience.',
    latitude: 17.4177,
    longitude: 78.4483,
    accommodates: 6,
    propertyType: 'Villa',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 73,
    availability365: 320,
    rating: 4.88,
    reviewCount: 73
  },
  {
    title: 'Hillside Cottage near Ooty',
    location: 'Ooty, Tamil Nadu',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400',
    status: 'Sold Out',
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    amenities: ['WiFi', 'Fireplace', 'Tea Garden', 'Kitchen', 'Mountain Views', 'Forest Views'],
    description: 'Cozy hillside cottage with stunning Nilgiri mountain views. Perfect for nature lovers and tea plantation tours.',
    latitude: 11.4102,
    longitude: 76.6950,
    accommodates: 4,
    propertyType: 'Cottage',
    roomType: 'Entire home/apt',
    minimumNights: 2,
    numberOfReviews: 112,
    availability365: 180,
    rating: 4.96,
    reviewCount: 112
  },
  {
    title: 'Compact Studio in Sector 29',
    location: 'Gurugram, Haryana',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
    status: 'Available',
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    amenities: ['WiFi', 'Kitchenette', 'Gym', 'City Views', 'Doorman', 'Power Backup'],
    description: 'Efficient urban studio with amazing city views. Perfect for solo travelers and professionals working in MNCs.',
    latitude: 28.4595,
    longitude: 77.0266,
    accommodates: 2,
    propertyType: 'Studio',
    roomType: 'Entire home/apt',
    minimumNights: 1,
    numberOfReviews: 67,
    availability365: 350,
    rating: 4.79,
    reviewCount: 67
  },
  {
    title: 'Penthouse in Marine Drive',
    location: 'Mumbai, Maharashtra',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    amenities: ['WiFi', 'Hot Tub', 'Kitchen', 'Concierge', 'Sea View', 'Wine Cellar', 'Smart Home', 'Power Backup'],
    description: 'Ultra-luxury penthouse with panoramic Arabian Sea views. Premium amenities and concierge service for ultimate Mumbai experience.',
    latitude: 19.0008,
    longitude: 72.8143,
    accommodates: 6,
    propertyType: 'Penthouse',
    roomType: 'Entire home/apt',
    minimumNights: 4,
    numberOfReviews: 41,
    availability365: 250,
    rating: 4.99,
    reviewCount: 41
  },
  {
    title: 'Traditional Farmhouse near Jaipur',
    location: 'Jaipur, Rajasthan',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    amenities: ['WiFi', 'Kitchen', 'Courtyard', 'Fire Pit', 'Rural Views', 'Traditional Architecture'],
    description: 'Authentic Rajasthani farmhouse experience with modern amenities. Perfect for families wanting a rural escape with royal heritage.',
    latitude: 26.9124,
    longitude: 75.7873,
    accommodates: 6,
    propertyType: 'Farmhouse',
    roomType: 'Entire home/apt',
    minimumNights: 2,
    numberOfReviews: 89,
    availability365: 300,
    rating: 4.85,
    reviewCount: 89
  },
  {
    title: 'Beachfront Villa in Calangute',
    location: 'Goa',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Beach Access', 'Balcony', 'Gym', 'Hot Tub', 'Power Backup'],
    description: 'Modern beachfront villa with direct Arabian Sea access and resort amenities. Perfect for beach lovers and vacationers.',
    latitude: 15.5527,
    longitude: 73.7513,
    accommodates: 4,
    propertyType: 'Villa',
    roomType: 'Entire home/apt',
    minimumNights: 3,
    numberOfReviews: 156,
    availability365: 280,
    rating: 4.92,
    reviewCount: 156
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

// POST /api/auth/register - User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    // Generate JWT token (simplified for demo)
    const token = 'demo_token_' + Date.now();
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login - User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    console.log('Login attempt:', { email, userId: user._id });
    
    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token (simplified for demo)
    const token = 'demo_token_' + Date.now();
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// GET /api/properties/user - Get user's properties
app.get('/api/properties/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Simple token validation (in production, use JWT verification)
    if (!token || !token.startsWith('demo_token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // For demo, return all properties for the user
    // In production, filter by user ID
    const properties = await Property.find();
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/properties - Add new property
app.post('/api/properties', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('demo_token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const property = new Property(req.body);
    property.userId = 'demo_user'; // In production, get from token
    await property.save();
    
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/properties/:id - Update property
app.put('/api/properties/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('demo_token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const property = await Property.findByIdAndUpdate(req.params.id, req.body);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/properties/:id - Delete property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('demo_token_')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
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
      password: 'demo123',
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
