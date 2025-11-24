import { Events, ActivityType } from "discord.js";

export const name = Events.ClientReady;
export const once = true;
export function execute(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "Shrimps",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });
}
