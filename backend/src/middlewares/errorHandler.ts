import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors';
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const defaultError = {
        status: err.status || 500,
        message: err.message || 'Something went wrong!',
      };
    
      if (err.name === 'ValidationError') {
        defaultError.status = 400;
        defaultError.message = Object.values(err.errors)
          .map((elm:any) => elm.message)
          .join(', ');
      }
    
      if (err.code && err.code === 11000) {
        defaultError.status = 400;
        defaultError.message = `Duplicate ${Object.keys(err.keyValue)}`;
      }
    
      // res.status(defaultError.status).json({ message: err });
      res.status(defaultError.status).json({ success:false, message: defaultError.message });
}

export default errorHandler