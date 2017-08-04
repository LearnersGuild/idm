export default function userAvatarModel(thinky) {
  const {r, type: {string, date, buffer}} = thinky

  return {
    name: 'UserAvatar',
    table: 'userAvatars',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),
      jpegData: buffer(),
      createdAt: date()
        .allowNull(false)
        .default(r.now()),
      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
  }
}
