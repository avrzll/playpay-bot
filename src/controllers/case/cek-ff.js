import { fetchGameData } from "../../services/index.js";
import { react, reply, validateFreeFireID } from "../../utils/index.js";

export const cekFF = async (m, sock, id) => {
  try {
    if (!id) {
      await react(m, sock, "❌");
      await reply(m, sock, "Mana id nya?\nContoh: .cekff 7588686637");
      return;
    }
    if (!validateFreeFireID(id)) {
      await react(m, sock, "❌");
      await reply(m, sock, "ID Free Fire harus 8-12 angka!");
      return;
    }
    await react(m, sock, "🕒");

    const res = await fetchGameData(`${"ff-global"}/${id}`);

    if (!res.error) {
      const username = res.data.username;
      await react(m, sock, "✅");
      await reply(m, sock, username);
    } else if (res.error && res.status === 404) {
      await react(m, sock, "❌");
      await reply(m, sock, "Username tidak ditemukan !");
    } else {
      await react(m, sock, "⚠️");
      await reply(m, sock, res.message);
    }
  } catch (err) {
    console.error("Error cekFF", err);
  }
};
