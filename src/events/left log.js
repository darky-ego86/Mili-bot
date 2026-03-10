const { EmbedBuilder, WebhookClient } = require("discord.js");
const client = require("..");
const web = new WebhookClient({ url: `${client.config.leave_log}` });

// Default fake users
client.fakeUsers = client.fakeUsers || 0;

module.exports = async (client) => {
  client.on("guildDelete", async (guild) => {
    try {
      // Real Users
      const realUsers = client.guilds.cache.reduce(
        (acc, g) => acc + (g.memberCount || 0),
        0
      );

      // Combined Total
      const totalUsers = realUsers + client.fakeUsers;

      // Total Servers
      const totalGuilds = client.guilds.cache.size;

      // ========== Custom Banner ==========
      const bannerURL = "https://cdn.discordapp.com/attachments/1437049647737606235/1480838813650518026/ad2d38e54d5a309f060b1ef162f3ac9a.jpg?ex=69b1221d&is=69afd09d&hm=9723a7a1330c4616c64303be0e3189e0b9a802d4b311878e7a4351b2f79fdcaa&"; // Replace this with your image

      // ========== Embed ==========
      const em = new EmbedBuilder()
        .setTitle(`Guild Left`)
        .setColor(client.color || 0x2b2d31)
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setThumbnail(guild.iconURL({ dynamic: true })) // server icon
        .setImage(bannerURL) // custom banner added
        .addFields([
          {
            name: `Guild Info`,
            value: `Guild Name: ${guild.name}\nGuild Id: ${
              guild.id
            }\nGuild Created: <t:${Math.round(
              guild.createdTimestamp / 1000
            )}:R>\nMemberCount: ${guild.memberCount} Members`,
          },
          {
            name: `Bot Info`,
            value: `**Servers:** ${totalGuilds}\n**Users:** ${totalUsers.toLocaleString()}`,
          },
        ])
        .setTimestamp();

      // Send to webhook
      await web.send({ embeds: [em] });
    } catch (error) {
      console.log("Error sending guild left webhook:", error);
    }
  });
};
t webhook:", error);
    }
  });
};
