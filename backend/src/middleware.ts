import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

export const usermiddleware = (req: Request, res: Response, next: NextFunction):void => {
  try {
    const header = req.headers['authorization'];

    if (!header ) {
       res.status(401).json({ message: 'Authorization token missing or invalid format' });
       return;
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
//@ts-ignore
    if (decoded.userId) {
      //@ts-ignore
      req.userId = decoded.userId;
      next();
    } else {
       res.status(403).json({ message: 'You are not logged in' });
       return;
    }
  } catch (error) {
     res.status(403).json({ message: 'Invalid or expired token'});
  }
};
