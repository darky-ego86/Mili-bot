const { readdirSync } = require("fs");
const { white, green } = require("chalk");
const { WebhookClient, EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  // Create webhook client
  const webhook = new WebhookClient({
    url: "${client.config.cmd_log}"
  });

  try {
    // Load commands dynamically
    readdirSync("./src/commands/").forEach((dir) => {
      const commands = readdirSync(`./src/commands/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../commands/${dir}/${cmd}`);
        if (command.name) {
          client.mcommands.set(command.name, command);
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    });

    console.log(
      white("[") + green("INFO") + white("] ") + green("Command ") + white("Events") + green(" Loaded!")
    );
  } catch (error) {
    console.log(error);
  }

  // Create embed for startup message (manual description)
  const embed = new EmbedBuilder()
    .setColor("#ffffff")
    .setTitle("Tedex Startup Initiated")
    .setDescription(
      "> Commands Loaded\n" +
      "> Riffy Initialized\n" +
      "> Database Connected\n" +
      "> Tedex Ready\n" +
      "> Event Listeners Registered\n" +
      "> Webhook Connected"
    )
    .setThumbnail("https://images-ext-1.discordapp.net/external/cchToVAnwxFINMj24F4Nj5-F1Qpk7D8C0q42oE13qc4/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1390965840437968896/38840bc34bc8b63f483caa00895ac982.webp?format=webp&width=348&height=348") // replace with your bot thumbnail
    .setImage("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHNkZGtsZzkxZHFtMmtiMWxmaGR6MDRobTRvZ2V6em83bjVpMXB6byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/25ckx2IRr8kq8XrqxQ/giphy.gif") // replace with your banner/image
    .setFooter({ text: "Tedex by Darky", iconURL: client.user?.displayAvatarURL() })
    .setTimestamp();

  // Send the embed to the webhook
  webhook.send({ embeds: [embed] });
};
