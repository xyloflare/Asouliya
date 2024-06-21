module.exports = {
  data: {
    name: "eval",
    dev: true,
  },
  async execute(args, message) {
    try {
    const evalcmd = await eval(args.join(" "))

    await message.channel.send("```" + evalcmd + "\n```");
    } catch (e) {
      message.channel.send("err: "+e);
    }
  },
};
