// MongoDB initialization script for Stay Ready
// Run this script to populate the database with sample data

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'stay-ready';

const sampleProperties = [
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
    createdAt: new Date()
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
    amenities: ['WiFi', 'Kitchen', 'Gym', 'Air Conditioning'],
    description: 'Modern apartment in the heart of downtown with easy access to all major attractions.',
    createdAt: new Date()
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
    createdAt: new Date()
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
    createdAt: new Date()
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
    createdAt: new Date()
  }
];

async function initializeDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Clear existing data
    await db.collection('properties').deleteMany({});
    await db.collection('bookings').deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert sample properties
    const result = await db.collection('properties').insertMany(sampleProperties);
    console.log(`Inserted ${result.insertedCount} properties`);
    
    // Create indexes for better performance
    await db.collection('properties').createIndex({ location: 1 });
    await db.collection('properties').createIndex({ price: 1 });
    await db.collection('properties').createIndex({ status: 1 });
    
    await db.collection('bookings').createIndex({ propertyId: 1 });
    await db.collection('bookings').createIndex({ checkIn: 1 });
    await db.collection('bookings').createIndex({ checkOut: 1 });
    
    console.log('Created database indexes');
    
    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, sampleProperties };
