const { Events, PermissionsBitField } = require("discord.js");
const palindrome = require("../modules/palindrome");
const levels = require("../modules/levels");
const ai_model = require("../modules/ai_model");
// const util = require("util");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    const client = message.client;

    if (
      !message.guild.members.me
        .permissionsIn(message.channel.id)
        .has(PermissionsBitField.Flags.SendMessages)
    ) {
      return;
    }

    //palindrome(message);
    //levels(message);

    const prefix = "a!";
    let args;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );

    if (message.mentions.repliedUser?.id == client.user.id) {
      args = message.content.trim();
    }

    if (prefixRegex.test(message.content.toLowerCase())) {
      const [, matchedPrefix] = message.content
        .toLowerCase()
        .match(prefixRegex);
      args = message.content.slice(matchedPrefix.length).trim();
    }

    if (!args) return;

    try {
      args = args.split(" ");
      const command = client.msgCommands.get(args.shift().toLowerCase());

      if (command) {
        if (command.data.dev && message.author.id != "1142001060618182746") {
          return;
        }
        command.execute(args, message, client);
        return;
      } else {
        //message.channel.send("Gemini AI is temporarily disabled");
        //ai_handler(message, args.join(" "), client);
      }
    } catch (e) {
      console.log("Error at messageCreate command execution", e);
    }
  },
};

async function ai_handler(message, argsArray, client) {
  let args = argsArray;
  await message.channel.sendTyping();

  if (args.toLowerCase() == "start-chat" || args.toLowerCase() == "chat") {
    if (client.chatHistory.get(message.channel.id)) {
      return message.channel.send(
        "Chat is already going on. Use `bye` to clear."
      );
    }
    client.chatHistory.set(message.channel.id, {
      lastMsg: Date.now(),
      history: [],
    });
    await message.channel.send(
      "Hello! \nUse `reset-chat` or `bye` to clear history."
    );
    return;
  }
  if (args.toLowerCase() == "reset-chat" || args.toLowerCase() == "bye") {
    if (client.chatHistory.get(message.channel.id)) {
      client.chatHistory.delete(message.channel.id);
      message.channel.send("Cleared history");
      return;
    }
  }
  ai_model(message, args, message.channel, client);
}
