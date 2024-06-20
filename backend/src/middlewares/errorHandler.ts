import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors';
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}

export default errorHandler