import express, { Request, Response, NextFunction } from 'express'
import { MONGO_URI, PORT } from './config/config'
import authRouter from "./routes/auth"
import mongoose from 'mongoose';
import errorHandler from './middlewares/errorHandler'
import notFoundHandler from './middlewares/errorHandler'
import { CustomError, BadRequest } from './errors';

const app = express();



app.get("/", (req: Request, res: Response) => {
    throw BadRequest
    res.status(200).send("hello")
})

app.use("/auth", authRouter);



app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`The server is running on port ${PORT}`)
    } catch (err) {
        console.log(err)
    }
})