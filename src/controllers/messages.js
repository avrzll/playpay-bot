import chalk from "chalk";

export const handlerMessages = async (sock, m) => {
  console.log(m);
  const reply = async (text) => {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  };

  //   console.log(`
  //     ${chalk.black.bgWhite("[ CMD ]")} ${chalk.black.bgYellow(
  //     dateTimeId()
  //   )} ${chalk.black.bgBlue(textMsg)}
  //     ${chalk.magenta("=> From")} ${chalk.green(pushName)} ${chalk.yellow(sender)}
  //     ${chalk.blue("=> In")} ${chalk.green(sender)}
  //         `);

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

    if (textMsg == "ping") {
      reply("pong!");
    }
  } catch (e) {
    console.log(`Handler Message Error: ${e.message}`);
  }
};
