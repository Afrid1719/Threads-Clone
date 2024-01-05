import { Types } from "mongoose";

export interface IMessageResponse {
  message: string;
}

export interface IUser {
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
