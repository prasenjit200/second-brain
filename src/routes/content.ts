import express, {Request,Response, NextFunction } from 'express';
import { Brain, content } from '../db';
import { auth } from '../AuthController';
import { usermiddleware } from '../middleware';

const router = express.Router();
router.post("/add",usermiddleware, auth.content);
router.get("/show",usermiddleware, auth.showcontent);
router.delete("/delet",usermiddleware, async  (req:Request,res:Response,next:NextFunction)=>{
    const contentId = req.body.contentId;

    await content.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })

    res.json({
        message: "content delete"
    })
}) ;

router.post("/share", usermiddleware,async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { share } = req.body;
      if (share === undefined) {
         res.status(400).json({ message: "Share value must be provided." });
         return;
      }

      // @ts-ignore
      const userId = req.userId;
      let brain = await Brain.findOne({ userId });

      if (!brain) {
        brain = new Brain({ userId, isShared: share });
        await brain.save();
      } else {
        brain.isShared = share;
        await brain.save();
      }
      if (share) {
        const link = `http://localhost:3000/api/v1/content/share/${brain._id}`;
         res.json({
          message: "Brain share status updated successfully!",
          link,
        });
      }

      res.json({
        message: "Brain is not shared.",
      });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/brain/:shareLink",async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { shareLink } = req.params;

      // Find the brain record by the share link
      const brain = await Brain.findById(shareLink);
      //  if the brain exists and sharing is enabled
      if (!brain || !brain.isShared) {
         res.status(404).json({ message: "Invalid or disabled share link." });
         return;
      }
      // fetching 
      const userId = brain.userId;
      const contents = await content.find({ userId });
      res.json({
        username: brain.username, 
        contents: contents.map((item) => ({
          id: item._id,
          //@ts-ignore
          type: item.type,
          link: item.link,
          title: item.title,
          tags: item.tags,
        })),
      });
    } catch (error) {
      next(error); 
    }
  }
);
  
  

export const ContentRouter = router ;
