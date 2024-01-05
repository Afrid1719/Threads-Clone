import { Router } from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/userController";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
