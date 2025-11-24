import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");
export async function execute(interaction) {
  // let latency = Math.round(interaction.client.ws.ping);
  await interaction.reply(
    `:ping_pong: Pong!\nBot latency is ${interaction.client.ws.ping}ms`,
  );
}
