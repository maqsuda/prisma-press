import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utility/catchAsync";
import { jwtUtils } from "../utility/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "You are not logged in .Please logged in to access this resourse!",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, role, id, name } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "you don't have permision to access the required resoures. ",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });
    if (!user) {
      throw new Error("User not found.Please log in again");
    }
    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account is blocked.Please contact the support.");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };
    next();
  });
};
