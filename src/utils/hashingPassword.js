import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

const hashPassword = asyncHandler(async (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10); 
  return hashedPassword;
});

const comparePassword = asyncHandler(async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword); 
});

export { hashPassword, comparePassword };
