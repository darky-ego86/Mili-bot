const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags
} = require("discord.js");

module.exports = async (client) => {
  const cfg = client.config;

  const cleanNowPlaying = async (player) => {
    try {
      if (!player.data || typeof player.data !== "object") player.data = {};
      const npm = player.data.nplaying;
      if (npm) {
        const channel = client.channels.cache.get(npm.channelId);
        if (channel) {
          const msg = await channel.messages.fetch(npm.id).catch(() => null);
          if (msg && msg.deletable) await msg.delete().catch(() => {});
        }
        delete player.data.nplaying;
      }
    } catch (e) {
      if (!e.message?.includes("ChannelNotCached") && !e.message?.includes("Unknown Message")) {
        console.error("[PLAYER] Error cleaning nowplaying:", e);
      }
    }
  };

  client.manager.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    await cleanNowPlaying(player);

    const info = track.info || track;
    const title = info.title || "Unknown";
    const uri = info.uri || "#";
    const author = info.author || "Unknown";
    const requester = track.requester || info.requester;
    const dur = fmtMs(info.length || 0);

    console.log(`[${cfg.botName}] Now Playing: "${title}" | Requested by: ${requester?.tag || "Unknown"}`);

    const getButtons = (paused) => new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(paused ? "resume" : "pause").setLabel(paused ? "▶ Resume" : "⏸ Pause").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("skip").setLabel("⏭ Skip").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("stop").setLabel("⏹ Stop").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("queuebtn").setLabel("📋 Queue").setStyle(ButtonStyle.Secondary)
    );

    const buildContainer = (paused) => new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## 🎵 Now Playing\n**[${title}](${uri})**\n\n> 👤 **Uploader:** ${author}\n> ⏱️ **Duration:** ${dur}\n> 📩 **Requested by:** ${requester?.tag || "Unknown"}\n> ${paused ? "⏸ **Paused**" : "▶ **Playing**"}`
        )
      )
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
      .addActionRowComponents(getButtons(paused));

    let isPaused = false;
    const msg = await channel.send({
      components: [buildContainer(false)],
      flags: MessageFlags.IsComponentsV2
    });

    if (!player.data) player.data = {};
    player.data.nplaying = { id: msg.id, channelId: channel.id };

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: (info.length || 600000) + 5000
    });

    collector.on("collect", async (interaction) => {
      if (!interaction.member?.voice?.channel) {
        return interaction.reply({ content: "❌ Join a voice channel first!", ephemeral: true });
      }

      switch (interaction.customId) {
        case "pause":
          player.pause(true); isPaused = true;
          await interaction.update({ components: [buildContainer(true)], flags: MessageFlags.IsComponentsV2 });
          break;
        case "resume":
          player.pause(false); isPaused = false;
          await interaction.update({ components: [buildContainer(false)], flags: MessageFlags.IsComponentsV2 });
          break;
        case "stop":
          player.setLoop?.("none");
          player.isAutoplay = false;
          player.queue.clear?.();
          await client.destroyPlayerSafely(player.guildId);
          collector.stop("stopped");
          await interaction.update({
            components: [new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ⏹ Stopped\nMusic stopped and queue cleared.")
            )],
            flags: MessageFlags.IsComponentsV2
          });
          break;
        case "skip":
          await player.stop();
          collector.stop("skipped");
          await interaction.update({
            components: [new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ⏭ Skipped!\nMoving to the next track...")
            )],
            flags: MessageFlags.IsComponentsV2
          });
          break;
        case "queuebtn": {
          const q = player.queue.slice(0, 8);
          const list = q.length ? q.map((t,i) => `\`${i+1}.\` ${t.info?.title||"Unknown"}`).join("\n") : "No upcoming tracks.";
          const qc = new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## 📋 Queue\n${list}`)
          );
          return interaction.reply({ components: [qc], flags: MessageFlags.IsComponentsV2, ephemeral: true });
        }
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason === "stopped" || reason === "skipped") return;
      try {
        await msg.edit({
          components: [new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## 🎵 Now Playing\n**${title}**\n> ⏱️ ${dur} | 👤 ${requester?.tag || "Unknown"}\n> *(Controls expired)*`)
          )],
          flags: MessageFlags.IsComponentsV2
        });
      } catch {}
    });
  });

  client.manager.on("trackEnd", async (player) => { await cleanNowPlaying(player); });
  client.manager.on("playerDestroy", async (player) => { await cleanNowPlaying(player); });
  client.manager.on("playerException", async (player) => { await cleanNowPlaying(player); });
};

function fmtMs(ms) {
  if (!ms) return "LIVE";
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`;
}
