const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const autoSeedIfEmpty = require('../seed/autoSeed');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/engipath';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Auto-seed database if empty
    await autoSeedIfEmpty();
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting In-Memory MongoDB Server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
      
      // Auto-seed in-memory database
      await autoSeedIfEmpty();
    } catch (memErr) {
      console.error(`Failed to start In-Memory MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
