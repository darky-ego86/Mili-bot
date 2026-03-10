const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["vol", "v"],
  description: `Control the volume of the song.`,
  category: "Music",
  cooldown: 5,
  inVc: true,
  sameVc: true,
  dj: true,

  run: async (client, message, args, prefix, player) => {
    const tick = "✅";
    const cross = "❌";

    if (!player) {
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | There's no active music player right now.\nPlay something first to adjust volume.`)
      );
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${tick} | The current volume is set to **${player.options.volume}%**.\nUse \`${prefix}volume <amount>\` to change it.`);
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 200) {
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | Please enter a valid number between **1** and **200**.`)
      );
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    if (player.options.volume === amount) {
      const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${cross} | Volume is already set to **${amount}%**.\nNo change needed.`)
      );
      return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
    }

    player.setVolume(amount);

    const embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${tick} | Volume successfully updated to **${amount}%**.\nEnjoy your music at the perfect level!`)
      );

    return message.reply({ components: [embed], flags: MessageFlags.IsComponentsV2 });
  },
};