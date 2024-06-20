import express, { Request, Response, NextFunction } from 'express'
import { MONGO_URI, PORT } from './config/config'
import authRouter from "./routes/auth"
import mongoose from 'mongoose';

const app = express();

app.use("/", authRouter);

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("hello")
})
app.listen(PORT, async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`The server is running on port ${PORT}`)
    } catch (err) {
        console.log(err)
    }
})