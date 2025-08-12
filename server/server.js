import express from 'express';
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import endpointRoutes from './routes/endpointRoutes.js'; // Now grouped with other imports
import startMonitoring from './jobs/monitoringJob.js';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');

    startMonitoring();
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

connectDB();

// --- Mount Routes ---
// This line tells the app to use our router for any path starting with /api/endpoints
app.use('/api/endpoints', endpointRoutes);
app.use('/api/users', userRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});