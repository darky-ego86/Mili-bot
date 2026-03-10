const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["resume"],
  description: `Resume the paused music.`,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,
  premium: false,

  run: async (client, message, args, prefix, player) => {
    const tick = "✅";
    const cross = "❌";

    if (!player) {
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | No music is currently playing in this server.\nStart a song to use the resume command.`)
      );
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    if (!player.paused) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${cross} | The music is already playing.\nUse the \`pause\` command if you want to stop temporarily.`);
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    await player.pause(false);

    const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${tick} | Music playback has been resumed.\nSit back and enjoy the vibe!`)
      );

    return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};