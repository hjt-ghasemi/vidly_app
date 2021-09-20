const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middlewares/auth");
const logger = require("../startup/logger");

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();

    res.send(movies);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) throw new Error("The movie with the given id was not found");
    res.send(movie);
  } catch (err) {
    logger.error(err.message, err);
    res.status(404).send(err.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validateMovie(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genre);

    if (!genre) throw new Error("Given genre ID is not found");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      dailyRentalRate: req.body.dailyRentalRate,
      numberInStock: req.body.numberInStock,
    });

    await movie.save();

    res.send(movie);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validateMovie(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genre);

    if (!genre) throw new Error("Given genre ID is not found");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock,
      },
      {
        new: true,
      }
    );

    if (!movie) throw new Error("The movie with the given id was not found");

    res.send(movie);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) throw new Error("The movie with the given id was not found");

    res.send(movie);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
