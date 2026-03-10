const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const NoPrefixSchema = require("../../models/NoPrefixSchema.js");
const moment = require("moment"); // For formatting dates

// 👇 Support Server Guild ID
const BADGE_GUILD_ID = "1399048429715460307"; // Replace with your actual Guild ID

const badgeMap = {
  "1347988025325387776": { emoji: "✅", label: "Darky" },
};

module.exports = {
  name: "profile",
  aliases: ["badges","pr"],
  description: "Displays a user's profile with global badges and no-prefix status",
  category: "Info",
  cooldown: 5,

  run: async (client, message, args) => {
    const targetUser = message.mentions.users.first() || message.author;

    // Fetch badge guild and member
    const badgeGuild = client.guilds.cache.get(BADGE_GUILD_ID);
    if (!badgeGuild) {
      return message.reply({
        content: "❌ The support server could not be found. Please contact the bot owner."
      });
    }

    let member;
    try {
      member = await badgeGuild.members.fetch(targetUser.id);
    } catch {
      member = null;
    }

    // Check badges
    let userBadges = [];
    let allBadges = "🌟 You don't have any badges yet! Join our support server to earn some!";

    if (member) {
      const badgeOrder = Object.keys(badgeMap);
      userBadges = badgeOrder
        .filter(roleId => member.roles.cache.has(roleId))
        .map(roleId => `${badgeMap[roleId].emoji} **${badgeMap[roleId].label}**`);

      if (userBadges.length > 0) {
        allBadges = userBadges.join("\n");
      }
    }

    // Check no-prefix status
    let noPrefixStatus = "No active no-prefix status.";
    try {
      const noPrefixData = await NoPrefixSchema.findOne({ userId: targetUser.id });
      if (noPrefixData) {
        if (noPrefixData.isPermanent) {
          noPrefixStatus = "**Permanent No-Prefix**";
        } else if (noPrefixData.expirationDate) {
          const expiration = moment(noPrefixData.expirationDate).format("MMMM Do YYYY, h:mm A");
          const daysLeft = moment(noPrefixData.expirationDate).diff(moment(), "days");
          noPrefixStatus = `**No-Prefix Active** (Expires: ${expiration}, ${daysLeft} days left)`;
        }
      }
    } catch (error) {
      console.error("Error fetching no-prefix data:", error);
      noPrefixStatus = "⚠️ Error fetching no-prefix status.";
    }

    // Create enhanced embed
    const embed = new EmbedBuilder()
      .setColor(client.color || "#bb00ff") // Fallback to a cool neon green
      .setAuthor({
        name: `${targetUser.username}'s Profile`,
        iconURL: targetUser.displayAvatarURL({ dynamic: true, size: 256 })
      })
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
      .setDescription(
        `**User**: ${targetUser.tag}\n` +
        `**ID**: \`${targetUser.id}\`\n` +
        `**Account Created**: ${moment(targetUser.createdAt).format("MMMM Do YYYY")}`
      )
      .addFields(
        {
          name: `Badges [${userBadges.length}]`,
          value: allBadges,
          inline: true
        },
        {
          name: "No-Prefix Status",
          value: noPrefixStatus,
          inline: true
        }
      )
      .setImage("add your banner link") // Replace with your custom banner URL
      .setFooter({
        text: `Requested by ${message.author.username} | Powered by ${client.user.username}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    // Create action row with buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Join Support Server")
        .setStyle(ButtonStyle.Link)
        .setEmoji("✨")
        .setURL("https://discord.gg/zenkai-headquarters-6-1363548442449674482"),
      new ButtonBuilder()
        .setLabel("Vote for Us")
        .setStyle(ButtonStyle.Link)
        .setEmoji("•")
        .setURL("https://discord.gg/zenkai-headquarters-6-1363548442449674482")
    );

    return message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};  },
};yle.Link)
        .setEmoji("•")
        .setURL("https://discord.gg/zenkai-headquarters-6-1363548442449674482")
    );

    return message.reply({ components: [embed, row], flags: MessageFlags.IsComponentsV2 });
  },
};