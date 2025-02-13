import { fetchGameData } from "../../services/index.js";
import { react, reply, validateMobileLegendsID } from "../../utils/index.js";

export const cekML = async (m, sock, id, zoneId) => {
  try {
    if (!id || !zoneId) {
      await react(m, sock, "❌");
      await reply(m, sock, "Mana id nya?\nContoh: .cekml 1393323764 15748");
      return;
    }
    if (!validateMobileLegendsID(id, zoneId)) {
      await react(m, sock, "❌");
      await reply(
        m,
        sock,
        "ID Mobile Legends harus 6-14 angka dan ID Zona 4-6 angka!"
      );
      return;
    }
    await react(m, sock, "🕒");

    const res = await fetchGameData(`${"mobile-legends"}/${id}/${zoneId}`);

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
    console.log(`Error cekML: ${err}`);
  }
};
