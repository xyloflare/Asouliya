const { SlashCommandBuilder } = require("discord.js");
const database = require("../../modules/database.js");
const xpCalculation = require("../../modules/levels.js").xpCalc; //(level) => (level == 0 ? 100 : level * level * 100);
const canvacord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows top level users in this server"),
  cooldown: 15,
  async execute(interaction) {
    // await interaction.deferReply();

    let fetchUsers = await database.getAllGuildUsers(interaction.guildId);
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
        return `**#${index + 1}** -> <@${data.userId}> \nLevel: \`${
          data.level
        }\` \nxp: \`${data.xp}/${data.reqXp}\`\n`;
      })
      .join("\n");

    // console.log(stringData);

    const leaderboardEmbed = {
      color: 0xffffff,
      thumbnail: {
        url: interaction.guild.iconURL(),
      },
      title: "Leaderboard in " + interaction.member.guild.name,
      description: stringData,
    };

    await interaction.reply({
      embeds: [leaderboardEmbed],
      ephemeral: false,
    });

    /*
    let newRankData = await Promise.all(
      data.map(async (val, index) => {
        let user = await interaction.client.users.fetch(val.userId);

        let avatar = user
          .displayAvatarURL({
            // size: 256,
            extension: "png",
          })
          .replace(".gif", ".png")
          .replace(".webp", ".png");
        return {
          ...val,
          rank: index + 1,
          username: user.username,
          displayName: user.displayName,
          avatar: avatar, //"https://github.com/neplextech.png",
        };
      })
    );

    canvacord.Font.loadDefault();
    const lb = new canvacord.LeaderboardBuilder()
      .setHeader({
        title: `${interaction.guild.name}`,
        image: interaction.guild.iconURL(),
        subtitle: `${interaction.guild.memberCount} members`,
      })
      .setPlayers(newRankData)
      .setBackground(
        "./leaderboard_bg.jpg"
      );

    const image = await lb.build({ format: "png", height: 1000, width: 566 });
    */

    // await interaction.editReply({ files: [image] });
  },
};
