export interface IUserWithoutPassword {
  id?: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profilePic?: string;
}

export interface IUser extends IUserWithoutPassword {
  password: string;
}
export interface IUserSignUpRequest {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface IUserSignUpResponse extends IUserWithoutPassword {}

export interface IUserLoginRequest {
  username: string;
  password: string;
}

export interface IUserLoginResponse extends IUserWithoutPassword {}

export interface IMessageResponse {
  success: boolean;
  message?: string;
}
