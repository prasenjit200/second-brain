import express from 'express';
import { auth } from '../AuthController';


const router = express .Router();

router.post ("/register",auth.register);
router.post ("/signin",auth.signin);

export const userRouter = router;