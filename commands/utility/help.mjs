import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("See all my commands and info.");
export async function execute(interaction) {
  const helpEmbed = {
    color: 0xa3402e,
    title: "Asouliya's Help Page",
    description:
      "This bot uses Google's Gemini v1 model to chat with you and provide useful information. But keep in mind that this can generate potentially harmful/disrespectful/incorrect content. This is meant for fun only. \nTo start chatting, mention the bot then type your messege. \n\nIn case of any query or feature requests, you can send the developer a friend request.",
    thumbnail: {
      url: interaction.client.user.displayAvatarURL({ size: 256 }),
    },
    fields: [
      {
        name: "Developer Username",
        value: "xyloflare",
      },
    ],
  };

  interaction.reply({
    embeds: [helpEmbed],
  });
}
