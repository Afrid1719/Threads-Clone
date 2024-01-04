import express from "express";

const app = express();

app.get("/", (_req, _res) => {
  _res.send("hello");
});

export default app;
