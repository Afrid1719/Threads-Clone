import { Types } from "mongoose";

export interface IPost {
  postedBy: Types.ObjectId;
  text?: string;
  img?: string;
  likes?: number;
  replies?: IReply[];
}

export interface IReply {
  userId: Types.ObjectId;
  text: string;
  userProfilePic?: string;
  username: string;
}
