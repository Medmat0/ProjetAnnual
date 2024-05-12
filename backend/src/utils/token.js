import jwt from "jsonwebtoken";

const createAccessToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.JWT_ACC_TOKEN, {
    expiresIn: "1d",
  });
};

const createRefreshToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.JWT_REF_TOKEN, {
    expiresIn: "90d",
  });
};

const verifyAccessToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_ACC_TOKEN);
    if (!decodedToken.id) {
      throw new Error("Token does not contain user ID");
    }
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_REF_TOKEN);
    if (!decodedToken.id) {
      throw new Error("Token does not contain user ID");
    }
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

export {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
