import chalk from "chalk";
import { dateTime } from "../utils/dateUtils.js";
import { config } from "../config/config.js";
const { date, time } = dateTime();

export const handlerMessages = async (sock, m) => {
  console.log(m);
  const reply = async (text) => {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  };

  try {
    if (!m.message) return;

    const msgType = Object.keys(m.message)[0];

    const textMsg =
      msgType === "conversation"
        ? m.message.conversation
        : msgType === "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : msgType === "imageMessage"
        ? m.message.imageMessage.caption
        : "";

    const remoteJid = m.key.remoteJid;
    const sender = remoteJid.endsWith("@g.us")
      ? m.key.participant
      : m.key.remoteJid;
    console.log(
      `
${chalk.black.bgWhite("[ CMD ]")} ${chalk.black.bgYellow(
        `${date} | ${time} WIB`
      )} ${chalk.black.bgBlue(textMsg)}
${chalk.magenta("=> From")} ${chalk.green(m.pushName)} ${chalk.yellow(sender)}
${chalk.blue("=> In")} ${chalk.green(m.key.remoteJid)}
`
    );

    let command;
    for (const p of config.prefix) {
      if (textMsg.startsWith(p)) {
        command = textMsg.slice(p.length).split(" ")[0].toLowerCase();
        break;
      }
    }

    switch (command) {
      case "ping":
        reply("pong");
        break;

      case "cekff":
        const id = textMsg.split(" ")[1];
        console.log(id);

        break;

      default:
        break;
    }
  } catch (e) {
    console.log(`Handler Message Error: ${e.message}`);
  }
};
