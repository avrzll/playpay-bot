import { promoteUser } from "../../handlers/index.js";
import { logger, react, reply } from "../../utils/index.js";

export const promote = async (m, msg, sock) => {
  try {
    let user_id;
    let sender_id;

    if (msg.split(" ")[1].includes("@")) {
      user_id = msg.split(" ")[1];
      user_id = user_id.split("@")[1];
    } else {
      user_id = msg.split(" ")[1];
    }

    if (m.key.remoteJid.endsWith("g.us")) {
      sender_id = m.key.participant.split("@")[0];
    } else {
      sender_id = m.key.remoteJid.split("@")[0];
    }

    const res = await promoteUser(user_id, sender_id);
    reply(m, sock, res.message);
    react(m, sock, res.emot);
  } catch (error) {
    logger.error(`Error promoting user: ${error}`);
    reply(m, sock, `Error promoting user: ${error}`);
    react(m, sock, `⚠️`);
  }
};
