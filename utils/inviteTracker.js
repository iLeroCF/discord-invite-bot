const cache = new Map()

async function cacheInvites(guild) {
  const invites = await guild.invites.fetch()
  const map = new Map()

  invites.forEach(i => {
    map.set(i.code, {
      uses: i.uses || 0,
      inviterId: i.inviter?.id || null,
      inviterTag: i.inviter?.tag || null
    })
  })

  cache.set(guild.id, map)
}

function updateInvite(guildId, invite) {
  const g = cache.get(guildId) || new Map()
  g.set(invite.code, {
    uses: invite.uses || 0,
    inviterId: invite.inviter?.id || null,
    inviterTag: invite.inviter?.tag || null
  })
  cache.set(guildId, g)
}

function deleteInvite(guildId, code) {
  const g = cache.get(guildId)
  if (!g) return
  g.delete(code)
}

async function findInvite(guild) {
  const newInvites = await guild.invites.fetch()
  const oldInvites = cache.get(guild.id) || new Map()

  let used = null
  const fresh = new Map()

  newInvites.forEach(i => {
    fresh.set(i.code, {
      uses: i.uses || 0,
      inviterId: i.inviter?.id || null,
      inviterTag: i.inviter?.tag || null
    })

    const oldUses = oldInvites.get(i.code)?.uses || 0
    if (i.uses > oldUses) used = i
  })

  cache.set(guild.id, fresh)

  if (!used) return null

  return {
    code: used.code,
    uses: used.uses,
    inviterId: used.inviter?.id || null,
    inviterTag: used.inviter?.tag || null
  }
}

module.exports = {
  cacheInvites,
  updateInvite,
  deleteInvite,
  findInvite
}
