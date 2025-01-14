import "dotenv/config";
import chalk from "chalk";
import axios from "axios";
import { dateTime } from "../utils/dateUtils.js";
import { config } from "../config/config.js";

export const handlerMessages = async (sock, m) => {
  const { date, time } = dateTime();
  // console.log(m);
  const reply = async (text) => {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  };

  const react = async (reaction) => {
    const reactionMessage = {
      react: {
        text: reaction,
        key: m.key,
      },
    };
    await sock.sendMessage(m.key.remoteJid, reactionMessage);
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
        if (!id) {
          await react("❌");
          await reply("Mana id nya?\nContoh: .cekff 7588686637");
          return;
        }
        await react("🕒");
        const url = process.env.RAPI_URL;
        const options = {
          method: "GET",
          url: `${url}${id}`,
          headers: {
            "x-rapidapi-key": process.env.XRAPI_KEY,
            "x-rapidapi-host": process.env.XRAPI_HOST,
          },
        };
        const response = await axios.request(options);
        console.log(response.data);

        if (!response.data.error) {
          const username = response.data.data.username;
          await react("✅");
          await reply(username);
        } else {
          await react("❌");
          await reply("Username tidak ditemukan !");
        }
        break;

      default:
        break;
    }
  } catch (e) {
    await react("⚠️");
    await reply(`Handler Message Error: ${e.message}`);
    console.log(`Handler Message Error: ${e.message}`);
  }
};
