module.exports = {
  data: {
    name: "kill",
    dev: true,
  },
  async execute(args, message, client) {
    await message.channel.send("Exit code 0");
    process.exit(0);
  },
};
