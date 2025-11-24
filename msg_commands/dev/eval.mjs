export const data = {
  name: "eval",
  dev: true,
};
export async function execute(args, message) {
  try {
    const evalcmd = await eval(args.join(" "));

    await message.channel.send("```" + evalcmd + "\n```");
  } catch (e) {
    message.channel.send("err: " + e);
  }
}
