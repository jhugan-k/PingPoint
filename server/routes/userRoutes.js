import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Define the routes and connect them to controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;