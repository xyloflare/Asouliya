const database = require("../modules/database");
const xpIncrementValue = 28;
const xpCalculation = (level) => (level == 0 ? 100 : level * level * 100);
const { PermissionsBitField } = require("discord.js");
// module.exports.xpCalculator = xpCalculation;

module.exports = async (message) => {
  const [guildData, isGuildCreatedNow] = await database.getGuildInfo(
    message.guildId
  );
  if (isGuildCreatedNow) return;
  if (!guildData.levelSystem) return;

  const [userData, isUserCreatedNow] = await database.getGuildUser(
    message.guildId,
    message.author.id
  );
  if (isUserCreatedNow) return;

  let curruntXp = userData.xp;
  let curruntLevel = userData.level;

  const startDate = new Date(userData.dataValues.updatedAt);
  const currentDate = new Date(message.createdTimestamp);
  const differenceInMilliseconds = currentDate - startDate;
  const differenceInSeconds = differenceInMilliseconds / 1000;

  if (differenceInSeconds < 60) return;

  let newXp = curruntXp + xpIncrementValue;

  if (newXp < xpCalculation(curruntLevel)) {
    database.updateGuildUser(message.author.id, message.guildId, {
      xp: newXp,
      level: curruntLevel,
    });
    return;
  }

  let newLevel = ++curruntLevel;
  newXp = 1;
  database.updateGuildUser(message.author.id, message.guildId, {
    xp: newXp,
    level: newLevel,
  });

  const defaultLvlMsg = `${message.author.globalName} is now at Level ${newLevel}! Keep the party going! <a:cat_dancing:1202643948699652126>`;

  let levelupMsg = guildData.levelupMsg
    ? guildData.levelupMsg
        .replace(
          "$displayname",
          `${message.author.globalName || message.author.username}`
        )
        .replace("$level", `${newLevel}`)
        .replace("$user", `<@${message.author.id}>`)
        .replace("$usertag", `${message.author.username}`)
    : defaultLvlMsg;

  
  try {
    if (guildData.levelMsgChannel) {
      if (!message.guild.members.me.permissionsIn(guildData.levelMsgChannel).has(PermissionsBitField.Flags.SendMessages)) return;
      const channel = message.client.channels.cache.get(
        guildData.levelMsgChannel
      );
      channel.send(levelupMsg);
    } else message.channel.send(levelupMsg);
  } catch(e) {return}
    
  // Now roles system
  if (
    !message.guild.members.me.permissions.has(
      PermissionsBitField.Flags.ManageRoles
    )
  )
    return;

  if (
    guildData.levelRolesEnabled &&
    guildData.levelRoles[`level_${newLevel}`]
  ) {
    try {
      message.member.roles.add(guildData.levelRoles[`level_${newLevel}`]);
    } catch (e) {
      return;
    }
  }
};

module.exports.setLevel = async (serverId, userId, level, xp) => {
  await database.updateGuildUser(userId, serverId, {
    xp: xp,
    level: level
  });
}

module.exports.giveXp = async (serverId, userId, xpAmount) => {
  const [userData] = await database.getGuildUser(serverId, userId);

  let curruntXp = userData.xp;
  let currentLevel = userData.level;

  let newXp = curruntXp + xpAmount;

  while (newXp >= xpCalculation(currentLevel)) {
    newXp -= xpCalculation(currentLevel);
    currentLevel++;
  }

  if (newXp == 0) newXp = 1;
  await database.updateGuildUser(userId, serverId, {
    xp: newXp,
    level: currentLevel,
  });

  return {
    xp: newXp,
    level: currentLevel,
  };
};
