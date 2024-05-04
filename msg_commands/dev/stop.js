module.exports = {
  data: {
    name: "stop",
    dev: true,
  },
  async execute(args, message, client) {
    await message.channel.send(
      "Exit code 1. Restart timer <a:60sec:1234423387875577897>"
    );
    process.exit(1);
  },
};
