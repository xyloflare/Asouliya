module.exports = {
  data: {
    name: "eval",
    dev: true,
  },
  execute(args, message) {
    const evalcmd = eval(args.join(" "))

    message.channel.send("```" + evalcmd + "\n```");
  },
};
