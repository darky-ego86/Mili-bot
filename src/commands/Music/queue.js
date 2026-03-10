const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags
} = require("discord.js");

const PER_PAGE = 10;

module.exports = {
  name: "queue",
  aliases: ["q","list"],
  description: "Show the current music queue",
  category: "Music",

  run: async (client, message) => {
    try {
      const player = client.manager.players.get(message.guild.id);
      if (!player) {
        const c = new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## ❌ No Player\nNo active player in this server.")
        );
        return message.channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 });
      }

      const current = player.current;
      const tracks = player.queue.slice(0);

      if (!current && !tracks.length) {
        const c = new ContainerBuilder().addTextDisplayComponents(
          new TextDisplayBuilder().setContent("## 📋 Empty Queue\nNo tracks in queue.")
        );
        return message.channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 });
      }

      const totalPages = Math.max(1, Math.ceil(tracks.length / PER_PAGE));
      let page = 0;

      const buildContainer = (pg) => {
        const nowPlaying = current
          ? `**🎵 Now Playing:**\n> [${current.info.title}](${current.info.uri}) — ${current.info.author}`
          : "**Nothing playing.**";

        const slice = tracks.slice(pg * PER_PAGE, (pg + 1) * PER_PAGE);
        const upNext = slice.length
          ? slice.map((t, i) => `\`${pg * PER_PAGE + i + 1}.\` [${t.info.title}](${t.info.uri})`).join("\n")
          : "No upcoming tracks.";

        const c = new ContainerBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## 📋 Music Queue — ${message.guild.name}\n\n${nowPlaying}`)
          )
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Up Next:**\n${upNext}\n\n*Page ${pg+1}/${totalPages} • ${tracks.length} tracks*`)
          );

        if (totalPages > 1) {
          c.addActionRowComponents(
            new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId("q_prev").setLabel("◀ Prev").setStyle(ButtonStyle.Secondary).setDisabled(pg === 0),
              new ButtonBuilder().setCustomId("q_next").setLabel("Next ▶").setStyle(ButtonStyle.Secondary).setDisabled(pg + 1 === totalPages)
            )
          );
        }
        return c;
      };

      const msg = await message.channel.send({ components: [buildContainer(page)], flags: MessageFlags.IsComponentsV2 });

      if (totalPages <= 1) return;

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: i => i.user.id === message.author.id,
        time: 60000
      });

      collector.on("collect", async (i) => {
        if (i.customId === "q_prev" && page > 0) page--;
        if (i.customId === "q_next" && page < totalPages - 1) page++;
        await i.update({ components: [buildContainer(page)], flags: MessageFlags.IsComponentsV2 });
      });

      collector.on("end", () => {
        msg.edit({ components: [buildContainer(page)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
      });
    } catch (err) {
      console.error(err);
      const c = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ❌ Error\nFailed to display queue.")
      );
      message.channel.send({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }
  }
};
