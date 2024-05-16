import asyncHandler from "express-async-handler";

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ error: "You are not logged in." });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
  });
  res.status(200).json({ status: "Success" });
});

export { logout };
