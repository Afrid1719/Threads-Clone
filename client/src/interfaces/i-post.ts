export interface IPost {
  _id?: string;
  postedBy: string;
  text?: string;
  img?: string;
  likes?: string;
  replies?: IReply[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IReply {
  _id?: string;
  userId: string;
  text: string;
  userProfilePic?: string;
  username: string;
}
