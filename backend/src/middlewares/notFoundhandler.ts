import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';

const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ success:false,  message: 'Route does not exist' });
};

export default notFoundHandler;
