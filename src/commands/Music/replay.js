const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "replay",
  description: `Replay the current song.`,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  voteOnly: false,
  dj: true,
  premium: false,

  run: async (client, message, args, prefix, player) => {
    const tick = "✅";
    const cross = "❌";

    if (!player || !player.current) {
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | There's no song currently playing.\nPlay something first to use the replay command.`)
      );
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    await player.seek(0);

    const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${tick} | The song has been restarted from the beginning.\nEnjoy the track once again!`)
      );

    return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};