import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateTokenAndSetCookie = (
  userId: Types.ObjectId,
  _res: Response
): string => {
  if (!process.env.JWT_SECRET) {
    throw Error("JWT Secret not found!");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  _res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true, // Cannot be accessed by Browsers
    sameSite: "strict", // CSRF
  });
  return token;
};

export default generateTokenAndSetCookie;
