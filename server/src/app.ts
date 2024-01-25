import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // To parse form data in the req.body
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.get("/", (_req, _res) => {
  _res.send("hello");
});

export default app;
