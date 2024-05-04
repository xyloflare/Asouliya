const levels = require("../../modules/levels");

module.exports = {
  data: {
    name: "givexp",
    dev: true,
  },
  execute(args, message, client) {
    const server = args[0];
    const user = args[1];
    const xp = parseInt(args[2]);
    levels.giveXp(server, user, xp);
    message.channel.send("Executed");
  },
};
