import expressAsyncHandler from "express-async-handler";
import Roblox, { HeadshotFormat, HeadshotSize } from "../modules/roblox";
import { Request, Response } from "express";
import Account from "../models/account"
import { STATUS_CODES } from "http";
import { CustomError, BadRequest } from "../errors";

const signUp = expressAsyncHandler(
    async (req: Request, res: Response) => {
        console.log(req.body)
        const usernameExists = await Account.findOne({ username: req.body.username })
        const emailExists = await Account.findOne({ email: req.body.email })

        if (usernameExists) {
            throw new CustomError(400, "Username already exists.")
        }

        if (emailExists) {
            throw new CustomError(400, "Email already exists.")
        }
        let headshot: string = "";
        try {
            headshot = await Roblox.GetHeadshot(1877006416, HeadshotSize.SMALLEST, HeadshotFormat.PNG, false)
        } catch (error) {
            console.log(error)
        }
        console.log(headshot)
        const account = new Account({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            headshot: headshot,
            role: 'Member'
        })


        try {
            const user: any = await account.save()
            res.status(200).json(user);
        } catch (error) {
            console.log(error)
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