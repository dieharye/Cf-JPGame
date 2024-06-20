import dotenv from 'dotenv'

dotenv.config()

export const MONGO_URI = process.env.MONGO_URI || ""
export const PORT = process.env.PORT || 5000;