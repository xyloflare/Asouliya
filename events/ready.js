const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
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

    setInterval(() => {
      client.chatHistory.forEach((data, channelId) => {
        const channel = client.channels.cache.get(channelId);
        if (Date.now() - data.lastMsg > 180_000) {
          client.chatHistory.delete(channelId);
          if (!channel) return;
          channel.send("History cleared due to 180s timeout");
        }
      });
    }, 60_000);
  },
};
