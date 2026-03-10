const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "shuffle",
  aliases: ["shuffle"],
  description: `Shuffle the queue!`,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  voteOnly: false,
  premium: false,
  dj: true,

  run: async (client, message, args, prefix, player) => {
    const tick = "✅";
    const cross = "❌";

    if (!player || !player.queue || !player.queue.length) {
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | There's nothing in the queue to shuffle.\nAdd more songs first.`)
      );
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    await player.queue.shuffle();

    const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${tick} | The queue has been shuffled successfully.\nEnjoy your music in a fresh random order!`)
      );

    return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};