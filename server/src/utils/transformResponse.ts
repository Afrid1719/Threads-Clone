import { IUser } from "../interfaces/i-user";

export function transformUserResponse(data: IUser) {
  return {
    _id: data._id,
    name: data.name,
    username: data.username,
    email: data.email,
    profilePic: data.profilePic,
    followers: data.followers,
    following: data.following,
    bio: data.bio,
  };
}
