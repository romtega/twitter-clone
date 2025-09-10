import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

import connectMongoDB from "./db/connectMongoDB.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
  connectMongoDB()
})
