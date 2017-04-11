import config from 'src/config'

export async function up(r) {
  await r.tableCreate('userAvatars', {replicas: config.server.rethinkdb.replicas})
  await addUserAvatars(r)
}

export async function down(r) {
  await r.tableDrop('userAvatars')
}

async function addUserAvatars(r) {
  await r.table('users')
    .forEach(user => {
      const githubProfilePhotoURL = user('authProviderProfiles')
        .default({})('githubOAuth2')
        .default({})('photos')
        .nth(0)('value')
        .default(null)
      return r.table('userAvatars')
        .insert({
          id: user('id'),
          jpegData: r.http(githubProfilePhotoURL, {resultFormat: 'binary'}).default(null)
        }, {
          conflict: 'replace',
          returnChanges: true,
        })
    })
}
