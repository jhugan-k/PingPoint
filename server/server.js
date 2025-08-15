import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import endpointRoutes from './routes/endpointRoutes.js';
import userRoutes from './routes/userRoutes.js';
import startMonitoring from './jobs/monitoringJob.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 8000;


// --- CORS Configuration ---
// Create a whitelist of allowed origins
const allowedOrigins = [
  'https://ping-point-jk.vercel.app', // Your deployed frontend URL
  'http://localhost:5173'             // Your local development frontend URL
];

// Set up CORS with a dynamic origin function to implement the whitelist
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, API clients like Thunder Client)
    // and requests from origins in our whitelist.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  }
}));


// --- Core Middleware ---
// This allows the server to accept and parse JSON in the request body.
app.use(express.json());


// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');

    // Start the monitoring job only after a successful database connection.
    startMonitoring();
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure if DB connection fails
  }
};

// Call the function to connect to the database
connectDB();


// --- API Routes ---
// Mount the endpoint-related routes on the '/api/endpoints' path
app.use('/api/endpoints', endpointRoutes);
// Mount the user-related routes on the '/api/users' path
app.use('/api/users', userRoutes);


// --- Start the Server ---
// Make the app listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});