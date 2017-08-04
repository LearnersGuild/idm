export default function userModel(thinky) {
  const {r, type: {string, boolean, date, array, object}} = thinky

  return {
    name: 'User',
    table: 'users',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),
      active: boolean()
        .allowNull(false)
        .default(false),
      email: string()
        .allowNull(false),
      emails: array()
        .allowNull(false),
      handle: string()
        .allowNull(false),
      name: string()
        .allowNull(false),
      phone: string(),
      dateOfBirth: date(),
      timezone: string(),
      roles: array()
        .default([]),
      inviteCode: string(),
      authProviders: object()
        .allowExtra(true),
      authProviderProfiles: object()
        .allowExtra(true),
      createdAt: date()
        .allowNull(false)
        .default(r.now()),
      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (User, models) => {
      User.hasOne(models.InviteCode, 'inviteCode', 'inviteCode', 'code')
    },
  }
}
