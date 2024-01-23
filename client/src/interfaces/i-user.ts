export interface IUser {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  profilePic?: string;
}

export interface IUserSignUpRequest {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface IUserSignUpResponse extends IUser {}

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IUserLoginResponse extends IUser {}

export interface IMessageResponse {
  success: boolean;
  message?: string;
}
