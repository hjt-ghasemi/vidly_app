const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort("name");

    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (!customer)
      throw new Error("The customer with the given id was not found");
    res.send(customer);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer(req.body);
    customer = await customer.save();
    res.send(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validateCustomer(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!customer)
      throw new Error("The customer with the given id was not found");

    res.send(customer);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer)
      throw new Error("The customer with the given id was not found");

    res.send(customer);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = router;
