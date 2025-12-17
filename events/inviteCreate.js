const { Events } = require("discord.js")
const { updateInvite } = require("../utils/inviteTracker")

module.exports = {
  name: Events.InviteCreate,
  execute(client, invite) {
    updateInvite(invite.guild.id, invite)
  }
}
