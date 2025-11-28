export const data = {
  name: "test",
  dev: true,
};
export async function execute(args, message, client) {
  await message.channel.send("test success ig");
}
