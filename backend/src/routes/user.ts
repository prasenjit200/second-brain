import express from 'express';
import { auth } from '../AuthController';
import { Request,Response } from 'express';

const router = express .Router();

router.post ("/register",auth.register);
router.post ("/signin",auth.signin);
router.post('/api/v1/user/logout', (req:Request, res:Response) => {
    res.clearCookie("authToken");
    
    res.status(200).send({ message: "Logged out successfully" });
  });
export const userRouter = router;