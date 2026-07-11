import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from your .env file
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(express.json());
app.use(cors()); // Enables cross-origin requests so your future frontend can connect securely

// Enable Mongoose Debug Mode to trace internal database traffic
mongoose.set('debug', true);

// Robust Async Database Connection Block
const connectDB = async () => {
  try {
    console.log("⏳ Attempting to establish physical connection to MongoDB Atlas...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,         
    });
    
    console.log("🍃 REAL CONNECTION ESTABLISHED: Successfully connected to MongoDB Cloud Database!");
  } catch (error) {
    console.error("❌ MONGODB CONNECTION ERROR:", error.message);
    process.exit(1); 
  }
};

// Fire up the database connection
connectDB();

// --- DEFINING THE PROVIDER SCHEMA & MODEL ---
const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skill: { type: String, required: true },
  skills: [{ type: String }],
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  bio: { type: String }
}, { timestamps: true });

const Provider = mongoose.model('Provider', ProviderSchema);


// --- YOUR API ROUTES ---

// 1. POST Route: Create a professional profile
app.post('/api/providers', async (req, res) => {
  try {
    const newProvider = new Provider(req.body);
    const savedProvider = await newProvider.save();
    res.status(201).json(savedProvider);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create professional profile",
      error: error.message
    });
  }
});

// 2. GET Route: Fetch all providers (with optional skill & location filtering)
app.get('/api/providers', async (req, res) => {
  try {
    const { skill, location } = req.query;
    let filter = {};

    if (skill) {
      filter.skill = { $regex: skill, $options: 'i' }; // Case-insensitive partial matching
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const providers = await Provider.find(filter);
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve providers",
      error: error.message
    });
  }
});

// 3. PUT Route: Update an existing provider profile by ID
app.put('/api/providers/:id', async (req, res) => {
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Returns the newly updated document and runs validations
    );

    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json(updatedProvider);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
});

// 4. DELETE Route: Remove a provider profile by ID
app.delete('/api/providers/:id', async (req, res) => {
  try {
    const deletedProvider = await Provider.findByIdAndDelete(req.params.id);

    if (!deletedProvider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.status(200).json({ message: "Professional profile successfully deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete profile",
      error: error.message
    });
  }
});

// Simple Health Check Route
app.get('/', (req, res) => {
  res.send("Fundi Backend Server is running smoothly!");
});

// Temporary middleware to log incoming request methods and paths
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: ${req.method} request sent to ${req.url}`);
  next();
});
// Start listening for incoming traffic
app.listen(PORT, () => {
  console.log(`🚀 Server actively listening on port ${PORT}`);
});