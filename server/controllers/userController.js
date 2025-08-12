import User from '../models/User.js'; // PascalCase 'U'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// --- Helper function to generate a JWT ---
// This function takes a user ID, signs it with our secret key, and sets an expiration date.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};


// --- User Registration ---
// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if a user with this email already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If the user exists, return a 400 Bad Request error
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user document in the database.
    // The password will be automatically hashed by the pre-save hook in the User model.
    const user = await User.create({
      name,
      email,
      password,
    });

    // If the user was successfully created, respond with their data and a token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- User Login ---
// @desc    Authenticate a user & get a token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by their email address
    const user = await User.findOne({ email });

    // Check if a user was found AND if the provided password matches the stored hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      // If login is successful, respond with user data and a new token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // If the user is not found or the password does not match, send a 401 Unauthorized error
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// Export the functions to be used in the route file
export { registerUser, loginUser };