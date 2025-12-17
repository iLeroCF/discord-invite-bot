const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { getInviteCounts } = require("../utils/db")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("En çok davet yapanları gösterir"),

  async execute(interaction) {
    const counts = getInviteCounts(interaction.guildId)

    const sorted = Object.entries(counts)
      .filter(([, count]) => Number(count) > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    if (sorted.length === 0) {
      await interaction.reply({ content: "Leaderboard boş.", ephemeral: true })
      return
    }

    const desc = sorted
      .map((u, i) => `**${i + 1}.** <@${u[0]}> — **${u[1]}** davet`)
      .join("\n")

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🏆 Invite Leaderboard")
      .setDescription(desc)
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  }
}
