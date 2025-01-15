import "dotenv/config";
import chalk from "chalk";
import { dateTime } from "../utils/dateUtils.js";
import { config } from "../config/config.js";
import { fetchGameData } from "../services/fetchGameData.js";

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

      // <======================================== CEKFF ========================================>
      case "cekff":
        const idff = textMsg.split(" ")[1];
        if (!idff) {
          await react("❌");
          await reply("Mana id nya?\nContoh: .cekff 7588686637");
          return;
        }
        await react("🕒");

        const resff = await fetchGameData(`${"ff-global"}/${idff}`);

        if (!resff.error) {
          const username = resff.data.username;
          await react("✅");
          await reply(username);
        } else if (resff.error && resff.status === 404) {
          await react("❌");
          await reply("Username tidak ditemukan !");
        } else {
          await react("⚠️");
          await reply(resff.message);
        }
        break;

      // <======================================== CEKML ========================================>
      case "cekml":
        const idml = textMsg.split(" ")[1];
        const zone = textMsg.split(" ")[2];
        if (!idml || !zone) {
          await react("❌");
          await reply("Mana id nya?\nContoh: .cekml 1393323764 15748");
          return;
        }
        await react("🕒");

        const resml = await fetchGameData(
          `${"mobile-legends"}/${idml}/${zone}`
        );

        if (!resml.error) {
          const username = resml.data.username;
          await react("✅");
          await reply(username);
        } else if (resml.error && resml.status === 404) {
          await react("❌");
          await reply("Username tidak ditemukan !");
        } else {
          await react("⚠️");
          await reply(resml.message);
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
