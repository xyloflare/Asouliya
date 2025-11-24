import {
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ActionRowBuilder,
} from "discord.js";

import { getAllGuildUsers } from "../../modules/database.mjs";
import { xpCalc as xpCalculation } from "../../modules/levels.mjs";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Shows top level users in this server");
export const cooldown = 15;
export async function execute(interaction) {
  // await interaction.deferReply();
  let fetchUsers = await getAllGuildUsers(interaction.guildId);
  // console.log(fetchUsers);
  let data = fetchUsers
    .map((data) => {
      return {
        userId: data.dataValues.userid,
        level: data.dataValues.level,
        xp: data.dataValues.xp,
        reqXp: xpCalculation(data.dataValues.level),
      };
    })
    .sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    })
    .slice(0, 10);

  // console.log(data);
  let stringData = data
    .map((data, index) => {
      return `**#${index + 1}** -> <@${data.userId}> \nLevel: \`${data.level}\` \nxp: \`${data.xp}/${data.reqXp}\`\n`;
    })
    .join("\n");

  // console.log(stringData);
  const leaderboardEmbed = {
    color: 16777215,
    thumbnail: {
      url: interaction.guild.iconURL(),
    },
    title: "Leaderboard in " + interaction.member.guild.name,
    description: stringData,
  };

  const leaderboardbtn = new ButtonBuilder()
    .setURL(
      "http://j-variable.gl.at.ply.gg:1872/leaderboard/" + interaction.guild.id,
    )
    .setLabel("View More")
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder().addComponents(leaderboardbtn);

  await interaction.reply({
    embeds: [leaderboardEmbed],
    components: [row],
  });
}
