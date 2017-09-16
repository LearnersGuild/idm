import {USER_ROLES} from 'src/common/models/user'

export default function userModel(thinky) {
  const {r, type: {string, boolean, date, array, object, number}} = thinky

  return {
    name: 'User',
    table: 'users',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),

      hubspotId: number()
        .integer(),

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
        .schema(string().enum(Object.values(USER_ROLES)))
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
