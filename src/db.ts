import mongoose, { Schema, Document, Model, mongo } from "mongoose";
import { DB_URL } from "./config";

async function ConnectToDb (){
    try{
        mongoose.connect (DB_URL);
        console.log("mongoDb connected successfully !");
    }catch(error){
        console.log("error in connecting mongoDb"+error);

    }
}
ConnectToDb();

// interface for user --> 

export interface USER extends Document {
  username: string;
  password: string;
}

// interface for content --> 

interface content {
  title : String ; 
  link :String;
  tags : mongoose.Types.ObjectId[];
  userId:mongoose.Types.ObjectId;
}

// Schema --> 
const userSchema: Schema<USER> = new mongoose.Schema<USER>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// content schema --> 
const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
  });

// brain Schema--> 
const brainSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    isShared: { type: Boolean, default: false },
  });

// user_Model --> 
const User: Model<USER> = mongoose.model<USER>("User", userSchema);
// content model --> 

const ContentModel = mongoose.model<content> ('content', contentSchema);

const Brain = mongoose.model ("Brain",brainSchema);

export const user = User;
export const content = ContentModel
export {Brain};

