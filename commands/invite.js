const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js")

const { setInviteChannel } = require("../utils/db")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite log kanalı ayarlar")
    .addChannelOption(o =>
      o.setName("kanal")
        .setDescription("Log kanalı")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("kanal")
    setInviteChannel(interaction.guildId, channel.id)
    await interaction.reply({ content: `Kanal ayarlandı: ${channel}`, ephemeral: true })
  }
}
