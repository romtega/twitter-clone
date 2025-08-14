// lib/utils/formatUser.js
export const formatUser = userDoc => {
  if (!userDoc) return null

  const user = userDoc.toObject ? userDoc.toObject() : userDoc

  return {
    id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    profileImg: user.profileImg ?? "",
    coverImg: user.coverImg ?? "",
    followers: user.followers ?? [],
    following: user.following ?? [],
    bio: user.bio ?? "",
    links: user.links ?? "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
