const { Events } = require("discord.js")
const { deleteInvite } = require("../utils/inviteTracker")

module.exports = {
  name: Events.InviteDelete,
  execute(client, invite) {
    deleteInvite(invite.guild.id, invite.code)
  }
}
