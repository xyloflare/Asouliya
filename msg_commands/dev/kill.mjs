export const data = {
  name: "kill",
  dev: true,
};
export async function execute(args, message, client) {
  await message.channel.send("Exit code 0");
  process.exit(0);
}
