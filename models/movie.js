const mongoose = require("mongoose");
const Joi = require("joi");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    genre: new mongoose.Schema({
      name: { type: String, required: true, minlength: 3, maxlength: 50 },
    }),
    numberInStock: {
      type: Number,
      default: 0,
    },
    dailyRentalRate: { type: Number, default: 0 },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    genre: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });
  const result = schema.validate(movie);

  return result;
}

module.exports = {
  Movie: Movie,
  validateMovie,
};
