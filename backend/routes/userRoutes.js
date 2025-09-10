import express from "express"
import { protectRoute } from "../middlewares/protectRoute.js"
import { getUserProfile } from "../controllers/userController.js"

const router = express.Router()

// Obtener el perfil público de un usuario por username
router.get("/:username", getUserProfile)

// Actualizar perfil del usuario autenticado
// router.put("/me", protectRoute, updateUserProfile)

// Seguir o dejar de seguir a un usuario por ID
// router.post("/:id/follow", protectRoute, followUnfollowUser)

// Obtener sugerencias de usuarios para seguir
// router.get("/suggestions", protectRoute, getSuggestions)

export default router
