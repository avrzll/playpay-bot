import { demoteUser } from "../../handlers/index.js";
import { logger, react, reply, string } from "../../utils/index.js";

export const demote = async (m, msg, sock) => {
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

    const res = await demoteUser(user_id, sender_id);
    reply(m, sock, res.message);
    react(m, sock, res.emot);
  } catch (error) {
    logger.error(`Error demotting user:d ${error}`);
    reply(m, sock, "tes");
    // reply(m, sock, `Error demotting user: }`);
    // react(m, sock, `⚠️`);
  }
};
