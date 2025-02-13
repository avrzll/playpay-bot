import mysql from "mysql";
import { config } from "../config/config.js";
import { logger, string } from "../utils/index.js";

class Database {
  constructor() {
    this.connection = mysql.createConnection(config.database);
    this.connection.connect((err) => {
      if (err) {
        logger.error(`Database connection failed: ${string(err.message)}`);
        throw err;
      }
      logger.info("Database connected successfully");
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, results) => {
        if (err) {
          logger.error(`Query Error: ${string(err)}`);
          reject(err);
        } else {
          logger.debug(`Query success: ${string(results)}`);
          resolve(results);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          logger.error(`Error when closing database: ${string(err)}`);
          reject(err);
        } else {
          logger.debug(`Closing Database success`);
          resolve();
        }
      });
    });
  }
}

export default Database;
