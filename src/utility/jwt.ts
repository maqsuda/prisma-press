import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);

  return token;
};

const verifyToken = (token: string, sceret: string) => {
  try {
    const verifiedToken = jwt.verify(token, sceret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.log("token verification Fail : ", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
