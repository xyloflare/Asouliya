import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { giveXp } from "../../modules/levels.mjs";

export const data = new SlashCommandBuilder()
  .setName("give-xp")
  .setDescription("Give xp to member")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addUserOption((option) =>
    option
      .setName("member")
      .setRequired(true)
      .setDescription("The member of the server to set level and xp"),
  )
  .addIntegerOption((option) =>
    option
      .setName("xp")
      .setDescription(
        "Amount of xp to give. Automatically levels up if xp requirements are met for next level.",
      )
      .setRequired(true),
  );
export async function execute(interaction) {
  const xpAmount = interaction.options.getInteger("xp");
  const user = interaction.options.getUser("member");
  const added = await giveXp(interaction.guildId, user.id, xpAmount);

  await interaction.reply(
    `Done! Gave ${xpAmount} xp to ${user.username}.\n${user.username} is now at level ${added.level} with xp ${added.xp}!`,
  );
}
