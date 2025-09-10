import User from "../models/userModel.js"
import { formatUser } from "../lib/utils/formatUser.js"

export const getUserProfile = async (req, res) => {
  try {
    // Normalizar username
    const usernameParam = String(req.params.username || "")
      .trim()
      .toLowerCase()

    // Buscar usuario excluyendo password y __v
    const user = await User.findOne({ username: usernameParam }).select(
      "-password -__v"
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Formatear salida
    const publicProfile = {
      ...formatUser(user),
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    }

    return res.status(200).json(publicProfile)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
