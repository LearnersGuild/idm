export default function inviteCodeModel(thinky) {
  const {r, type: {string, date, array, boolean}} = thinky

  return {
    name: 'InviteCode',
    table: 'inviteCodes',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      code: string()
        .allowNull(false),

      description: string()
        .allowNull(false),

      roles: array()
        .default([]),

      active: boolean()
        .allowNull(false)
        .default(true),

      permanent: boolean()
        .allowNull(false)
        .default(false),

      createdAt: date()
        .allowNull(false)
        .default(r.now()),

      updatedAt: date()
        .allowNull(false)
        .default(r.now()),
    },
    associate: (InviteCode, models) => {
      InviteCode.belongsTo(models.User, 'user', 'code', 'inviteCode', {init: false})
    },
  }
}
