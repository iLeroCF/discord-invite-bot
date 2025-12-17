const { Events, EmbedBuilder } = require("discord.js")
const { getInviteChannel, getMemberInviter, deleteMemberInviter, addInviteCount } = require("../utils/db")

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(client, member) {
    const channelId = getInviteChannel(member.guild.id)
    if (!channelId) return

    const channel = member.guild.channels.cache.get(channelId)
    if (!channel) return

    const inviterId = getMemberInviter(member.guild.id, member.id)
    deleteMemberInviter(member.guild.id, member.id)

    let currentInvites = null
    if (inviterId) currentInvites = addInviteCount(member.guild.id, inviterId, -1)

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("👋 Üye Ayrıldı")
      .setDescription(member.user.tag)
      .addFields({
        name: "Davet Eden",
        value: inviterId ? `<@${inviterId}>` : "Bilinmiyor",
        inline: true
      })
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()

    if (currentInvites !== null) {
      embed.addFields({
        name: "Güncel Davet Sayısı",
        value: String(currentInvites),
        inline: true
      })
    }

    channel.send({ embeds: [embed] })
  }
}
