const PremiumGuild = require("../../models/PremiumGuildSchema");
const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "premiumstatus",
    aliases: ["premstats", "premstatus"],
    description: "Check Premium Status of Server",
    category: "Premium",
    ownerOnly: false,

    run: async (client, message, args, prefix) => {
        try {
            const guild = message.guild;
            const premiumGuild = await PremiumGuild.findOne({ Guild: guild.id });

            const embed = new EmbedBuilder()
                .setTitle("Premium Status")
                .setColor("#bb00ff")
                .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }));

            if (!premiumGuild) {
                embed.setDescription(
                    `${"❌"} **Premium Status: Not Active**\n\n` +
                    `**Guild Name:** ${guild.name}\n` +
                    `**Guild ID:** ${guild.id}\n` +
                    `**Members:** ${guild.memberCount}\n` +
                    `**Plan Type:** None\n` +
                    `**Expires:** N/A\n`
                );
            } else {
                if (premiumGuild.Permanent) {
                    embed.setDescription(
                        `${"✅"} **Premium Status: Active (Permanent)**\n\n` +
                        `**Guild Name:** ${guild.name}\n` +
                        `**Guild ID:** ${guild.id}\n` +
                        `**Members:** ${guild.memberCount}\n` +
                        `**Plan Type:** Permanent\n` +
                        `**Expires:** Never\n`
                    );
                } else {
                    const remainingTime = premiumGuild.Expire - Date.now();

                    if (remainingTime > 0) {
                        embed.setDescription(
                            `${"✅"} **Premium Status: Active**\n\n` +
                            `**Guild Name:** ${guild.name}\n` +
                            `**Guild ID:** ${guild.id}\n` +
                            `**Members:** ${guild.memberCount}\n` +
                            `**Plan Type:** Temporary\n` +
                            `**Expires:** <t:${Math.floor(premiumGuild.Expire / 1000)}:R> (<t:${Math.floor(premiumGuild.Expire / 1000)}:F>)\n`
                        );
                    } else {
                        embed.setDescription(
                            `${"❌"} **Premium Status: Expired**\n\n` +
                            `**Guild Name:** ${guild.name}\n` +
                            `**Guild ID:** ${guild.id}\n` +
                            `**Members:** ${guild.memberCount}\n` +
                            `**Plan Type:** Expired\n` +
                            `**Expired At:** <t:${Math.floor(premiumGuild.Expire / 1000)}:F>\n`
                        );
                    }
                }
            }

            return message.channel.send({ components: [embed], flags: MessageFlags.IsComponentsV2 });
        } catch (error) {
            console.error(error);
            return message.channel.send(`${"❌"} An error occurred while checking the premium status.`);
        }
    }
};