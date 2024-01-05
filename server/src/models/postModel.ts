import { Schema, SchemaTypes, model } from "mongoose";
import { IPost } from "../interfaces/i-post";

const postSchema = new Schema<IPost>(
  {
    postedBy: {
      type: SchemaTypes.ObjectId,
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
          type: SchemaTypes.ObjectId,
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
