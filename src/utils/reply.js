export const reply = async (m, sock, text) => {
  try {
    await sock.sendMessage(m.key.remoteJid, { text: text }, { quoted: m });
  } catch (error) {
    console.log(`Error sending reply: ${error}`);
  }
};
