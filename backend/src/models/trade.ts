import mongoose from "mongoose";
const TradeSchema = new mongoose.Schema({
  trader: { type: String, required: true },
  pair: { type: String, required: true },
  openPrice: { type: String, required: true },
  closePrice: { type: String },
  action: { type: String, required: true },
  collateralPriceUsd: { type: String, required: true },
  buy: { type: Number, required: true },
  size: { type: String, required: true },
  leverage: { type: Number, required: true },
  pnl: { type: String, required: true },
  block: { type: Number, require: true },
  tx: { type: String, required: true },
  timestamp: { type: Date, required: true },
  uri: { type: String, required: true, unique: true },
  collateral: { type: String, required: true },
});

export default mongoose.model('Trade', TradeSchema);