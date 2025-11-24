export const data = {
  name: "stop",
  dev: true,
};
export async function execute(args, message, client) {
  await message.channel.send(
    "Exit code 1. Restart timer <a:60sec:1234423387875577897>",
  );
  process.exit(1);
}
