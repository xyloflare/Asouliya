import { Client, ActivityType, GatewayIntentBits, Events } from "discord.js";
import { token } from "./config.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

client.once(Events.ClientReady, (readyClient) => {
  let channelid = "1211022218851786762"; //"1211022218851786762";
  const channel = client.channels.cache.get(channelid);
  channel.send({
    content: "<:CatSmug:1199189709604270100>",
    reply: { messageReference: "1224384261398859807" },
  });
  console.log("done");
  /*
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  readyClient.user.setPresence({
    activities: [
      {
        name: "Server Under Maintenence, unknown time remaining",
        type: ActivityType.Watching,
      },
    ],
    status: "idle",
  });
  */
});

client.login(token);
