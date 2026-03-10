const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  Message,
  PermissionFlagsBits,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "vote",
  description: "Vote for Mili",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Vote On DBL")
        .setStyle(ButtonStyle.Link)
        .setEmoji("🎶")
        .setURL(`https://discord.gg/zenkai-headquarters-6-1363548442449674482`)
    );
    const embed = new EmbedBuilder()
    .setAuthor({
        name: `Vote Me!`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(client.color)
      .setDescription(
        "**Vote for Mili on DBL to support its growth and development! Help us bring new features and improvements to this amazing bot that enhances your Discord experience. Your votes make a difference!**"
      );

    return message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};
