const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("troubleshoot")
    .setDescription(
      "If something isnt working as expected, try troubleshooting!"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(interaction) {
    const reqGuildPerms = [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.AddReactions,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.UseExternalEmojis,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.ReadMessageHistory,
    ];

    let checkMyGuildPerms =
      interaction.member.guild.members.me.permissions.has(reqGuildPerms);

    const reqPerms = [
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.AddReactions,
      PermissionFlagsBits.UseExternalEmojis,
      PermissionFlagsBits.AttachFiles,
    ];

    let channelsDetected = interaction.member.guild.channels.cache.map(
      (channelId) => {
        // if(channelId.type != 'GUILD_TEXT') return;
        let myPermInChannel =
          interaction.member.guild.members.me.permissionsIn(channelId);
        let permCheck = myPermInChannel.has(reqPerms) ? "" : "❕";
        // console.log(myPermInChannel.toArray());
        return `${channelId} ${permCheck}`;
      }
    );

    const embed1 = {
      color: 0x0099ff,
      title: "Asouliya's Troubleshooter",
      description: `Channels i can see: \n${channelsDetected.join(
        "\n"
      )} \nGuild Permissions check: ${
        checkMyGuildPerms ? "✅ Good" : "❌ Not Good"
      }`,
      timestamp: new Date().toISOString(),
    };
    const embed = {
      color: 0x0099ff,
      title: "Helper",
      description:
        "❕ means Asouliya is missing permission(s) in that channel. Check these permissions: Send Messages, Add Reactions, Use External Emojis, Attach Files. \n\nIf Server permissions check is not good then check these permissions for bot's role: Send Messages, Add Reactions, Manage Roles, Use External Emojis, View Channels, Attach Files, Embed Links, View Message History.",
    };

    // console.log(channelsDetected);
    await interaction.reply({ embeds: [embed1, embed] });
  },
};
