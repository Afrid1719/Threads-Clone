import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import {
  IAuthenticatedRequest,
  IMessageResponse,
  IUserSignUpResponse,
  IUpdateUserRequest,
  IUser,
  IUserLoginRequest,
  IUserLoginResponse,
  IUserSignUpRequest,
  IUpdateUserResponse,
} from "../interfaces/i-user";
import User from "../models/userModel";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie";
import { profile } from "console";

export const getUserById = async (
  _req: Request,
  _res: Response<IMessageResponse | any>
) => {
  try {
    const { id } = _req.params;
    if (!id) {
      return _res.status(400).json({
        success: false,
        message: "User id is not found!",
      });
    }
    const user = await User.findById(id).select("-password -__v");
    _res.status(200).json(user);
  } catch (err: any) {
    return _res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const signupUser = async (
  _req: Request<{}, {}, IUserSignUpRequest>,
  _res: Response<IUserSignUpResponse | IMessageResponse>
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
      return _res.status(200).json({
        id: newUser._id,
        username: newUser.username,
        name: newUser.username,
        email: newUser.email,
        bio: newUser.bio || "",
        profilePic: newUser.profilePic || "",
      });
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
  _res: Response<IUserLoginResponse | IMessageResponse>
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
    });
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
    _res.status(200).json({
      id: foundUser._id,
      username: foundUser.username,
      name: foundUser.username,
      email: foundUser.email,
      bio: foundUser.bio || "",
      profilePic: foundUser.profilePic || "",
    });
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
  _res: Response<IMessageResponse | IUpdateUserResponse>
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
    _res.status(200).json({
      id: user._id,
      username: user.username,
      name: user.username,
      email: user.email,
      bio: user.bio || "",
      profilePic: user.profilePic || "",
    });
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while udpating the user: ", err.message);
  }
};
