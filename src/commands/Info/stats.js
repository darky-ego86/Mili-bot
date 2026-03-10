const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags
} = require("discord.js");
const os = require("os");

module.exports = {
  name: "stats",
  aliases: ["botinfo", "bi"],
  description: "Show bot and Lavalink stats",
  category: "Info",

  run: async (client, message) => {
    try {
      const cfg = client.config;
      const fmt = (ms) => {
        const s = Math.floor((ms/1000)%60), m = Math.floor((ms/60000)%60);
        const h = Math.floor((ms/3600000)%24), d = Math.floor(ms/86400000);
        return `${d}d ${h}h ${m}m ${s}s`;
      };

      const uptime = fmt(client.uptime);
      const mem = (process.memoryUsage().heapUsed/1024/1024).toFixed(2);
      const cpu = os.loadavg()[0].toFixed(2);
      const users = client.guilds.cache.reduce((a,g) => a + g.memberCount, 0);
      const ping = Math.round(client.ws.ping);

      // Node stats
      const nodes = client.manager?.nodeMap ? Array.from(client.manager.nodeMap.values()) : [];
      const nodeLines = nodes.length
        ? nodes.map(n => `> **${n.name||"Node"}** — ${n.connected ? "🟢 Online" : "🔴 Offline"} | Players: ${n.stats?.players||0} | Playing: ${n.stats?.playingPlayers||0}`).join("\n")
        : "> No nodes connected.";

      const buildGeneral = () => new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## 📊 ${cfg.botName} Statistics\n*Made by **${cfg.developer}***`)
        )
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**Bot**\n> 🏠 **Servers:** ${client.guilds.cache.size}\n> 👥 **Users:** ${users.toLocaleString()}\n> ⏱️ **Uptime:** ${uptime}\n> 🏓 **Ping:** ${ping}ms\n\n**System**\n> 🧠 **Memory:** ${mem} MB\n> ⚙️ **CPU:** ${cpu}%\n> 🟢 **Node.js:** ${process.version}\n> 📦 **discord.js:** ${require("discord.js").version}`
          )
        )
        .addActionRowComponents(buildRow());

      const buildNodes = () => new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## 🔗 Lavalink Nodes`)
        )
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(nodeLines)
        )
        .addActionRowComponents(buildRow());

      const buildTeam = () => new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## 👥 ${cfg.botName} Team`)
        )
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `**Lead Developer**\n> ${cfg.developer}\n\n> 🔗 [Invite ${cfg.botName}](${cfg.invite})\n> 🛠️ [Support Server](${cfg.ssLink})`
          )
        )
        .addActionRowComponents(buildRow());

      const buildRow = () => new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("stat_general").setLabel("📊 General").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("stat_nodes").setLabel("🔗 Nodes").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("stat_team").setLabel("👥 Team").setStyle(ButtonStyle.Secondary)
      );

      const msg = await message.channel.send({ components: [buildGeneral()], flags: MessageFlags.IsComponentsV2 });

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: i => i.user.id === message.author.id,
        time: 60000
      });

      collector.on("collect", async (i) => {
        await i.deferUpdate();
        if (i.customId === "stat_general") await msg.edit({ components: [buildGeneral()], flags: MessageFlags.IsComponentsV2 });
        else if (i.customId === "stat_nodes") await msg.edit({ components: [buildNodes()], flags: MessageFlags.IsComponentsV2 });
        else await msg.edit({ components: [buildTeam()], flags: MessageFlags.IsComponentsV2 });
      });

      collector.on("end", () => {
        const expired = new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## 📊 ${cfg.botName} Stats\n*(Buttons expired)*`)
        );
        msg.edit({ components: [expired], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      });
    } catch (err) {
      console.error(err);
      const c = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ❌ Error\nFailed to fetch statistics.")
      );
      message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
  }
};
