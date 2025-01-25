import { Request, Response, NextFunction } from "express";
import { content, user } from "./db"; 
import { validatation } from "./validate"; 


import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "./config";

// class for handling error --> 
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message); 
    this.name = "AppError"; 
    this.statusCode = statusCode; 
  }
}

const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
        // validating input via zod --> 
      const validationResult = validatation.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError("Validation Error", 422);
      }

      // Checking if the user already exists or not --> 
      const existingUser = await user.findOne({ username });
      if (existingUser) {
        throw new AppError("User already exists", 409); 
      }
      const newUser = await user.create({ username, password });  // creating a new user 


      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser.id, username: newUser.username },
      });
    } catch (error) {
      next(error); 
    }
  },
  signin: async (req:Request, res:Response, next:NextFunction)=>{
    try {
      const { username, password } = req.body;

        // validation input via zod --> 
      const validationResult = validatation.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError("Validation Error", 422);
      }

      const foundUser =await user.findOne({username});

      if(!foundUser || foundUser.password !==password){
        throw new AppError("invalid user !",400);
      }
      const token = jwt.sign({ userId: foundUser.id }, JWT_SECRET, { expiresIn: '1h'});
      res.json({ token });
      

      
    } catch (error) {
      next(error); 
    }
  },
  content: async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      const { title, link, type } = req.body;
  
      if (!title || !link || !type) {
         res.status(400).json({ message: 'Title, link, and type are required' });
         return;
      }
  
      const newContent = await content.create({
        title,
        link,
        type,
        //@ts-ignore
        userId: req.userId, 
        tags: [],
      });
  
      res.json({
        message: 'Content added successfully!',
        content: newContent,
      });
    } catch (error) {
        res.status(500).json({ message: 'Error adding content'});
        }
  },
  showcontent:async (req:Request, res:Response, next:NextFunction)=>{
    //@ts-ignore
    const userId = req.userId;

    const contents = await content.find({
        userId:userId
    }).populate("userId","username");

    res.json({
        contents
    })
  }
  

  
};



export const auth = authController;