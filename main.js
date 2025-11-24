const { readdirSync } = require("fs");
const { join } = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.js");

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
client.msgCommands = new Collection();

const foldersPath = join(__dirname, "commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith("js"),
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The msg command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const msdCmdsPath = join(__dirname, "msg_commands");
const msgCmdFolders = readdirSync(msdCmdsPath);

for (const folder of msgCmdFolders) {
  const commandsPath = join(msdCmdsPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith("js"),
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.msgCommands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter((file) =>
  file.endsWith("js"),
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);

const _client = client;
//export { _client as client };
module.exports.client = _client;

// server
const { getAllGuildUsers } = require("./modules/database.mjs");
const { xpCalculation } = require("./modules/levels.mjs");
const express = require("express");
const cors = require("cors");

const api = express();
const website = express();

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
    res.sendFile(join(__dirname, "dist", "index.html"));
  }
});
website.use("/", express.static(join(__dirname, "dist")));

website.listen(siteport, () => {
  console.log(`Website frontend listening on port ${siteport}`);
});

api.use(cors());

api.get("/", (_, res) => {
  res.send("Server OK");
});

api.get("/getleaderboard/:id", async (req, res) => {
  const isIdValid = /^\d+$/.test(req.params.id);
  if (!isIdValid) return res.json({ error: "invalid id" });

  try {
    const guild = await client.guilds.fetch(req.params.id);

    const fetchUsers = (await getAllGuildUsers(guild.id)).slice(0, 99);
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
      }),
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
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieyaZb-hSOtWnc6wha3QQlMLL8_cfvr2WIQ&s",
        name: guild.name,
        membercount: guild.memberCount,
      },
      users_data: users_data,
    };
    res.json(data);
  } catch (e) {
    return res.json({ error: e });
  }
});

api.listen(port, () => {
  console.log(`Web api listening on port ${port}`);
});
