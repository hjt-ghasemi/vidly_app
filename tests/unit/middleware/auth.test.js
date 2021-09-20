const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const auth = require("../../../middlewares/auth");

describe("auth middlware", () => {
  it("should add user property to request object", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateToken();
    const res = {};
    const next = jest.fn();
    const req = { header: jest.fn().mockReturnValue(token) };
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
