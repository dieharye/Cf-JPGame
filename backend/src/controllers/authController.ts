import expressAsyncHandler from "express-async-handler";
import Roblox, { HeadshotFormat, HeadshotSize } from "../modules/roblox";
import { Request, Response } from "express";
import Account, { IAccount } from "../models/account";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { STATUS_CODES } from "http";
import { CustomError, BadRequest } from "../errors";
import {JWT_SECRET, TOKEN_EXPIRE_TIME} from '../config/config'


// Define an interface for the Account model to extend the Mongoose Document
interface IAccountDocument extends IAccount, Document {
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): string;
  }

const signUp = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const {username, email, password} = req.body
        if(!username||!email) {
            throw BadRequest
        }
        console.log(req.body)
        const usernameExists = await Account.findOne({ username: username })
        const emailExists = await Account.findOne({ email: email })

        if (usernameExists) {
            throw new CustomError(401, "Username already exists.")
        }

        if (emailExists) {
            throw new CustomError(401, "Email already exists.")
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
            const token = account.generateAuthToken()
            res.status(200).json({user:{username:user.username, email: user.email}, token});
        } catch (error) {
            console.log(error)
        }

    }
)

const signIn = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const {identifier, password} = req.body;
        if(!identifier || !password){
            throw BadRequest;
        }

        let account: IAccountDocument | null = null;

        if (validator.isEmail(identifier)) {
          account = await Account.findOne({ email: identifier }) as IAccountDocument | null;
        } else {
          account = await Account.findOne({ username: identifier }) as IAccountDocument | null;
        }

        console.log(account)

        if (!account) {
            res.status(401).json({ success: false, message: "Invalid username or email." });
            return;
        }
        
        const isPasswordValid = await account.comparePassword(password);

        if(!isPasswordValid) {
            throw new CustomError(401, "Email is username or password invalid")
        }
        
        const token = account.generateAuthToken()
        res.status(200).json({ success:true, data:{user:{username:account.username, email: account.email}, token} });
    }
)

const signOut = (req: Request, res: Response) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ success: true, message: 'logout' });
  };


export { signUp, signIn, signOut }