const admin = require("../middlewares/admin");
const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middlewares/auth");
const validateId = require("../middlewares/validateId");

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");

    res.send(genres);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", validateId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("the genre with the given id not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
      name: req.body.name,
    });

    genre = await genre.save();

    res.send(genre);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", validateId, auth, async (req, res) => {
  try {
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );

    if (!genre) throw new Error("The genre with the given id was not found");

    res.send(genre);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", [validateId, auth, admin], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) throw new Error("The genre with the given id was not found");

    res.send(genre);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
