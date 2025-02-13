import { addUsers } from "../../handlers/index.js";
import { logger, react, reply } from "../../utils/index.js";

export const addUser = async (m, sock) => {
  try {
    const no_hp = m.key.remoteJid.split("@")[0];
    const username = m.pushName;
    const res = await addUsers(no_hp, username);
    await reply(m, sock, res.message);
    await react(m, sock, res.emot);
  } catch (e) {
    logger.debug(`Error at case add user: ${e}`);
    await reply(m, sock, `Error at case add user: ${e}`);
    await react(m, sock, "⚠️");
  }
};
