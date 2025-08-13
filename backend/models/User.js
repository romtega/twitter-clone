import mongoose from "mongoose"
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6, select: false }, //quitar select para revisar las contraseñas
    followers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    following: { type: [Schema.Types.ObjectId], ref: "User", default: [] },

    profileImg: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    bio: { type: String, default: "" },
    links: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
)

// No exponer password al serializar
userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password
    return ret
  },
})

const User = mongoose.model("User", userSchema)
export default User
