const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  Message,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  Component,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "support",
  aliases: ["sup"],
  description: "Get Bot support server link !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    let embed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`Click [Here](${client.config.ssLink}) To Join Support Server!`)
      )
    
    const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
          .setLabel("Support Server")
          .setStyle(ButtonStyle.Link)
          .setEmoji("•")
          .setURL(`${client.config.ssLink}`)
    );
    return message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};
