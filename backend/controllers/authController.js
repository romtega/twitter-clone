import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"

export const signup = async (req, res) => {
  try {
    let { username, fullName, email, password } = req.body || {}

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    username = String(username).trim().toLowerCase()
    fullName = String(fullName).trim()
    email = String(email).trim().toLowerCase()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" })
    }

    const existing = await User.findOne({
      $or: [{ username }, { email }],
    }).lean()
    if (existing) {
      const which = existing.username === username ? "Username" : "Email"
      return res.status(400).json({ error: `${which} already exists` })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
    })

    // Cookie con JWT (después de crear)
    generateTokenAndSetCookie(user._id, res)

    return res.status(201).json({
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profileImg: user.profileImg ?? null,
      coverImg: user.coverImg ?? null,
      followers: user.followers,
      following: user.following,
    })
  } catch (error) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field"
      return res.status(409).json({ error: `${field} already exists` })
    }
    console.error("Error signup controller:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const login = async (req, res) => {
  res.json({ data: "Login route" })
}

export const logout = async (req, res) => {
  res.json({ data: "Logout route" })
}
