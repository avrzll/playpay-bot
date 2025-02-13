/**
 * Class untuk mengelola data pengguna (users).
 */
export class Users {
  /**
   * Menginisialisasi class User dengan koneksi database.
   * @param {Object} db - Objek koneksi ke database.
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Membuat pengguna baru.
   * @param {string} user_id - ID unik pengguna.
   * @param {string} name - Nama pengguna.
   * @returns {Promise<Object>} Promise hasil dari insert.
   */
  async createUser(user_id, name) {
    return await this.db.query(
      "INSERT INTO users (user_id, name) VALUES (?, ?)",
      [user_id, name]
    );
  }

  /**
   * Mempromosikan peran (role) pengguna.
   * @param {string} user_id - ID pengguna yang akan dipromosikan.
   * @param {string} sender - ID pengguna yang mengirim perintah.
   * @returns {Promise<Object>} Promise hasil update atau error.
   */
  async promoteUser(user_id, sender) {
    // Ambil role pengirim perintah (sender)
    const [senderData] = await this.db.query(
      "SELECT role FROM users WHERE user_id = ?",
      [sender]
    );

    if (!senderData || senderData.role !== "admin") {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk mengubah role pengguna!",
      };
    }

    // Ambil role pengguna yang akan diubah
    const [user] = await this.db.query(
      "SELECT role FROM users WHERE user_id = ?",
      [user_id]
    );

    if (!user) {
      return {
        success: false,
        message: "User tidak ditemukan!",
      };
    }

    let newRole;
    switch (user.role) {
      case "member":
        newRole = "reseller";
        break;
      case "reseller":
        newRole = "admin";
        break;
      case "admin":
        return {
          success: false,
          message: "Pangkat user sudah maksimal!",
        };
      default:
        return {
          success: false,
          message: "Role user tidak valid!",
        };
    }

    // Update role pengguna
    await this.db.query("UPDATE users SET role = ? WHERE user_id = ?", [
      newRole,
      user_id,
    ]);

    return {
      success: true,
      message: `User berhasil dipromosikan ke level ${newRole}`,
    };
  }

  /**
   * Menurunkan peran (role) pengguna.
   * @param {string} user_id - ID pengguna yang akan diturunkan.
   * @param {string} sender - ID pengguna yang mengirim perintah.
   * @returns {Promise<Object>} Promise hasil update atau error.
   */
  async demoteUser(user_id, sender) {
    // Ambil role pengirim perintah (sender)
    const [senderData] = await this.db.query(
      "SELECT role FROM users WHERE user_id = ?",
      [sender]
    );

    if (!senderData || senderData.role !== "admin") {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk menurunkan role pengguna!",
      };
    }

    // Ambil role pengguna yang akan diubah
    const [user] = await this.db.query(
      "SELECT role FROM users WHERE user_id = ?",
      [user_id]
    );

    if (!user) {
      return {
        success: false,
        message: "User tidak ditemukan!",
      };
    }

    let newRole;
    switch (user.role) {
      case "admin":
        newRole = "reseller";
        break;
      case "reseller":
        newRole = "member";
        break;
      case "member":
        return {
          success: false,
          message: "User sudah berada di level terendah!",
        };
      default:
        return {
          success: false,
          message: "Role user tidak valid!",
        };
    }

    // Update role pengguna
    await this.db.query("UPDATE users SET role = ? WHERE user_id = ?", [
      newRole,
      user_id,
    ]);

    return {
      success: true,
      message: `User berhasil diturunkan ke level ${newRole}`,
    };
  }

  /**
   * Mengambil semua data pengguna dari database.
   * @returns {Promise<Array>} Promise yang menghasilkan array data pengguna.
   */
  async getUsers() {
    return await this.db.query("SELECT * FROM users");
  }

  /**
   * Mengambil data pengguna berdasarkan ID.
   * @param {string} user_id - ID pengguna.
   * @returns {Promise<Object>} Promise hasil query pengguna.
   */
  async getUserById(user_id) {
    return await this.db.query("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);
  }

  /**
   * Memperbarui saldo pengguna.
   * @param {string} user_id - ID pengguna.
   * @param {number} new_balance - Saldo baru pengguna.
   * @returns {Promise<Object>} Promise hasil update.
   */
  async updateBalance(user_id, new_balance) {
    return await this.db.query(
      "UPDATE users SET balance = ? WHERE user_id = ?",
      [new_balance, user_id]
    );
  }

  /**
   * Menghapus pengguna dari database.
   * @param {string} user_id - ID pengguna yang akan dihapus.
   * @returns {Promise<Object>} Promise hasil delete.
   */
  async deleteUser(user_id) {
    return await this.db.query("DELETE FROM users WHERE user_id = ?", [
      user_id,
    ]);
  }
}
