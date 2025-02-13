import { accInfo } from "../../handlers/index.js";
import { logger, react, reply, toIDR } from "../../utils/index.js";

export const accountInfo = async (m, msg, sock) => {
  try {
    let user_id;

    const msgParts = msg.split(" ");
    if (m.key.remoteJid.endsWith("g.us")) {
      if (msgParts.length > 1) {
        if (msgParts[1].includes("@")) {
          user_id = msgParts[1].split("@")[1];
        } else {
          user_id = msgParts[1];
        }
      } else {
        user_id = m.key.participant.split("@")[0];
      }
    } else {
      if (msgParts.length > 1) {
        user_id = msgParts[1];
      } else {
        user_id = m.key.remoteJid.split("@")[0];
      }
    }

    const data = await accInfo(user_id);
    if (data.success) {
      reply(
        m,
        sock,
        `
*─────〔 Informasi Akun 〕─────*

» Nama  : ${data.data.name}
» Nomor : ${data.data.user_id}
» Role  : ${data.data.role}
» Saldo : ${toIDR(data.data.balance)}

> _YOGSSTORE_

            `
      );
      react(m, sock, "✅");
    } else {
      reply(m, sock, `${data.message}`);
      react(m, sock, "❌");
    }
  } catch (e) {
    logger.error(`Case account-info error: ${e}`);
    reply(
      m,
      sock,
      `Terjadi kesalahan pada case account-info, hubungi administrator!`
    );
    react(m, sock, "⚠️");
  }
};
