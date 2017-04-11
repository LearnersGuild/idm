export async function up(r) {
  await r.table('userAvatars')
    .update({
      createdAt: r.now(),
      updatedAt: r.now(),
    })
}

export async function down(r) {
  await r.table('userAvatars')
    .update({
      createdAt: r.literal(),
      updatedAt: r.literal(),
    })
}
