const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Displays the help menu",
  category: "Info",

  run: async (client, message, args, prefix) => {
    const cfg = client.config;
    const categories = {};
    const basePath = path.join(__dirname, "..");
    const folders = fs.readdirSync(basePath);

    for (const folder of folders) {
      const fp = path.join(basePath, folder);
      if (!fs.statSync(fp).isDirectory()) continue;
      if (["Owner"].includes(folder)) continue;
      const files = fs.readdirSync(fp).filter(f => f.endsWith(".js"));
      categories[folder] = files.map(f => {
        const cmd = require(path.join(fp, f));
        return { name: cmd.name || f.replace(".js",""), description: cmd.description || "No description" };
      });
    }

    const totalCmds = Object.values(categories).flat().length;

    const buildHome = () => new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## 🎵 ${cfg.botName} — Help Menu\n*Made by **${cfg.developer}***\n\n> **Prefix:** \`${prefix}\` | **Commands:** ${totalCmds}\n\n${Object.keys(categories).map(c => `> 📂 **${c}** — ${categories[c].length} commands`).join("\n")}`
        )
      )
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("Select a category below to view commands.")
      )
      .addActionRowComponents(buildMenu())
      .addActionRowComponents(buildLinks());

    const buildCategory = (cat) => {
      const cmds = categories[cat] || [];
      const list = cmds.map(c => `> \`${prefix}${c.name}\` — ${c.description}`).join("\n");
      return new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## 📂 ${cat} Commands\n\n${list || "*No commands.*"}`)
        )
        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`*Use \`${prefix}help\` to return home.*`)
        )
        .addActionRowComponents(buildMenu(cat))
        .addActionRowComponents(buildLinks());
    };

    const buildMenu = (selected) => new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help_cat")
        .setPlaceholder("📂 Select a category")
        .addOptions([
          { label: "🏠 Home", value: "__home__", description: "Back to main menu" },
          ...Object.keys(categories).map(cat => ({
            label: cat, value: cat,
            description: `View ${categories[cat].length} commands`,
            default: cat === selected
          }))
        ])
    );

    const buildLinks = () => new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Invite").setURL(cfg.invite).setStyle(ButtonStyle.Link),
      new ButtonBuilder().setLabel("Support").setURL(cfg.ssLink).setStyle(ButtonStyle.Link)
    );

    const msg = await message.channel.send({
      components: [buildHome()],
      flags: MessageFlags.IsComponentsV2
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: i => i.user.id === message.author.id,
      time: 180000
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();
      const val = interaction.values[0];
      const container = val === "__home__" ? buildHome() : buildCategory(val);
      await msg.edit({ components: [container], flags: MessageFlags.IsComponentsV2 });
    });

    collector.on("end", () => {
      const expired = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## 🎵 ${cfg.botName} Help\n*Menu expired. Use \`${prefix}help\` again.*`)
      );
      msg.edit({ components: [expired], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    });
  }
};
