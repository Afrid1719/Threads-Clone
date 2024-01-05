import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  IMessageResponse,
  IUSerSignUpResponse,
  IUserLoginRequest,
  IUserLoginResponse,
  IUserSignUpRequest,
} from "../interfaces/i-user";
import User from "../models/userModel";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie";

export const signupUser = async (
  _req: Request<{}, {}, IUserSignUpRequest>,
  _res: Response<IUSerSignUpResponse | IMessageResponse>
) => {
  try {
    const { name, email, username, password } = _req.body;
    const user = await User.find({ $or: [{ email }, { username }] });
    if (!!user.length) {
      return _res.status(400).json({ message: "User already exists" });
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
      });
    } else {
      return _res.status(400).json({
        message: "Invalid user data!",
      });
    }
  } catch (err: any) {
    _res.status(500).json({ message: err.message });
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
        message: "Invalid username or password",
      });
    }
    generateTokenAndSetCookie(foundUser._id, _res);
    _res.status(200).json({
      id: foundUser._id,
      username: foundUser.username,
      name: foundUser.username,
      email: foundUser.email,
    });
  } catch (err: any) {
    _res.status(500).json({ message: err.message });
    console.error("Error while logging in user: ", err.message);
  }
};

export const logoutUser = (_req: Request, _res: Response<IMessageResponse>) => {
  try {
    _res.cookie("jwt", "", { maxAge: 0 });
    _res.status(200).json({ message: "User logged out successfully!" });
  } catch (err: any) {
    _res.status(500).json({ message: err.message });
    console.error("Error while logging out user: ", err.message);
  }
};
