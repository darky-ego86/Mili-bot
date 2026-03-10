const {
  ContainerBuilder, TextDisplayBuilder, MessageFlags
} = require("discord.js");



module.exports = {


  run: async (client, message, args, prefix, player) => {
    if (!player) {
      const c = new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## ❌ No Player\nNo active player in this server.")
      );
      return message.reply({ components: [c], flags: MessageFlags.IsComponentsV2 });
    }


  }
};
