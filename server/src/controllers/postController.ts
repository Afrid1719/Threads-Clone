import { Request, Response } from "express";
import {
  ICreatePostRequest,
  IPost,
  IPostReplyRequest,
  IReply,
  IUpdatePostRequest,
} from "../interfaces/i-post";
import {
  IAuthenticatedRequest,
  IMessageResponse,
  IUser,
} from "../interfaces/i-user";
import Post from "../models/postModel";
import { POST_TEXT_MAXLENGTH } from "../utils/constants";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/userModel";

export const createPost = async (
  _req: IAuthenticatedRequest<ICreatePostRequest>,
  _res: Response<IMessageResponse | IPost>
) => {
  try {
    let { img } = _req.body;
    const { postedBy, text } = _req.body;
    const currentUser: IUser = _req.user;
    if (!postedBy || (!text && !img)) {
      return _res.status(400).json({
        success: false,
        message: "PostedBy and Text fields",
      });
    }
    if (postedBy.toString() !== currentUser._id?.toString()) {
      return _res.status(400).json({
        success: false,
        message: "Unauthorized to create post",
      });
    }
    if (!!text && text.length > POST_TEXT_MAXLENGTH) {
      return _res.status(400).json({
        success: false,
        message: `Text must be less than ${POST_TEXT_MAXLENGTH} characters.`,
      });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({
      postedBy,
      text: text ?? "",
      img: img ?? "",
    });
    await newPost.save();
    _res.status(201).json({
      _id: newPost._id,
      postedBy: newPost.postedBy,
      text: newPost.text,
      img: newPost.img,
      likes: newPost.likes,
      replies: newPost.replies,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
    });
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const getPosts = async (
  _req: Request,
  _res: Response<IMessageResponse | IPost | IPost[]>
) => {
  try {
    let id = _req.params?.id;
    let result: IPost | IPost[];
    if (!id) {
      result = await Post.find().select("-__v").sort({ createdAt: -1 });
    } else {
      result = (await Post.findOne({ _id: id }).select("-__v")) as IPost;
    }
    _res.status(200).json(result);
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const updatePost = async (
  _req: IAuthenticatedRequest<IUpdatePostRequest>,
  _res: Response<IMessageResponse | any>
) => {
  try {
    const { id } = _req.params;
    const { text, img } = _req.body;
    const currentUser: IUser = _req.user;
    if (!id) {
      return _res.status(400).json({
        success: false,
        message: "Post ID not found!",
      });
    }
    if (!text && !img) {
      return _res.status(400).json({
        success: false,
        message: "Empty fields provided.",
      });
    }
    let post = await Post.findById(id);
    if (!post) {
      return _res.status(400).json({
        success: false,
        message: "Post not found.",
      });
    }
    if (currentUser._id?.toString() !== post?.postedBy?._id.toString()) {
      return _res.status(401).json({
        success: false,
        message: "User is not authorized to update the post.",
      });
    }
    post.text = text ?? "";
    post.img = img ?? "";
    await post.save();
    _res.status(204).json({});
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const deletePost = async (
  _req: IAuthenticatedRequest,
  _res: Response<IMessageResponse | any>
) => {
  try {
    const { id } = _req.params;
    const currentUser: IUser = _req.user;
    if (!id) {
      return _res.status(400).json({
        success: false,
        message: "Post ID not found!",
      });
    }
    const post = await Post.findById(id);
    if (post?.postedBy.toString() !== currentUser._id?.toString()) {
      return _res.status(401).json({
        success: false,
        message: "User is not authorized to delete the post.",
      });
    }
    if (!!post?.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/")?.pop()?.split(".")[0] as string
      );
    }
    await Post.findOneAndDelete({ _id: id });
    _res.status(200).json({
      _id: id,
    });
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const toggleLike = async (
  _req: IAuthenticatedRequest,
  _res: Response<IMessageResponse>
) => {
  try {
    const { id } = _req.params;
    const currentUser: IUser = _req.user;
    if (!id) {
      return _res.status(400).json({
        success: false,
        message: "Post ID not found!",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return _res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }
    const liked = post.likes?.includes(currentUser._id as Types.ObjectId);
    if (liked) {
      // Unlike
      await Post.findByIdAndUpdate(id, { $pull: { likes: currentUser._id } });
      _res.status(200).json({
        success: true,
        message: "Post unliked successfully",
      });
    } else {
      // Like
      await Post.findByIdAndUpdate(id, { $push: { likes: currentUser._id } });
      _res.status(200).json({
        success: true,
        message: "Post liked successfully",
      });
    }
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const replyToPost = async (
  _req: IAuthenticatedRequest<IPostReplyRequest>,
  _res: Response<IMessageResponse>
) => {
  try {
    const { id } = _req.params;
    const currentUser: IUser = _req.user;
    const { text } = _req.body;
    if (!id) {
      return _res.status(400).json({
        success: false,
        message: "Post ID not found!",
      });
    }
    if (!text) {
      return _res.status(400).json({
        success: false,
        message: "Text field is required",
      });
    }
    const post = await Post.findById(id);
    if (!post) {
      return _res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }
    const reply: IReply = {
      userId: currentUser._id as Types.ObjectId,
      username: currentUser.username,
      text,
      userProfilePic: currentUser.profilePic,
      name: currentUser.name,
    };
    post.replies?.push(reply);
    await post.save();
    _res.status(201).json({
      success: true,
      message: "Reply added successfully!",
    });
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const getFeedPosts = async (
  _req: IAuthenticatedRequest,
  _res: Response
) => {
  try {
    const currentUser: IUser = _req.user;
    const following = currentUser.following;
    const feeds = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    _res.status(200).json({ feeds });
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};

export const getPostsByUserId = async (
  _req: Request,
  _res: Response<IMessageResponse | IPost[]>
) => {
  try {
    const author = _req.params?.authorId;
    const isAuthorIdValid = Types.ObjectId.isValid(author);
    let result: IPost[] = [];
    if (isAuthorIdValid) {
      result = await Post.find({ postedBy: author })
        .select("-__v")
        .sort({ createdAt: -1 });
    } else {
      const authorFound = await User.findOne({ username: author }).select(
        "_id"
      );
      if (!authorFound) {
        return _res.json({
          success: false,
          message: "User not found!",
        });
      }
      result = await Post.find({ postedBy: authorFound._id }).select("-__v");
    }
    return _res.status(200).json(result);
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error(err.message);
  }
};
