const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("This user already registered.");

    user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));

    const salt = await bcrypt.genSalt(11);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateToken();

    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
