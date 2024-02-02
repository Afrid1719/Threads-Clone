import { Router } from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPosts,
  replyToPost,
  toggleLike,
  updatePost,
} from "../controllers/postController";
import { authorizedRoute } from "../middlewares/authorizedRoute";

const router = Router();

router.get("/feeds", authorizedRoute, getFeedPosts);
router.get("/", getPosts);
router.get("/:id", getPosts);
router.post("/", authorizedRoute, createPost);
router.put("/:id", authorizedRoute, updatePost);
router.delete("/:id", authorizedRoute, deletePost);
router.put("/:id/like", authorizedRoute, toggleLike);
router.put("/:id/reply", authorizedRoute, replyToPost);

export default router;
