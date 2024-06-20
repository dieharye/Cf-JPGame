import mongoose, { CallbackError, Document, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { createHash } from "crypto";
import { CustomError } from '../errors';
// Define an interface representing a document in MongoDB.
interface IAccount extends Document {
  email: string,
  name: string;
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
}

// Define the schema corresponding to the document interface.
const accountSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Email is invalid"
    },
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [2, "Username must be at least 2 characters long"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
  },
  avatarId: { type: String, default: 'default' },
  headshot: { type: String, default: null },
  balance: { type: Number, default: 0.00 },
  role: { type: String, default: 'Member' },
  wagered: { type: Number, default: 0.00 },
  deposited: { type: Number, default: 0.00 },
  withdrawn: { type: Number, default: 0.00 },
  last_message: { type: Date, default: Date.now },
  join_date: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }
});

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
    console.log(err)
    next(err);
  }

  try {
    this.avatarId = await createHash('sha256').update(this.email).digest('hex')
  } catch (err: any) {
    console.log(err)
    next(err)
  }
});
// Define and export the Mongoose model
export default model<IAccount>('Account', accountSchema);
