import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginUser } from "./auth.interface";
import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utility/jwt";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // const user = await prisma.user.findUnique({ where: { email } });
  // if (!user) {
  //   throw new Error("User Not Found");
  // }

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
  //   expiresIn: config.jwt_access_expires_in,
  // } as SignOptions);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  // const refressToken = jwt.sign(jwtPayload, config.jwt_refress_secret, {
  //   expiresIn: config.jwt_refress_expires_in,
  // } as SignOptions);

  const refressToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refress_secret,
    config.jwt_refress_expires_in as SignOptions,
  );

  return {
    accessToken,
    refressToken,
  };
};

export const authService = {
  loginUser,
};
