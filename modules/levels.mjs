import * as database from "./database.mjs";

const xpIncrementValue = 18;
const xpCalculation = (level) => {
  return level == 0
    ? 50
    : level * level * 100 - (level - 1) * (level - 1) * 100;
};
import { PermissionsBitField } from "discord.js";

const leveler = async (message) => {
  const [guildData, isGuildCreatedNow] = await database.getGuildInfo(
    message.guildId,
  );
  if (isGuildCreatedNow) return;
  if (!guildData.levelSystem) return;

  const [userData, isUserCreatedNow] = await database.getGuildUser(
    message.guildId,
    message.author.id,
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
        `${message.author.globalName || message.author.username}`,
      )
      .replace("$level", `${newLevel}`)
      .replace("$user", `<@${message.author.id}>`)
      .replace("$usertag", `${message.author.username}`)
    : defaultLvlMsg;

  try {
    if (guildData.levelMsgChannel) {
      if (
        !message.guild.members.me
          .permissionsIn(guildData.levelMsgChannel)
          .has(PermissionsBitField.Flags.SendMessages)
      )
        return;
      const channel = message.client.channels.cache.get(
        guildData.levelMsgChannel,
      );
      channel.send(levelupMsg);
    } else message.channel.send(levelupMsg);
  } catch (e) {
    return;
  }

  if (
    !message.guild.members.me.permissions.has(
      PermissionsBitField.Flags.ManageRoles,
    )
  ) return console.log('missing perms to add role', message.guild.name);

  if (
    guildData.levelRolesEnabled &&
    guildData.levelRoles[`level_${newLevel}`] &&
    !message.member.roles.cache.some((role) => role.id === guildData.levelRoles[`level_${newLevel}`])
  ) {
    try {
      console.log('attempted to add role')
      message.member.roles.add(guildData.levelRoles[`level_${newLevel}`]);
    } catch (e) {
      console.log(e);
      return;
    }
  }
};

const setLevel = async (serverId, userId, level, xp) => {
  await database.updateGuildUser(userId, serverId, {
    xp: xp,
    level: level,
  });
};

const giveXp = async (serverId, userId, xpAmount) => {
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

export default leveler;
export const xpCalc = xpCalculation;
const _giveXp = giveXp;
export { _giveXp as giveXp };
const _setLevel = setLevel;
export { _setLevel as setLevel };
