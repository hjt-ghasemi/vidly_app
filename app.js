require("./startup/logger");
require("./startup/database");
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.log("jwt Private Key is not set");
  process.exit(1);
}

app.set("views", "views");
app.set("view engine", "ejs");

require("./startup/prod")(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(indexRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, function () {
  console.log(`Listening to PORT ${PORT}`);
});

module.exports = server;
