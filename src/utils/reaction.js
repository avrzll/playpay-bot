export const react = async (m, sock, reaction) => {
  try {
    const reactionMessage = {
      react: {
        text: reaction,
        key: m.key,
      },
    };
    await sock.sendMessage(m.key.remoteJid, reactionMessage);
  } catch (error) {
    console.log(`Reaction Error: ${error}`);
  }
};
