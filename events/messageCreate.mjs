import { Events, PermissionsBitField } from "discord.js";
import palindrome from "../modules/palindrome.mjs";
import levels from "../modules/levels.mjs";

export const name = Events.MessageCreate;
export async function execute(message) {
  if (message.author.bot) return;
  const client = message.client;

  if (
    !message.guild.members.me
      .permissionsIn(message.channel.id)
      .has(PermissionsBitField.Flags.SendMessages)
  ) {
    return;
  }

  palindrome(message);
  levels(message);

  const prefix = "a!";
  let args;

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`,
  );

  if (message.mentions.repliedUser?.id == client.user.id) {
    args = message.content.trim();
  }

  if (prefixRegex.test(message.content.toLowerCase())) {
    const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
    args = message.content.slice(matchedPrefix.length).trim();
  }

  if (!args) return;

  try {
    args = args.split(" ");
    const command = client.msgCommands.get(args.shift().toLowerCase());
    if (!command) return;
    if (command.data.dev && message.author.id != "1142001060618182746") return;

    command.execute(args, message, client);
  } catch (e) {
    console.log("Error at messageCreate command execution", e);
  }
}
