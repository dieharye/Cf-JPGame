import expressAsyncHandler from "express-async-handler";
import {Request, Response} from "express";

const signUp = expressAsyncHandler(
    (req: Request, res: Response) => {
        res.status(200).json("signUp");
    }
)

const signIn = expressAsyncHandler(
    (req: Request, res: Response) => {
        res.status(200).json("signIn");

    }
)

const signOut = expressAsyncHandler(
    (req: Request, res: Response) => {
        res.status(200).json("signOut");

    }
)

export {signUp, signIn, signOut}