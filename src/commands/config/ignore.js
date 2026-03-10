const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  PermissionsBitField
} = require("discord.js");
const IgnoreChannelSchema = require("../../models/IgnoreChannelSchema.js");

module.exports = {
  name: "ignore",
  aliases: ["ign"],
  description: "Manage ignored channels.",
  cooldowns: 5,
  category: "Config",
  userPermissions: [PermissionsBitField.Flags.ManageGuild],
  botPermissions: [],

  run: async (client, message, args) => {
    // Check if the user provided valid arguments
    if (!args[0] || !["add", "remove"].includes(args[0].toLowerCase())) {
      const mainEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("Ignore Command")
        .setDescription("Usage:\n`ignore add <#channel>` - Add a channel to the ignore list.\n`ignore remove <#channel>` - Remove a channel from the ignore list.");
      return message.channel.send({ components: [mainEmbed], flags: MessageFlags.IsComponentsV2 });
    }

    // Get the action (add or remove) and the channel
    const action = args[0].toLowerCase();
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

    // Validate the channel
    if (!channel || !channel.isTextBased() || !channel.viewable) {
      const errorEmbed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent("❌ Please provide a valid text channel.");
      return message.channel.send({ components: [errorEmbed], flags: MessageFlags.IsComponentsV2 });
    }

    try {
      if (action === "add")
      ) {
        // Check if the channel is already ignored
        const exists = await IgnoreChannelSchema.findOne({
          guildId: message.guild.id,
          channelId: channel.id,
        });

        if (exists) {
          const alreadyIgnoredEmbed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`❌ ${channel} is already ignored.`)
      );
          return message.channel.send({ components: [alreadyIgnoredEmbed], flags: MessageFlags.IsComponentsV2 });
        }

        // Add the channel to the ignore list
        await IgnoreChannelSchema.create({
          guildId: message.guild.id,
          channelId: channel.id,
        });

        const successEmbed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`✅ ${channel} has been added to the ignore list.`)
      );
        return message.channel.send({ components: [successEmbed], flags: MessageFlags.IsComponentsV2 });

      } else if (action === "remove") {
        // Check if the channel is in the ignore list
        const exists = await IgnoreChannelSchema.findOne({
          guildId: message.guild.id,
          channelId: channel.id,
        });

        if (!exists) {
          const notIgnoredEmbed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`❌ ${channel} is not in the ignore list.`)
      );
          return message.channel.send({ components: [notIgnoredEmbed], flags: MessageFlags.IsComponentsV2 });
        }

        // Remove the channel from the ignore list
        await IgnoreChannelSchema.deleteOne({
          guildId: message.guild.id,
          channelId: channel.id,
        });

        const successEmbed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`✅ ${channel} has been removed from the ignore list.`)
      );
        return message.channel.send({ components: [successEmbed], flags: MessageFlags.IsComponentsV2 });
      }
    } catch (error) {
      console.error(error);
      const errorEmbed = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent("❌ An error occurred while processing the command.")
      );
      return message.channel.send({ components: [errorEmbed], flags: MessageFlags.IsComponentsV2 });
    }
  },
};