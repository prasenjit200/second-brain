import express, {Request,Response, NextFunction } from 'express';
import { Brain, content } from '../db';
import { auth } from '../AuthController';
import { usermiddleware } from '../middleware';

const router = express.Router();
router.post("/add",usermiddleware, auth.content);
router.get("/show",usermiddleware, auth.showcontent);
router.delete("/delete/:id", usermiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const contentId = req.params.id; // Get ID from URL

  await content.deleteMany({
      _id: contentId, // Change to "_id" because MongoDB uses "_id" instead of "contentId"
      //@ts-ignore
      userId: req.userId
  });

  res.json({ message: "Content deleted successfully" });
});


  
  

export const ContentRouter = router ;
