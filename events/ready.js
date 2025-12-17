const { Events } = require("discord.js")
const { cacheInvites } = require("../utils/inviteTracker")

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    for (const guild of client.guilds.cache.values()) {
      await cacheInvites(guild)
    }

    console.log(`Bot aktif | ${client.user.tag}`)

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return
      const cmd = client.commands.get(interaction.commandName)
      if (!cmd) return
      await cmd.execute(interaction, client)
    })
  }
}
