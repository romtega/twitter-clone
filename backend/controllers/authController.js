import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"
import { formatUser } from "../lib/utils/formatUser.js"

export const signup = async (req, res) => {
  try {
    let { username, fullName, email, password } = req.body || {}

    username = username?.trim().toLowerCase()
    fullName = fullName?.trim()
    email = email?.trim().toLowerCase()

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

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

    generateTokenAndSetCookie(user._id, res)

    return res.status(201).json(formatUser(user))
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
  try {
    let { username, email, password } = req.body || {}

    username = username ? String(username).trim().toLowerCase() : undefined
    email = email ? String(email).trim().toLowerCase() : undefined

    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).select("+password")

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    generateTokenAndSetCookie(user._id, res)

    return res.status(200).json(formatUser(user))
  } catch (error) {
    console.error("Error login controller:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const logout = async (req, res) => {
  res.json({ data: "Logout route" })
}
