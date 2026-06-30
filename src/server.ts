import { Client } from "pg";
import app from "./app";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected Successfully");
    app.listen(PORT, () => {
      console.log(`server is running on port - ${PORT}`);
    });
  } catch (error) {
    console.log("Error is ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
