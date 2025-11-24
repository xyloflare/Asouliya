import { giveXp } from "../../modules/levels.mjs";

export const data = {
  name: "givexp",
  dev: true,
};
export function execute(args, message, client) {
  const server = args[0];
  const user = args[1];
  const xp = parseInt(args[2]);
  giveXp(server, user, xp);
  message.channel.send("Executed");
}
