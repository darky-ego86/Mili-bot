require("dotenv").config();

module.exports = {
  token: process.env.TOKEN || "",
  prefix: ".",
  color: "#bb00ff",
  Mongo: process.env.MONGO_URI || "",
  ownerIDS: (process.env.OWNER_IDS || "").split(",").filter(Boolean),
  vote: false,
  image: process.env.BOT_BANNER || "",
  setupBgLink: process.env.BOT_BANNER || "",
  invite: process.env.INVITE_LINK || "https://discord.com/oauth2/authorize?client_id=YOUR_ID&permissions=8&scope=bot",
  inviteTwo: process.env.INVITE_LINK || "https://discord.com/oauth2/authorize?client_id=YOUR_ID&permissions=8&scope=bot",
  inviteThree: process.env.INVITE_LINK || "https://discord.com/oauth2/authorize?client_id=YOUR_ID&permissions=8&scope=bot",
  ssLink: process.env.SUPPORT_SERVER || "https://discord.gg/zenkai-headquarters-6-1363548442449674482",
  topGg: process.env.TOPGG_LINK || "",
  topgg_Api: process.env.TOPGG_API || "",
  noprefixLog: process.env.WEBHOOK_NOPREFIX || "",
  cmd_log: process.env.WEBHOOK_CMD || "",
  error_log: process.env.WEBHOOK_ERROR || "",
  blacklist_log: process.env.WEBHOOK_BLACKLIST || "",
  join_log: process.env.WEBHOOK_JOIN || "",
  leave_log: process.env.WEBHOOK_LEAVE || "",
  spotiId: process.env.SPOTIFY_CLIENT_ID || "",
  spotiSecret: process.env.SPOTIFY_CLIENT_SECRET || "",

  // Bot branding
  botName: "Mili",
  developer: "Darky",

  nodes: [
    {
      name: process.env.NODE1_NAME || "Node 1",
      host: process.env.NODE1_HOST || "lavalink.jirayu.net",
      port: parseInt(process.env.NODE1_PORT) || 13592,
      password: process.env.NODE1_PASS || "youshallnotpass",
      secure: false
    }
  ],
};
