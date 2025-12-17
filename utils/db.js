const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, "..", "data.json")

function ensure() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ guilds: {} }, null, 2))
  }
}

function read() {
  ensure()
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"))
  } catch {
    return { guilds: {} }
  }
}

function write(data) {
  ensure()
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

function ensureGuild(db, guildId) {
  if (!db.guilds[guildId]) db.guilds[guildId] = {}
  if (!db.guilds[guildId].inviteCounts) db.guilds[guildId].inviteCounts = {}
  if (!db.guilds[guildId].memberInviters) db.guilds[guildId].memberInviters = {}
}

function setInviteChannel(guildId, channelId) {
  const db = read()
  ensureGuild(db, guildId)
  db.guilds[guildId].inviteChannelId = channelId
  write(db)
}

function getInviteChannel(guildId) {
  const db = read()
  return db.guilds[guildId]?.inviteChannelId || null
}

function addInviteCount(guildId, inviterId, amount) {
  if (!inviterId) return 0
  const db = read()
  ensureGuild(db, guildId)

  const current = Number(db.guilds[guildId].inviteCounts[inviterId] || 0)
  const next = Math.max(0, current + Number(amount || 0))
  db.guilds[guildId].inviteCounts[inviterId] = next

  write(db)
  return next
}

function getInviteCounts(guildId) {
  const db = read()
  return db.guilds[guildId]?.inviteCounts || {}
}

function setMemberInviter(guildId, memberId, inviterId) {
  if (!inviterId) return
  const db = read()
  ensureGuild(db, guildId)
  db.guilds[guildId].memberInviters[memberId] = inviterId
  write(db)
}

function getMemberInviter(guildId, memberId) {
  const db = read()
  return db.guilds?.[guildId]?.memberInviters?.[memberId] || null
}

function deleteMemberInviter(guildId, memberId) {
  const db = read()
  ensureGuild(db, guildId)
  delete db.guilds[guildId].memberInviters[memberId]
  write(db)
}

module.exports = {
  setInviteChannel,
  getInviteChannel,
  addInviteCount,
  getInviteCounts,
  setMemberInviter,
  getMemberInviter,
  deleteMemberInviter
}
