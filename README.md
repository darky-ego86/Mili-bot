<p align="center">
  <img src="image/mili.jpg" alt="Mili Banner" width="100%" style="border-radius: 12px;" />
</p>

<h1 align="center">🎵 Mili — Discord Music Bot</h1>

<p align="center">
  <b>A powerful, feature-rich Discord music bot built for smooth playback, advanced queue management, and full server automation.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20by-Darky-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built%20with-discord.js-5865F2?style=for-the-badge&logo=discord" />
  <img src="https://img.shields.io/badge/Powered%20by-Lavalink-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## ⚠️ Credit Notice — Please Read

> **This is a public repository. You are free to use, modify, and self-host Mili for personal or community use.**
>
> However, if you use this code — in whole or in part — you **must** give proper credit to the original developer.
>
> ❌ Do **not** claim this bot as your own original work.  
> ❌ Do **not** remove credit mentions from the source code or README.  
> ✅ You **may** rebrand, customize, and host it freely — just keep the credits intact.
>
> **Original Developer: Darky**  
> Respect the work. Give credit where it's due. 🙏

---

## ✨ Features

- 🎵 High-quality audio via **Lavalink v4**
- 🔎 Supports **YouTube, Spotify, SoundCloud**, and more
- 📋 Advanced queue management with pagination
- 🔁 Loop modes — Track / Queue / Off
- 🔀 Shuffle queue
- 📂 Playlist support (save & share playlists)
- 🎚️ 20+ Audio filters (bassboost, nightcore, 8D, lofi, etc.)
- 🖼️ Beautiful **Now Playing** canvas card
- 💎 Premium system (per-user & per-guild)
- 🛡️ DJ role & admin permission system
- 🔔 No-prefix mode for premium users
- 🧹 Advanced purge commands
- 📊 Detailed bot stats (General, Nodes, Team)
- 🗃️ MongoDB-backed persistent storage
- 🔄 Auto-reconnect & crash recovery
- 🧩 Discord Components V2 UI (ContainerBuilder)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/dark.ego86/mili-bot.git
cd mili-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
TOKEN=your_bot_token
MONGO_URI=your_mongodb_uri
NODE1_HOST=lavalink.jirayu.net
NODE1_PORT=13592
NODE1_PASS=youshallnotpass
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
OWNER_IDS=your_discord_id
```

### 4. Start the bot

```bash
npm start
# or
node src/Mili.js
```

---

## 🎮 Commands

| Category | Commands |
|----------|----------|
| 🎵 Music | `play`, `pause`, `resume`, `skip`, `stop`, `queue`, `nowplaying`, `volume`, `loop`, `shuffle`, `autoplay`, `search`, `back`, `clear`, `join`, `disconnect`, `lyrics`, `remove`, `replay` |
| 🎚️ Filters | `bassboost`, `nightcore`, `8d`, `lofi`, `slowed`, `daycore`, `vaporwave`, `alien`, `chill`, `dance`, `darthvader`, `doubletime`, `haunted`, `soft`, `space`, `underwater`, `warmpad`, `china`, `ambient`, `reset` |
| ℹ️ Info | `help`, `ping`, `stats`, `uptime`, `invite`, `support`, `vote` |
| ⚙️ Config | `prefix`, `ignore` |
| 🧹 Purge | `purge`, `purgeall`, `purgebots`, `purgelinks`, `purgeimages`, and more |
| 💎 Premium | `premium`, `premiumguild`, `premiumstatus`, `delpremium` |
| 👑 Owner | `eval`, `blacklistuser`, `blacklistserver`, `noprefix`, `reload`, `leaveserver` |

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| **Node.js** | Runtime |
| **Discord.js v14** | Discord API |
| **Riffy** | Lavalink Client |
| **Lavalink v4** | Audio Engine |
| **MongoDB + Mongoose** | Database |
| **Canvas** | Now Playing card |
| **discord-hybrid-sharding** | Multi-cluster support |

---

## 📁 Project Structure

```
Mili/
├── src/
│   ├── Mili.js              ← Entry point (cluster manager)
│   ├── index.js             ← Shard client loader
│   ├── config/
│   │   └── config.js        ← Bot configuration (uses .env)
│   ├── commands/
│   │   ├── Music/
│   │   ├── Filters/
│   │   ├── Info/
│   │   ├── Config/
│   │   ├── Purge/
│   │   ├── Premium/
│   │   └── Owner/
│   ├── events/
│   ├── handlers/
│   ├── models/
│   ├── structure/
│   └── utils/
├── image/
│   └── mili.jpg             ← Bot banner image (add your own)
├── fonts/
├── assets/
├── .env.example
└── package.json
```

---

## 🤝 Contributing

Pull requests are welcome! If you find bugs or want to add features:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push and open a pull request

---

## 📜 License

This project is licensed under the **MIT License** — meaning you're free to use, modify, and distribute it.

**But again — you must credit the original developer. No exceptions.**

---

## 💜 Credits

> **Original Developer:** Darky  
> **Bot Name:** Mili  
> **Framework:** discord.js + Riffy + Lavalink  
>
> *If you use this bot publicly or for your community, a shoutout goes a long way. Much appreciated!* 🙏

---

<p align="center">Made with 💜 by <b>Darky</b> · Mili — Your Discord Music Companion</p>
