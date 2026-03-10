const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  name: "purgeuppercase",
  aliases: ['puc'],
  description: "Delete messages in uppercase",
  category: "Purge",
  userPermissions: PermissionFlagsBits.ManageMessages,
  botPermissions: PermissionFlagsBits.ManageMessages,
  cooldowns: 5,

  run: async (client, message, args) => {
    if (message.deletable) await message.delete().catch(() => {});

    const fetched = await message.channel.messages.fetch({ limit: 100 });
    
    const filtered = fetched.filter(m => m.content && m.content === m.content.toUpperCase() && m.content.length > 5);

    await message.channel.bulkDelete(filtered, true).catch(() => {});

    return message.channel.send({
      embeds: [
        new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`Deleted ${filtered.size} messages.`)
      ),
      ],
    }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 4000));
  },
};
