import http from "node:http";
import "dotenv/config";
import { mongoConnect } from "./db/connect";
import app from "./app";

if (!process.env.PORT) {
  process.exit(1);
}

const server = http.createServer(app);
const PORT: number = parseInt(process.env.PORT, 10) || 5000;

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
