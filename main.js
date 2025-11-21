const fs = require("fs");
const path = require("path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const token = "MTQ0MDk4ODk4NjczMzYyOTUzMQ.GWmsW2.RcE7GO29MDGxRuaV_XOVeZx6WsNgqqKDJl4uSc";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.chatHistory = new Collection();
client.msgCommands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The msg command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const msdCmdsPath = path.join(__dirname, "msg_commands");
const msgCmdFolders = fs.readdirSync(msdCmdsPath);

for (const folder of msgCmdFolders) {
  const commandsPath = path.join(msdCmdsPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.msgCommands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
module.exports.client = client;

// server
const database = require("./modules/database");
const xpCalculation = require("./modules/levels").xpCalc;

const express = require("express");
const app = express();
const website = express();
const cors = require("cors");
const port = 5000;
const siteport = 8000;

website.use(cors());

website.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  }
});
website.use("/", express.static(path.join(__dirname, "dist")));

website.listen(siteport, () => {
  console.log(`Website frontend listening on port ${siteport}`);
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server OK");
});

app.get("/getleaderboard/:id", async (req, res) => {
  const isIdValid = /^\d+$/.test(req.params.id);
  if (!isIdValid) return res.json({ error: "invalid id" });

  try {
    const guild = await client.guilds.fetch(req.params.id);

    const fetchUsers = (await database.getAllGuildUsers(guild.id)).slice(0, 99);
    let users_data = await Promise.all(
      fetchUsers.map(async (data) => {
        const fetchUserInfo = await client.users.fetch(data.dataValues.userid);
        return {
          level: data.dataValues.level,
          xp: data.dataValues.xp,
          reqXp: xpCalculation(data.dataValues.level),
          avatar:
            fetchUserInfo.avatarURL() ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieyaZb-hSOtWnc6wha3QQlMLL8_cfvr2WIQ&s",
          username: fetchUserInfo.username,
          name: fetchUserInfo.globalName,
        };
      })
    );
    users_data = users_data.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    const data = {
      server_info: {
        iconUrl:
          guild.iconURL() ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieyaZb-hSOtWnc6wha3QQlMLL8_cfvr2WIQ&s", //"https://static.vecteezy.com/system/resources/thumbnails/013/993/061/small/mugiwara-the-illustration-vector.jpg",
        name: guild.name,
        membercount: guild.memberCount,
      },
      users_data: users_data,
    };
    // console.log(data);
    res.json(data);
  } catch (e) {
    return res.json({ error: e });
  }
});

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});
