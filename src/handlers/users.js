import Database from "../database/database.js";
import { Users } from "../models/index.js";
import { logger, parse, string, toIDR } from "../utils/index.js";

const database = new Database();
const db = new Users(database);

// REGISTER HANDLER
export const addUsers = async (user_id, username) => {
  try {
    let data = await db.createUser(user_id, username);

    if (data.affectedRows > 0) {
      logger.debug(`${string(data)}`);
      logger.info(`Added user ${username} successfully`);
      return {
        success: true,
        message: `
✅ SUCCESS!
==== INFORMASI AKUN ====

❍ Nama  : ${username}
❍ No HP : ${user_id}
❍ Role  : member
❍ Saldo : ${toIDR(0)}
        `,
        emot: "✅",
      };
    } else {
      logger.error(`Failed to add user ${username}`);
      return {
        success: false,
        message: `Gagal mendaftarkan akun!`,
        emot: "❌",
      };
    }
  } catch (e) {
    logger.error(`Error when creating user at handler/users.js: ${string(e)}`);
    if (e.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        message: "Anda sudah terdaftar!",
        emot: "✅",
      };
    }
    return {
      success: false,
      message: `Error when register: ${string(e.sqlMessage)}`,
      emot: "⚠️",
    };
  }
};

// PROMOTE HANDLER
export const promoteUser = async (user_id, sender) => {
  try {
    let data = await db.promoteUser(user_id, sender);

    if (data.success) {
      logger.info(`Promoted user ${user_id} successfully`);
      return {
        success: true,
        message: `${data.message}`,
        emot: "✅",
      };
    } else {
      logger.error(`Failed to promote user ${user_id} \n ${data.message}`);
      return {
        success: false,
        message: `${data.message}`,
        emot: "❌",
      };
    }
  } catch (e) {
    logger.error(`Error when Promote user at handler/users.js: ${string(e)}`);
    return {
      success: false,
      message: `Error when promote: ${string(e.sqlMessage)}`,
      emot: "⚠️",
    };
  }
};

// DEMOTE HANDLER
export const demoteUser = async (user_id, sender) => {
  try {
    let data = await db.demoteUser(user_id, sender);

    if (data.success) {
      logger.info(`Demoted user ${user_id} successfully`);
      return {
        success: true,
        message: `${data.message}`,
        emot: "✅",
      };
    } else {
      logger.error(`Failed to demote user ${user_id} \n ${data.message}`);
      return {
        success: false,
        message: `${data.message}`,
        emot: "❌",
      };
    }
  } catch (e) {
    logger.error(`Error when demote user at handler/users.js: ${string(e)}`);
    return {
      success: false,
      message: `Error when demote: ${string(e.sqlMessage)}`,
      emot: "⚠️",
    };
  }
};

// ACCOUNT INFO HANDLER
export const accInfo = async (user_id) => {
  try {
    let data = await db.getUserById(user_id);
    if (data.length > 0) {
      data = data[0];
      data = parse(string(data));
      return {
        success: true,
        message: "Data found",
        data: data,
      };
    } else {
      return {
        success: false,
        message: "Data not found!",
        data: null,
      };
    }
  } catch (e) {
    logger.error(
      `Error when getting user info at handler/users.js: ${string(e)}`
    );
    return {
      success: false,
      message: "Error when getting user info",
      data: null,
    };
  }
};
