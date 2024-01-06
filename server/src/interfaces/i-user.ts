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
  password: string;
  profilePic?: string;
  followers?: string[];
  following?: string[];
  bio?: string;
}

export interface IUserSignUpRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface IUSerSignUpResponse {
  id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
}

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IUserLoginResponse extends IUSerSignUpResponse {}

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
