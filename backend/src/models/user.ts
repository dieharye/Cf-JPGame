import mongoose from 'mongoose';

// Define your schema
const accountSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true, minLength: 2 },
    password: { type: String, required: true, minLength: 6 },
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
export default mongoose.model('Account', accountSchema);
