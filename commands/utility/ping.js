const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    // let latency = Math.round(interaction.client.ws.ping);

    await interaction.reply(
      `:ping_pong: Pong!\nBot latency is ${interaction.client.ws.ping}ms`
    );
  },
};
