import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ error: "Not authorized" })
  }
}
