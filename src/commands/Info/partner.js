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
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "partner",
  aliases: ["sponser"],
  description: "Get Bot Sponsers !!",
  // userPermissions: PermissionFlagsBits.SendMessages,
  // botPermissions: PermissionFlagsBits.SendMessages,
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`Mili - Partners`)
      .setDescription(`**Hidencloud - Best Premium and Affordable Hosting**`);

    const button = new ButtonBuilder()
      .setLabel(`Server`)
      .setStyle(ButtonStyle.Link)
      .setEmoji("•")
      .setURL(`https://discord.gg/nexcloud`);

    const row = new ActionRowBuilder().addComponents(button);

    return message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};
},
};
