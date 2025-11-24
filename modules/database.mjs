import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

const guildInfo = sequelize.define("guildInfo", {
  serverid: {
    type: DataTypes.STRING,
    unique: true,
  },
  prefix: {
    type: DataTypes.STRING,
    defaultValue: "&",
    allowNull: false,
  },
  levelRolesEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  levelMsgChannel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  levelRoles: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const levelroles = this.getDataValue("levelRoles");
      if (!levelroles) return null;
      return levelroles ? JSON.parse(levelroles) : null;
    },
    set(value) {
      this.setDataValue("levelRoles", JSON.stringify(value));
    },
  },
  levelSystem: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  levelupMsg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const guildUserInfo = sequelize.define("guildUserInfo", {
  userid: {
    type: DataTypes.STRING,
  },
  serverid: {
    type: DataTypes.STRING,
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export function initialize() {
  guildUserInfo.sync();
  guildInfo.sync();
}
// update methods -------------------------------
export async function updateGuildInfo(serverid, data) {
  if (!data) return;
  const UpdatedRows = await guildInfo.update(
    {
      ...(data.prefix && { prefix: data.prefix }),
      ...(data.levelRoles && { levelRoles: data.levelRoles }),
      ...(data.levelRolesEnabled && {
        levelRolesEnabled: data.levelRolesEnabled,
      }),
      ...(data.levelMsgChannel && { levelMsgChannel: data.levelMsgChannel }),
      ...(data.levelSystem && { levelSystem: data.levelSystem }),
      ...(data.levelupMsg && { levelupMsg: data.levelupMsg }),
    },
    {
      where: {
        serverid: `${serverid}`,
      },
    },
  ); if (!UpdatedRows > 0) {
    console.log("Error editing guildInfo database where serverid: " + serverid);
  }
}
export async function updateGuildUser(userid, serverid, data) {
  if (!data) return;
  let updatedRows = guildUserInfo.update(
    {
      ...(data.xp && { xp: data.xp }),
      ...(data.level && { level: data.level }),
    },
    {
      where: {
        serverid: serverid,
        userid: userid,
      },
    },
  );
  if (!updatedRows > 0) console.log("error updating guilduserinfo");
}
// Delete methods -------------------------
export async function deleteGuildInfo(serverid) {
  try {
    await guildInfo.destroy({ where: { serverid: `${serverid}` } });
  } catch (err) {
    console.log("Error in deleteGuildInfo in database", err);
  }
}
export async function deleteGuildUser(userid, serverid) {
  try {
    await guildUserInfo.destroy({
      where: { serverid: `${serverid}`, userid: `${userid}` },
    });
    return true;
  } catch (err) {
    console.log("Error in deleteGuildUser in database", err);
    return false;
  }
}
// Get methods -----------------------------
export async function getGuildInfo(serverid) {
  const guildData = await guildInfo.findOrCreate({
    where: { serverid: `${serverid}` },
  });
  // console.log(guildData);
  return guildData;
}

export async function getGuildUser(serverid, userid) {
  const guildUserData = await guildUserInfo.findOrCreate({
    where: { serverid: `${serverid}`, userid: `${userid}` },
  });
  // console.log(guildUserData);
  return guildUserData;
}

export async function getAllGuildUsers(serverid) {
  let data = await guildUserInfo.findAll({
    where: {
      serverid: serverid,
    },
  });
  // console.log(data);
  return data;
}

// module.exports = {
//   initialize,
//   getGuildInfo,
//   getGuildUser,
//   updateGuildInfo,
//   updateGuildUser,
//   deleteGuildInfo,
//   deleteGuildUser,
// };
