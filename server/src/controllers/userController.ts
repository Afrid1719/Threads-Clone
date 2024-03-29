import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import {
  IAuthenticatedRequest,
  IMessageResponse,
  IUpdateUserRequest,
  IUser,
  IUserLoginRequest,
  IUserSignUpRequest,
} from "../interfaces/i-user";
import User from "../models/userModel";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie";
import { transformUserResponse } from "../utils/transformResponse";

export const getUserById = async (
  _req: Request,
  _res: Response<IMessageResponse | IUser>
) => {
  try {
    const { id } = _req.params;
    if (!id) {
      return _res.status(400).json({
        success: false,
        message: "User id missing!",
      });
    }
    const user = await User.findById(id).select("-password -__v -createdAt");
    if (!user) {
      return _res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }
    _res.status(200).json(transformUserResponse(user));
  } catch (err: any) {
    return _res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUserByUsername = async (
  _req: Request,
  _res: Response<IMessageResponse | IUser>
) => {
  try {
    const { username } = _req.params;
    if (!username) {
      return _res.status(400).json({
        success: false,
        message: "Username is missing!",
      });
    }
    const user = await User.findOne({ username }).select("-password -__v");
    if (!user) {
      return _res.status(404).json({
        success: false,
        message: "User does not exist!",
      });
    }
    _res.status(200).json(transformUserResponse(user));
  } catch (err: any) {
    return _res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const signupUser = async (
  _req: Request<{}, {}, IUserSignUpRequest>,
  _res: Response<IUser | IMessageResponse>
) => {
  try {
    const { name, email, username, password } = _req.body;
    const user = await User.find({ $or: [{ email }, { username }] });
    if (!!user.length) {
      return _res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      username,
      email,
      password: hashed,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, _res);
      return _res.status(200).json(transformUserResponse(newUser));
    } else {
      return _res.status(400).json({
        success: false,
        message: "Invalid user data!",
      });
    }
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while signing up user: ", err.message);
  }
};

export const loginUser = async (
  _req: Request<{}, {}, IUserLoginRequest>,
  _res: Response<IUser | IMessageResponse>
) => {
  try {
    const { username, password } = _req.body;
    if (!username || !password) {
      return _res.status(400).json({
        success: false,
        message: "Incomplete data",
      });
    }
    const foundUser = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("-createdAt -updatedAt -__v");
    const passwordMatched = await bcrypt.compare(
      password,
      foundUser?.password || ""
    );
    if (!foundUser || !passwordMatched) {
      return _res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    generateTokenAndSetCookie(foundUser._id, _res);
    _res.status(200).json(transformUserResponse(foundUser));
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while logging in user: ", err.message);
  }
};

export const logoutUser = (_req: Request, _res: Response<IMessageResponse>) => {
  try {
    _res.cookie("jwt", "", { maxAge: 0 });
    _res
      .status(200)
      .json({ success: true, message: "User logged out successfully!" });
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while logging out user: ", err.message);
  }
};

export const toggleUserFollower = async (
  _req: IAuthenticatedRequest<{}>,
  _res: Response<IMessageResponse>
) => {
  try {
    const { id } = _req.params;
    const followingUser = await User.findById(id);
    const currentUser: IUser = _req.user;
    if (id === currentUser._id?.toString()) {
      return _res.status(400).json({
        success: false,
        message: "You cannot follow/unfollow yourself!",
      });
    }
    if (!followingUser || !currentUser) {
      return _res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    const isFollowing = currentUser.following?.includes(id);
    if (isFollowing) {
      // Un-follow
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(followingUser._id, {
        $pull: { followers: currentUser._id },
      });
      _res.status(200).json({
        success: true,
        message: "User un-followed successfully",
      });
    } else {
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });
      await User.findByIdAndUpdate(followingUser._id, {
        $push: { followers: currentUser._id },
      });
      _res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while following/unfollowing the user: ", err.message);
  }
};

export const updateUser = async (
  _req: IAuthenticatedRequest<IUpdateUserRequest>,
  _res: Response<IMessageResponse | IUser>
) => {
  try {
    const { id } = _req.params;
    const currentUser: IUser = _req.user;
    if (id !== currentUser._id?.toString()) {
      return _res.status(400).json({
        success: false,
        message: "You cannot update other user's profile.",
      });
    }
    let { profilePic } = _req.body;
    const { name, username, email, bio, password } = _req.body;
    if (!name && !username && !email && !profilePic && !bio && !password) {
      return _res.status(400).json({
        success: false,
        message: "Empty fields provided.",
      });
    }
    let user = await User.findById(id);
    if (!user) {
      return _res.status(500).json({
        success: false,
        message: "Something went wrong!",
      });
    }
    if (!!password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword || user.password;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic?.split("/")?.pop()?.split(".")[0] as string
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    await user.save();
    _res.status(200).json(transformUserResponse(user));
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while udpating the user: ", err.message);
  }
};
