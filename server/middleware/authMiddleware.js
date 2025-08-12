import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This middleware function acts as a security guard for our routes.
const protect = async (req, res, next) => {
  let token;

  // Standard practice is to send the JWT in the 'Authorization' header,
  // formatted as "Bearer <token>". We first check if this header exists.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extract the token from the header.
      // 'Bearer <token>' -> split by space -> ['Bearer', '<token>'] -> take the 2nd element.
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token's authenticity.
      // jwt.verify checks if the token was signed with our secret key and if it has expired.
      // If it's invalid, it will throw an error, which our 'catch' block will handle.
      // If it's valid, it returns the decoded payload (e.g., { id: 'some_user_id', iat: ..., exp: ... }).
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach the user to the request object.
      // We use the 'id' from the decoded token to find the user in our database.
      // '.select('-password')' is a security measure to ensure we don't include the user's hashed password
      // in the user object that gets attached to the request.
      req.user = await User.findById(decoded.id).select('-password');
      
      // 4. Move on to the next function.
      // Since the user is authenticated, we call 'next()' to pass control to the
      // actual route handler (e.g., getEndpoints, createEndpoint, etc.).
      next();

    } catch (error) {
      console.error(error);
      // If the token verification fails, we deny access.
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // This 'if' block runs if the 'Authorization' header wasn't found at all.
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };