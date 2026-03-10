const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags
} = require("discord.js");
const updateQueue = require("../../handlers/setupQueue.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Play a song or playlist",
  category: "Music",
  inVc: true, sameVc: true, dj: true, premium: false,

  run: async (client, message, args, prefix) => {
    const channel = message.member.voice.channel;
    const query = args.join(" ");

    if (!args[0]) {
      const c = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## ❌ Missing Query\nProvide a song name, URL or playlist.\n\n**Usage:** \`${prefix}play <song>\``)
      );
      return message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }

    const availableNodes = client.getAvailableNodes();
    if (!availableNodes.length) {
      const c = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ❌ No Nodes Available\nNo Lavalink nodes are online. Please try again in a moment.")
      );
      return message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }

    try {
      const node = client.manager.nodeMap?.values().next().value;
      const player = client.manager.createConnection({
        guildId: message.guild.id,
        textChannel: message.channel.id,
        voiceChannel: channel.id,
        volume: 80,
        deaf: true,
      });

      let result;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          result = await client.manager.resolve({ query, source: "ytmsearch", requester: message.author, node });
          break;
        } catch (e) {
          if (attempt === 2) throw e;
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }

      if (!result.tracks.length) {
        await client.destroyPlayerSafely(message.guild.id);
        const c = new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ❌ No Results\nNo tracks found for **${query}**.`)
        );
        return message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
      }

      if (result.type === "PLAYLIST") {
        for (const track of result.tracks) player.queue.add(track);
        if (!player.playing && !player.paused && player.queue.size > 0) await player.play();
        const c = new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## 📋 Playlist Added\n**${result.playlistName}**\n\n> 🎵 **${result.tracks.length} tracks** added to queue\n> 📩 Requested by **${message.author.tag}**`
          )
        );
        await updateQueue(message.guild, player.queue);
        return message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
      }

      const track = result.tracks[0];
      track.requester = message.author;
      player.queue.add(track);
      if (!player.playing && !player.paused) await player.play();

      const title = track.info?.title || "Unknown Track";
      const uri = track.info?.uri || "#";
      const author = track.info?.author || "Unknown";
      const dur = fmtMs(track.info?.length || 0);

      const showButtons = player.queue.length >= 2;
      const row = showButtons
        ? new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("upcoming").setLabel("▶ Play Next").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("remove_song").setLabel("🗑 Remove").setStyle(ButtonStyle.Danger)
          )
        : null;

      let c = new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `## 🎵 Added to Queue\n**[${title}](${uri})**\n\n> 👤 **Uploader:** ${author}\n> ⏱️ **Duration:** ${dur}\n> 📩 **Requested by:** ${message.author.tag}`
          )
        );
      if (showButtons) {
        c.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
          .addActionRowComponents(row);
      }

      const sent = await message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });

      if (showButtons) {
        const collector = sent.createMessageComponentCollector({
          componentType: ComponentType.Button,
          filter: i => i.user.id === message.author.id,
          time: 15000, max: 1
        });

        collector.on("collect", async (interaction) => {
          if (interaction.customId === "remove_song") {
            player.queue.pop();
            const done = new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ✅ Removed\nTrack removed from queue.")
            );
            await interaction.update({ components: [done], flags: MessageFlags.IsComponentsV2 });
          } else if (interaction.customId === "upcoming") {
            const t = player.queue.pop();
            player.queue.splice(0, 0, t);
            const done = new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent("## ✅ Set as Next\nTrack will play after the current one.")
            );
            await interaction.update({ components: [done], flags: MessageFlags.IsComponentsV2 });
          }
        });

        collector.on("end", (_, reason) => {
          if (reason === "time") {
            const clean = new ContainerBuilder().addTextDisplayComponents(
              new TextDisplayBuilder().setContent(
                `## 🎵 Added to Queue\n**[${title}](${uri})**\n> ⏱️ ${dur} | 👤 ${author}`
              )
            );
            sent.edit({ components: [clean], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
          }
        });
      }

      await updateQueue(message.guild, player.queue);
    } catch (error) {
      console.error("[PLAY]", error);
      const c = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## ❌ Playback Error\n${error.message || "Failed to play the track. Try again."}`)
      );
      return message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
  }
};

function fmtMs(ms) {
  if (!ms) return "LIVE";
  const m = Math.floor(ms/60000), s = Math.floor((ms%60000)/1000);
  return `${m}:${s.toString().padStart(2,"0")}`;
}
