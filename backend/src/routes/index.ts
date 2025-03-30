import express from 'express';
import { userRouter } from './user';
import { ContentRouter } from './content';

const router = express.Router();
router.use("/user",userRouter);
router.use("/content",ContentRouter);

export const rootRouter = router;

