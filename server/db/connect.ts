import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connected - " + mongoose.connection.host);
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

export async function mongoConnect() {
  if (!MONGODB_URL) {
    throw new Error("Mongo DB url not found");
  }
  await mongoose.connect(MONGODB_URL);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
