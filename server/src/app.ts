import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.get("/", (_req, _res) => {
  _res.send("hello");
});

export default app;
