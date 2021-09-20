const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 100,
        },
        phone: { type: Number, minlength: 5, maxlenght: 20, required: true },
        isGold: { type: Boolean, default: false },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          minlength: 5,
          maxlenght: 150,
          required: true,
          trim: true,
        },
        dailyRentalRate: {
          type: Number,
          min: 0,
          max: 255,
          required: true,
        },
      }),
      required: true,
    },
    dateOut: { type: Date, default: Date.now, required: true },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  const result = schema.validate(req);

  return result;
}

module.exports = {
  Rental,
  validateRental,
};
