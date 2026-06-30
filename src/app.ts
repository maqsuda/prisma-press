import cookieParser from "cookie-parser";
import express, { Application, type Request, type Response } from "express";
import cors from "cors";
import { userRouter } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRoute);

export default app;
