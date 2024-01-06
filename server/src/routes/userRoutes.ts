import { Router } from "express";
import {
  getUserById,
  loginUser,
  logoutUser,
  signupUser,
  toggleUserFollower,
  updateUser,
} from "../controllers/userController";
import { authorizedRoute } from "../middlewares/authorizedRoute";

const router = Router();

router.get("/:id", getUserById);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", authorizedRoute, toggleUserFollower);
router.put("/:id", authorizedRoute, updateUser);

export default router;
