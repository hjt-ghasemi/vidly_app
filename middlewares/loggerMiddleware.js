function log(req, res, next) {
  console.log("logger in other file ...");
  next();
}

module.exports = log;
