import { Request } from "express";
import { Types } from "mongoose";

export interface IMessageResponse {
  success: boolean;
  message?: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password?: string;
  profilePic: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  bio: string;
  createdAt?: string;
}

export interface IUserSignUpRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface IUserSignUpResponse {
  id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  bio: string;
  profilePic: string;
}

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IUserLoginResponse extends IUserSignUpResponse {}

export interface IAuthenticatedRequest<T = any> extends Request<any, any, T> {
  user?: any;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  profilePic?: string;
  bio?: string;
}

export interface IUpdateUserResponse extends IUserSignUpResponse {}
