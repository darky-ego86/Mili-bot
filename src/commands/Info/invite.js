const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  Message,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  name: "invite",
  aliases: ["inv"],
  description: "invite me",
  category: "Info",
  cooldown: 5,

  run: async (client, message, args, prefix) => {

    const embed = new EmbedBuilder()
      .setColor("#bb00ff")
      .setTitle("Invite Mili")
      .setDescription("Invite me to your server for **high-quality music!**")// Thumbnail
      .setImage("https://cdn.discordapp.com/attachments/1437049647737606235/1480838813650518026/ad2d38e54d5a309f060b1ef162f3ac9a.jpg?ex=69b1221d&is=69afd09d&hm=9723a7a1330c4616c64303be0e3189e0b9a802d4b311878e7a4351b2f79fdcaa&"); // Banner Image

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite Mili")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `Your bot invite link.`
        ),
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.ssLink)
    );

    message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};
`
        ),
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.ssLink)
    );

    message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};
essage.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};
