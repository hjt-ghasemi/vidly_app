const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");

    res.send(rentals);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.id });
    if (!rental) throw new Error("The rental with the given id was not found");
    res.send(rental);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) throw new Error("customer with given id not found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) throw new Error("movie with given id not found");
    if (movie.numberInStock === 0)
      throw new Error("there is no stock for rental of this movie");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    rental = await rental.save();
    movie.numberInStock -= 1;

    movie.save();
    res.send(rental);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { error } = validateRental(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) throw new Error("customer with given id not found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) throw new Error("movie with given id not found");

    const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!rental) throw new Error("The rental with the given id was not found");

    res.send(rental);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) throw new Error("The Rental with the given id was not found");

    res.send(rental);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
