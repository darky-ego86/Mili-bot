const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  name: "pause",
  aliases: ["pause"],
  description: `Pause the music`,
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
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | No music is playing right now.\nJoin a voice channel and start a song first.`)
      );
      return message.channel.send({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    if (player.paused) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${cross} | The music is already paused.\nUse the \`resume\` command to continue playback.`);
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    await player.pause(true);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${tick} | Music has been successfully paused.\nUse the \`resume\` command to play it again.`);

    return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};