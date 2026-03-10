const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  name: "disconnect",
  aliases: ["dc", "leave"],
  description: `Disconnect the bot from the voice channel.`,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  premium: false,
  dj: true,

  run: async (client, message, args, prefix, player) => {
    const tick = "✅";
    const cross = "❌";

    if (!player) {
      const embed = new EmbedBuilder()
        .setDescription(`${cross} | There's no active player in this server.`)
        .setColor(client.config.color);
      return message.channel.send({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    // Attempt to delete the last Floovi embed message
    try {
      const fetched = await message.channel.messages.fetch({ limit: 10 });
      const flooviEmbedMsg = fetched.find(
        msg =>
          msg.embeds.length > 0 &&
          msg.author?.id === client.user.id &&
          msg.embeds[0]?.author?.name?.includes("Floovi")
      );

      if (flooviEmbedMsg) await flooviEmbedMsg.delete().catch(() => {});
    } catch (err) {
      // Optional: log or ignore errors silently
    }

    // Use the safe player destruction method
    await client.destroyPlayerSafely(message.guild.id);

    const embed = new EmbedBuilder()
      .setDescription(`${tick} | Bot has been disconnected from the voice channel.\nThanks for listening with Floovi!`)
      .setColor(client.config.color);

    return message.channel.send({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};