import http from "node:http";
import "dotenv/config";
import { mongoConnect } from "./db/connect";
import app from "./app";

const server = http.createServer(app);
const PORT: string | number = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoConnect();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
}

startServer();
