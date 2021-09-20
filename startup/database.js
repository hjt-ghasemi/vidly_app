const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("config");

const db = config.get("db");

mongoose.connect(db).then(() => {
  // logger.info(`Connected to ${db} successfully`);
  console.log(`Connected to ${db} successfully`);
});
