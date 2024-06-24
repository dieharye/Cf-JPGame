import mongoose, { Document, Schema, Model, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { CustomError } from '../errors';
import { JWT_SECRET } from '../config/config';

// Define an interface representing a document in MongoDB.
export interface IAccount extends Document {
  email: string;
  username: string;
  password: string;
  avatarId?: string;
  headshot?: string | null;
  balance?: number;
  role?: string;
  wagered?: number;
  deposited?: number;
  withdrawn?: number;
  last_message?: Date;
  join_date?: Date;
  isAdmin?: boolean;
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Define the schema corresponding to the document interface.
const accountSchema: Schema<IAccount> = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Email is invalid',
    },
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    minLength: [2, 'Username must be at least 2 characters long'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long'],
  },
  avatarId: { type: String, default: 'default' },
  headshot: { type: String, default: null },
  balance: { type: Number, default: 0.0 },
  role: { type: String, default: 'Member' },
  wagered: { type: Number, default: 0.0 },
  deposited: { type: Number, default: 0.0 },
  withdrawn: { type: Number, default: 0.0 },
  last_message: { type: Date, default: Date.now },
  join_date: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

// Hash the password before saving
accountSchema.pre<IAccount>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err: any) {
    console.log(err);
    next(err);
  }
});

// Generate avatarId from email
accountSchema.pre<IAccount>('save', function (next) {
  try {
    this.avatarId = createHash('sha256').update(this.email).digest('hex');
    next();
  } catch (err: any) {
    console.log(err);
    next(err);
  }
});

// Method to compare passwords
accountSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Method to generate JWT
accountSchema.methods.generateAuthToken = function (): string {
  const payload = { userId: this._id, username: this.username };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Static method to verify JWT
accountSchema.statics.verifyToken = function (token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err: any) {
    throw new CustomError(400, err.message || 'Invalid Token');
  }
};

// Define and export the Mongoose model
const Account: Model<IAccount> = model<IAccount>('Account', accountSchema);
export default Account;
         