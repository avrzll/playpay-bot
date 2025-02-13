import "dotenv/config";
import chalk from "chalk";
import { dateTime } from "../utils/date-utils.js";
import { config } from "../config/config.js";
import { reply } from "../utils/reply.js";
import { react } from "../utils/reaction.js";
import {
  addUser,
  cekFF,
  cekML,
  promote,
  demote,
  accountInfo,
} from "./case/index.js";

export const handlerMessages = async (sock, m) => {
  const { date, time } = dateTime();
  console.log(m);
  try {
    if (!m.message) return;

    const msgType = Object.keys(m.message)[0];

    const msg =
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
      )} ${chalk.black.bgBlue(msg)}
${chalk.magenta("=> From")} ${chalk.green(m.pushName)} ${chalk.yellow(sender)}
${chalk.blue("=> In")} ${chalk.green(m.key.remoteJid)}
`
    );

    let command;
    for (const p of config.prefix) {
      if (msg.startsWith(p)) {
        command = msg.slice(p.length).split(" ")[0].toLowerCase();
        break;
      }
    }

    switch (command) {
      case "ping":
        await reply(m, sock, "pong");
        await react(m, sock, "🗿");
        break;

      // <=================================== CREATE USER ====================================>
      case "regist":
        addUser(m, sock);
        break;

      // <==================================== PROMOTE ======================================>
      case "promote":
        promote(m, msg, sock);
        break;

      // <===================================== DEMOTE =======================================>
      case "demote":
        demote(m, msg, sock);
        break;

      // <================================= ACCOUNT INFO ====================================>
      case "info":
        accountInfo(m, msg, sock);
        break;

      // <======================================== CEKFF ========================================>
      case "cekff":
        const idff = msg.split(" ")[1];
        await cekFF(m, sock, idff);
        break;

      // <======================================== CEKML ========================================>
      case "cekml":
        const idml = msg.split(" ")[1];
        const zone = msg.split(" ")[2];
        await cekML(m, sock, idml, zone);
        break;

      case "ff":
        const product = msg.split(" ")[1];
        const id = msg.split(" ")[2];
        break;

      default:
        break;
    }
  } catch (e) {
    await react(m, sock, "⚠️");
    await reply(m, sock, `Handler Message Error: ${e.message}`);
    console.log(`Handler Message Error: ${e.message}`);
  }
};
