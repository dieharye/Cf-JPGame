import { Request, Response, NextFunction } from "express";
import Account, { IAccount } from "../models/account";
import { CustomError } from "../errors";

// Define a custom type for the request object to include the account property
interface AuthenticatedRequest extends Request {
    account?: IAccount;
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication Failed' });
    }

    try {
        const decodedToken = Account.verifyToken(token); // This returns the decoded token payload
        const account = await Account.findById(decodedToken.userId);

        if (!account) {
            return res.status(401).json({ success: false, message: 'Authentication Failed' });
        }

        req.account = account;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid Token' });
    }
};

export default authenticate;
