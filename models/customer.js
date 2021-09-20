const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 20 },
    phone: { type: String, required: true, minlength: 5, maxlength: 20 },
    isGold: { type: Boolean, default: false },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });
  const result = schema.validate(customer);

  return result;
}

module.exports = {
  Customer,
  validateCustomer,
};
