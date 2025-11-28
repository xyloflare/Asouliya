export const data = {
  name: "update",
  dev: true,
};
export async function execute(args, message, client) {
  await message.channel.send("Exit code 5. Trying to update");
  process.exit(5);
}
