import { Schema, SchemaTypes, model } from "mongoose";
import { IUser } from "../interfaces/i-user";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
