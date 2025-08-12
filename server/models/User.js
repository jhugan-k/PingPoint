import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// This special Mongoose middleware runs automatically BEFORE a document is saved.
userSchema.pre('save', async function (next) {
  // We only want to hash the password if it's new or has been changed.
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a "salt" to make the hash more secure.
  const salt = await bcrypt.genSalt(10);
  // Overwrite the plain text password with the hashed version.
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;