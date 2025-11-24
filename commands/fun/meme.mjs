import { SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";

export const data = new SlashCommandBuilder()
  .setName("meme")
  .setDescription("Get a random meme!");
export const cooldown = 5;
export async function execute(interaction) {
  await interaction.deferReply();

  const response = await fetch("https://meme-api.com/gimme");
  const body = await response.json();
  const memeEmbed = {
    // color: 0x00000000,
    title: body.title,
    url: body.url,
    image: {
      url: body.preview[body.preview.length - 1],
    },
    footer: {
      text: "ups: " + body.ups,
    },
  };
  await interaction.editReply({ embeds: [memeEmbed] });
}
