const levels = require("../../modules/levels");

module.exports = {
  data: {
    name: "setlevel",
    dev: true,
  },
  execute(args, message) {
    const server = args[0];
    const user = args[1];
    const level = parseInt(args[2]);
    const xp = parseInt(args[3]);
    levels.setLevel(server, user, level, xp);
    message.channel.send("Executed");
  },
};
