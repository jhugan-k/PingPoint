import cron from 'node-cron';
import axios from 'axios';
import Endpoint from '../models/Endpoint.js';

// --- The Health Check Function ---
const checkEndpoints = async () => {
  console.log('Running health checks on all endpoints...');

  try {
    // 1. Get all endpoints from the database.
    const endpoints = await Endpoint.find({});

    // 2. Loop through each one.
    endpoints.forEach(async (endpoint) => {
      let status = 'Down'; // Assume it's down by default.

      try {
        // 3. Send an HTTP GET request to the endpoint's URL.
        // We set a timeout of 5 seconds.
        await axios.get(endpoint.url, { timeout: 5000 });

        // 4. If the request does not throw an error, it's considered 'Up'.
        status = 'Up';
      } catch (error) {
        // Any error (timeout, 404, 500, etc.) means it's 'Down'.
        console.log(`Endpoint ${endpoint.name} is down. Error: ${error.message}`);
        status = 'Down';
      }

      // 5. Update the endpoint in the database with the new status and check time.
      endpoint.status = status;
      endpoint.lastChecked = new Date();
      await endpoint.save();
    });
  } catch (dbError) {
    console.error('Error fetching endpoints from database:', dbError);
  }
};

// --- The Cron Job Scheduler ---
// This schedules the checkEndpoints function to run every 1 minute.
// The cron syntax '*/1 * * * *' means "at every minute".
const startMonitoring = () => {
  cron.schedule('*/1 * * * *', checkEndpoints);
};

export default startMonitoring;