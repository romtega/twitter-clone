import jwt from "jsonwebtoken"

export function generateTokenAndSetCookie(userId, res) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  })

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS en prod
    sameSite: "lax", // "strict" si no haces cross-site
    maxAge: 15 * 24 * 60 * 60 * 1000,
  })
}
