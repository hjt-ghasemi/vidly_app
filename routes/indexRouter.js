const express = require("express");
const router = express.Router();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genresRouter = require("./genres");
const customersRouter = require("./customers");
const moviesRouter = require("./movies");
const rentalsRouter = require("./rentals");
const usersRouter = require("./users");
const authRouter = require("./auth");
const returnsRouter = require("./returns");

router.get("/", (req, res) => {
  res.render("index");
});

router.use("/api/genres", genresRouter);
router.use("/api/customers", customersRouter);
router.use("/api/movies", moviesRouter);
router.use("/api/rentals", rentalsRouter);
router.use("/api/users", usersRouter);
router.use("/api/auth", authRouter);
router.use("/api/returns", returnsRouter);

module.exports = router;
