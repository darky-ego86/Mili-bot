const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  Message,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  name: "clear",
  aliases: ["clearqueue"],
  description: `Clear song in queue!`,
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: true,
  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription("❌ | No Player Found For This Guild!")
        .setColor(client.config.color);
      return message.channel.send({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    await player.queue.clear();

    const embed = new EmbedBuilder()
      .setDescription("✅ | *Queue has been:* `Cleared`")
      .setColor(client.color);

    return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};
