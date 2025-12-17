const { Events, EmbedBuilder } = require("discord.js")
const { getInviteChannel, addInviteCount, setMemberInviter } = require("../utils/db")
const { findInvite } = require("../utils/inviteTracker")

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(client, member) {
    const channelId = getInviteChannel(member.guild.id)
    if (!channelId) return

    const channel = member.guild.channels.cache.get(channelId)
    if (!channel) return

    const ageMs = Date.now() - member.user.createdTimestamp
    const ageDays = Math.floor(ageMs / 86400000)
    const isSuspicious = ageDays < 30

    const invite = await findInvite(member.guild).catch(() => null)
    const inviterId = invite?.inviterId || null
    const inviterText = inviterId ? `<@${inviterId}>` : "Bilinmiyor"

    let currentInvites = null

    if (!isSuspicious && inviterId) {
      setMemberInviter(member.guild.id, member.id, inviterId)
      currentInvites = addInviteCount(member.guild.id, inviterId, 1)
    }

    const embed = new EmbedBuilder()
      .setColor(isSuspicious ? 0xffa500 : 0x2ecc71)
      .setTitle(isSuspicious ? "⚠️ Şüpheli Hesap Katıldı" : "✅ Yeni Üye Katıldı")
      .setDescription(member.user.tag)
      .addFields(
        { name: "Hesap Yaşı", value: `${ageDays} gün`, inline: true },
        { name: "Davet Eden", value: inviterText, inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()

    if (currentInvites !== null) {
      embed.addFields({ name: "Güncel Davet Sayısı", value: String(currentInvites), inline: true })
    }

    if (isSuspicious) {
      embed.addFields({
        name: "Sayaç",
        value: "Bu katılım davet sayısına eklenmedi.",
        inline: false
      })
    }

    channel.send({ embeds: [embed] })
  }
}
