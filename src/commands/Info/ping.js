const {
  ContainerBuilder, TextDisplayBuilder, MessageFlags
} = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ping",
  description: "Check bot and database latency",
  category: "Info",

  run: async (client, message) => {
    const before = Date.now();
    const loading = new ContainerBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent("## 🏓 Pinging...")
    );
    const sent = await message.channel.send({ components: [loading], flags: MessageFlags.IsComponentsV2 });
    const msgLatency = Date.now() - before;
    const apiLatency = Math.round(client.ws.ping);

    let dbLatency = "N/A";
    try {
      const dbStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbLatency = `${Date.now() - dbStart}ms`;
    } catch {}

    const quality = apiLatency < 100 ? "🟢 Excellent" : apiLatency < 200 ? "🟡 Good" : "🔴 Poor";

    const c = new ContainerBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `## 🏓 Pong!\n\n> 📡 **Bot Latency:** \`${msgLatency}ms\`\n> 💻 **API Latency:** \`${apiLatency}ms\`\n> 🗄️ **DB Latency:** \`${dbLatency}\`\n> 📶 **Connection:** ${quality}`
      )
    );
    sent.edit({ components: [c], flags: MessageFlags.IsComponentsV2 });
  }
};
