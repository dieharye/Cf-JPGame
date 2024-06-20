import mongoose, { Document, Schema, model } from 'mongoose';
import validator from 'validator';
// Define an interface representing a document in MongoDB.
interface IAccount extends Document {
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
}

// Define the schema corresponding to the document interface.
const accountSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    validate:{
        validator:(value:string) => validator.isEmail(value),
        message: "Email is invalid"
    },
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

// Define and export the Mongoose model
export default model<IAccount>('Account', accountSchema);
