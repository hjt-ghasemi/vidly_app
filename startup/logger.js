const { createLogger, transports } = require("winston");
// require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.File({ filename: "combined.log" }),

    // new transports.MongoDB({
    //   db: "mongodb://localhost/winston",
    //   level: "error",
    // }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "rejections.log" })],
});

module.exports = logger;
