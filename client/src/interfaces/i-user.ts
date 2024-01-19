export interface IUserSignUpRequest {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface IUserSignUpResponse {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface IMessageResponse {
  success: boolean;
  message?: string;
}
