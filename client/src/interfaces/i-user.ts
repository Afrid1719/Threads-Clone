export interface IUser {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  profilePic: string;
  followers?: string[];
  following?: string[];
  bio: string;
  createdAt?: string;
}
export interface IUserSignUpRequest {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IMessageResponse {
  success: boolean;
  message?: string;
}
