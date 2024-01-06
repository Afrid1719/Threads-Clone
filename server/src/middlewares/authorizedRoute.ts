import { NextFunction, Request, Response } from "express";
import { IAuthenticatedRequest, IMessageResponse } from "../interfaces/i-user";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const authorizedRoute = async (
  _req: IAuthenticatedRequest,
  _res: Response<IMessageResponse>,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT Secret not found!");
    return _res
      .status(401)
      .json({ success: false, message: "Something went wrong!" });
  }
  try {
    const token = _req.cookies.jwt;
    if (!token) {
      return _res
        .status(401)
        .json({ success: false, message: "Unauthorized!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //@ts-ignore
    const user = await User.findById(decoded.userId).select("-password");
    _req.user = user;
    next();
  } catch (err: any) {
    _res.status(500).json({ success: false, message: err.message });
    console.error("Error while authorizing the request: ", err.message);
  }
};
