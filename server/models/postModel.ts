import mongoose, { Schema, Types, model } from "mongoose";

interface IPost {
  postedBy: Types.ObjectId;
  text?: string;
  img?: string;
  likes?: number;
  replies?: IReply[];
}

interface IReply {
  userId: Types.ObjectId;
  text: string;
  userProfilePic?: string;
  username: string;
}

const postSchema = new Schema<IPost>(
  {
    postedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxlength: 500,
    },
    img: String,
    likes: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        userId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: String,
        username: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
