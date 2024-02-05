import { Types } from "mongoose";

export interface IPost {
  _id?: Types.ObjectId;
  postedBy: Types.ObjectId;
  text?: string;
  img?: string;
  likes?: Types.ObjectId[];
  replies?: IReply[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IReply {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  userProfilePic?: string;
  username: string;
  name: string;
}

export interface ICreatePostRequest {
  postedBy: Types.ObjectId;
  text?: string;
  img?: string;
}

export interface IUpdatePostRequest {
  text?: string;
  img?: string;
}

export interface IPostReplyRequest {
  text: string;
}
