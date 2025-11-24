import { SlashCommandBuilder } from "discord.js";
import { getGuildInfo } from "../../modules/database.mjs";

export const data = new SlashCommandBuilder()
  .setName("level_rewards")
  .setDescription("See the list of level rewards you get in this server!");
export async function execute(interaction) {
  const [guildData, isCreatedNow] = await getGuildInfo(interaction.guildId);

  // console.log(guildData);
  const lvlRolesObj = guildData.levelRoles;

  if (!lvlRolesObj)
    return interaction.reply(
      "Uh Oh! There are no rewards for levels in this server <:lofi_shrug:1214211105606475786> \nIf you're the Mod/Admin you can add level rewards with `/settings level_role`",
    );

  const dataString = Object.keys(lvlRolesObj)
    .map((key) => {
      return `${key.replace("_", " ")}: <@&${lvlRolesObj[key]}>`;
    })
    .join("\n");

  const embed = {
    color: 16777215,
    title: "Level Rewards in this server",
    description: dataString,
  };
  interaction.reply({ embeds: [embed] });
}
