const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const database = require("../../modules/database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure global settings for this server.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("level_channel")
        .setDescription(
          "Set channel to send levelup messeges. Leave blank to send in same channel as the user"
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to set")
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("levelup_msg")
        .setDescription("Set custom levelup messege.")
        .addStringOption((option) =>
          option
            .setName("messege")
            .setDescription(
              "$user for mention (ping), $displayname, $usertag, $level"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable_level_roles")
        .setDescription("Enable or disable level roles.")
        .addBooleanOption((option) =>
          option
            .setName("enable")
            .setDescription("Turn on or off")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("level_system")
        .setDescription("Disable or enable member Levels system")
        .addBooleanOption((option) =>
          option
            .setName("enable")
            .setDescription("Turn on or off")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("level_role")
        .setDescription(
          "Automatically give user a role on reaching a level. Max 20 roles."
        )
        .addIntegerOption((option) =>
          option
            .setName("level")
            .setDescription("A level for role, 1 to 100")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role for this level")
            .setRequired(true)
        )
    ),
  cooldown: 6,
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case "level_channel":
        const lvlChannel = interaction.options.getChannel("channel");
        await database.updateGuildInfo(interaction.guildId, {
          levelMsgChannel: lvlChannel.id,
        });
        await interaction.reply({
          content: `Done! Levelup messeges will now be sent in <#${lvlChannel.id}>`,
          ephemeral: true,
        });
        break;

      case "levelup_msg":
        const lvlMsg = interaction.options.getString("messege");
        console.log(lvlMsg);
        if (lvlMsg.length > 254)
          return interaction.reply({
            content: `Sorry! I cant store messages longer than 254 characters.`,
            ephemeral: true,
          });

        database.updateGuildInfo(interaction.guildId, { levelupMsg: lvlMsg });
        await interaction.reply({
          content: `Done! Levelup messeges will now be sent in this format: \n\n${lvlMsg}`,
        });
        break;

      case "enable_level_roles":
        const enableRoles = interaction.options.getBoolean("enable");
        // console.log(enableRoles);
        database.updateGuildInfo(interaction.guildId, {
          levelRolesEnabled: enableRoles,
        });
        await interaction.reply({
          content: `Done! Level roles are now ${
            enableRoles ? "enabled" : "disabled"
          }`,
          ephemeral: true,
        });
        break;

      case "level_system":
        const enableLevels = interaction.options.getBoolean("enable");
        database.updateGuildInfo(interaction.guildId, {
          levelSystem: enableLevels,
        });
        await interaction.reply({
          content: `Done! Level system is now ${
            enableLevels ? "enabled" : "disabled"
          }`,
        });
        break;

      case "level_role":
        const levelNum = interaction.options.getInteger("level");
        const role = interaction.options.getRole("role");
        const [previousData, isCreatedNow] = await database.getGuildInfo(
          interaction.guildId
        );

        const lvlRolesObj = previousData.levelRoles || {};

        if (lvlRolesObj[`level_${levelNum}`]) {
          return interaction.reply({
            content: `That level (${levelNum}) is already set to <@&${
              lvlRolesObj[`level_${levelNum}`]
            }> role`,
            ephemeral: true,
          });
        }

        lvlRolesObj[`level_${levelNum}`] = `${role.id}`;
        await database.updateGuildInfo(interaction.guildId, {
          levelRoles: lvlRolesObj,
        });
        await interaction.reply({
          content: `Done! Role ${role} will now be rewarded to users on reaching level ${levelNum}.`,
          ephemeral: true,
        });
        break;
    }
  },
};
