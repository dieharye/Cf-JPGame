import dotenv from 'dotenv'
dotenv.config()

export const MONGO_URI = process.env.MONGO_URI || ""
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "collin"
export const TOKEN_EXPIRE_TIME = '1h'; 
