const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require("discord.js");

module.exports = {
    name: "premiumreq",
    description: "Advertise premium features of the bot",
    category: "Information",
    ownerOnly: false, // Anyone can run this command to learn about premium
    run: async (client, message, args, prefix) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Upgrade to Premium!")
                .setColor(client.color)
                .setDescription("Unlock amazing features by upgrading to premium!")
                .addFields(
                    { name: "Exclusive Features", value: "- Priority support\n- Special Role in Server" },
                    { name: "Why Go Premium?", value: "Premium gives your server an edge with exclusive controls and customization options. Take full control of your voice channels and elevate your server's experience." },
                    { name: "How to Upgrade?", value: "Visit [our Support Server](https://discord.gg/zenkai-headquarters-6-1363548442449674482) to subscribe & contact the server admin to unlock premium features." }
                )
                .setFooter({ text: "Upgrade today and enjoy premium benefits!" })
                .setTimestamp();

            return message.channel.send({ components: [embed], flags: MessageFlags.IsComponentsV2 });
        } catch (error) {
            console.error(error);
            return message.channel.send("An error occurred while showing premium features.");
        }
    }
};
