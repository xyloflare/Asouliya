import { setLevel } from "../../modules/levels.mjs";

export const data = {
  name: "setlevel",
  dev: true,
};
export function execute(args, message) {
  const server = args[0];
  const user = args[1];
  const level = parseInt(args[2]);
  const xp = parseInt(args[3]);
  setLevel(server, user, level, xp);
  message.channel.send("Executed");
}
