const router = require("express").Router();
const auth = require("../middlewares/auth");
const { Rental } = require("../models/rental");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerId is not provided");

  if (!req.body.movieId) return res.status(400).send("movieId is not provided");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("rental not found");

  if (rental.dateReturned)
    return res.status(400).send("this rental already returned");

  rental.dateReturned = Date.now();
  const rentalSpan = rental.dateReturned - rental.dateOut;
  rental.rentalFee = (
    (rental.movie.dailyRentalRate * rentalSpan) /
    8.64e7
  ).toFixed(2);

  await rental.save();
  res.send(rental);
});

module.exports = router;
//  /api/returns   POST   input=> {customerId, movieId}  output=> completed rental

// return 401 status if user is not authorized -DONE
// return 400 status if customerId is invalid -DONE
// return 400 status if movieId is invalid -DONE
// return 404 status if no rental found -DONE
// return 400 if the rental was processed already

// return 200 status and complete rental to client
