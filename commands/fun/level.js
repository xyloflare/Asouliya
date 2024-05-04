const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const database = require("../../modules/database.js");
const canvacord = require("canvacord");
const xpCalculator = (level) => (level == 0 ? 100 : level * level * 100);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("See your level in this server!"),
  cooldown: 15,
  async execute(interaction) {
    await interaction.deferReply();

    const [userData, isCreatedNow] = await database.getGuildUser(
      interaction.guildId,
      interaction.user.id
    );

    if (!userData) return interaction.reply("Uh oh! No data found.");

    const curruntXp = userData.dataValues.xp;
    const curruntLevel = userData.dataValues.level;
    const requiredXp = xpCalculator(curruntLevel);

    const displayname = interaction.user.globalName;
    const color =
      0x000000 + parseInt(interaction.member.displayHexColor.substring(1), 16);

    const username = interaction.user.username;
    const userAvatarUrl = interaction.user
      .displayAvatarURL({
        size: 256,
        // extension: "jpg",
      })
      .replace(".gif", ".jpg")
      .replace(".webp", ".jpg");

    const background = "./lvlbg.jpg"; //"https://cdn.discordapp.com/attachments/1214163938401452082/1214466994330665001/qynbo9hgfcwfosnil6aprjjrixywofiyd5rwpqd14occlowxal4yqycl5tys5jnf-.jpg?ex=65f93787&is=65e6c287&hm=8727a2fc6ebb0530adacdd46182f0f70472431e35d63174929b84c5ee40b5a96&"; // "#23272a";

    
    canvacord.Font.loadDefault();
    const rankCard = new canvacord.RankCardBuilder()
      .setDisplayName(displayname)
      .setAvatar(userAvatarUrl)
      .setCurrentXP(curruntXp)
      .setLevel(curruntLevel)
      .setUsername(username)
      .setRequiredXP(requiredXp)
      .setBackground(background)
      .setOverlay(5)
      .setGraphemeProvider(canvacord.BuiltInGraphemeProvider.FluentEmojiFlat);
    const cardImgData = await rankCard.build({
      format: "png",
    });
    const attachment = new AttachmentBuilder(cardImgData);

    // const em = {
    //   color: 0xadadad, //0xa3402e,
    //   title: displayname,
    //   description: `**Level:** ${curruntLevel} \n**Xp:** ${curruntXp}/${requiredXp}`,
    //   thumbnail: {
    //     url: userAvatarUrl,
    //   },
    // };

    // await interaction.reply({ embeds: [em] });
    await interaction.editReply({ files: [attachment] });
  },
};
