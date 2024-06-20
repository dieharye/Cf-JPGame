import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Account from "../models/account"
import { STATUS_CODES } from "http";
import { CustomError, BadRequest } from "../errors";

const signUp = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const usernameExists = await Account.find({ username: req.body.username })
        const emailExists = await Account.find({ email: req.body.email })

        if(usernameExists || emailExists){
            throw BadRequest
        }
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

export { signUp, signIn, signOut }